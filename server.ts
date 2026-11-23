import "dotenv/config";
import express from "express";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err;
      const status =
        typeof err === "object" && err !== null && "status" in err
          ? Number((err as { status?: number }).status)
          : 0;
      if (status === 400 || status === 403 || status === 404 || attempt === maxRetries) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
    }
  }
  throw lastError;
}

function safeParseJson<T>(rawText: string): T {
  const cleaned = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(cleaned) as T;
}

function mapGeminiError(err: unknown): { status: number; message: string } {
  if (err instanceof Error && err.message === "GEMINI_API_KEY_MISSING") {
    return {
      status: 500,
      message:
        "ဆာဗာတွင် GEMINI_API_KEY သတ်မှတ်ထားခြင်း မရှိသေးပါ။ Settings > Secrets တွင် ထည့်သွင်းစစ်ဆေးပါ။",
    };
  }
  const status =
    typeof err === "object" && err !== null && "status" in err
      ? Number((err as { status?: number }).status)
      : 500;

  if (status === 400 || status === 403) {
    return {
      status,
      message:
        "AI ဝန်ဆောင်မှု API Key ခွင့်ပြုချက် မအောင်မြင်ပါ။ Settings > Secrets တွင် စစ်ဆေးပေးပါ။",
    };
  }
  if (status === 429) {
    return {
      status: 429,
      message:
        "AI ခေါ်ဆိုမှု အကြိမ်ရေ ခေတ္တပြည့်နေပါသည်။ ခဏစောင့်ပြီး ထပ်မံကြိုးစားကြည့်ပါ။",
    };
  }
  return {
    status: 500,
    message:
      "AI မြေဆီလွှာ ခွဲခြမ်းစိတ်ဖြာမှု ပြုလုပ်ရာတွင် အခက်အခဲရှိနေပါသည်။ အင်တာနက်လိုင်းစစ်ဆေးပြီး ထပ်မံကြိုးစားကြည့်ပါ။",
  };
}

interface RegionCoords {
  lat: number;
  lon: number;
  stationLabelMm: string;
}

const MYANMAR_REGION_COORDS: Record<string, RegionCoords> = {
  "ဧရာဝတီတိုင်းဒေသကြီး": { lat: 16.7792, lon: 94.7321, stationLabelMm: "ပုသိမ်/ဧရာဝတီ ဒေသ" },
  "ပဲခူးတိုင်းဒေသကြီး": { lat: 17.3352, lon: 96.4814, stationLabelMm: "ပဲခူး ဒေသ" },
  "စစ်ကိုင်းတိုင်းဒေသကြီး": { lat: 22.1086, lon: 95.1358, stationLabelMm: "မုံရွာ/စစ်ကိုင်း ဒေသ" },
  "မန္တလေးတိုင်းဒေသကြီး": { lat: 21.9588, lon: 96.0891, stationLabelMm: "မန္တလေး ဒေသ" },
  "မကွေးတိုင်းဒေသကြီး": { lat: 20.1496, lon: 94.9325, stationLabelMm: "မကွေး ဒေသ" },
  "ရန်ကုန်တိုင်းဒေသကြီး": { lat: 16.8661, lon: 96.1951, stationLabelMm: "ရန်ကုန် ဒေသ" },
  "ရှမ်းပြည်နယ်": { lat: 20.7892, lon: 97.0378, stationLabelMm: "တောင်ကြီး/ရှမ်း ဒေသ" },
  "မွန်ပြည်နယ်": { lat: 16.4905, lon: 97.6283, stationLabelMm: "မော်လမြိုင်/မွန် ဒေသ" },
  "နေပြည်တော်": { lat: 19.7633, lon: 96.0785, stationLabelMm: "နေပြည်တော် ဒေသ" },
  "ကချင်ပြည်နယ်": { lat: 25.3833, lon: 97.4, stationLabelMm: "မြစ်ကြီးနား/ကချင် ဒေသ" },
  "တနင်္သာရီတိုင်းဒေသကြီး": { lat: 14.0823, lon: 98.1915, stationLabelMm: "ထားဝယ်/တနင်္သာရီ ဒေသ" },
};

function describeWmoCodeMm(code: number): string {
  if (code === 0) return "နေသာကြည်လင်";
  if (code === 1 || code === 2) return "တိမ်အသင့်အတင့်";
  if (code === 3) return "တိမ်ထူထပ်";
  if (code === 45 || code === 48) return "မြူဆိုင်း";
  if (code >= 51 && code <= 57) return "မိုးဖွဲကျ";
  if (code >= 61 && code <= 65) return code === 65 ? "မိုးသည်းထန်" : "မိုးရွာ";
  if (code >= 66 && code <= 67) return "မိုးအေးရွာ";
  if (code >= 80 && code <= 82) return code === 82 ? "မိုးသည်းထန်စွာရွာ" : "မိုးအနည်းငယ်မှ အသင့်အတင့်";
  if (code >= 95 && code <= 99) return "မိုးကြိုးမုန်တိုင်းနှင့် လေပြင်း";
  return "ပုံမှန်ရာသီဥတု";
}

function formatDayLabelMm(dateIso: string, index: number): string {
  if (index === 0) return `ယနေ့ (${dateIso.slice(5)})`;
  if (index === 1) return `မနက်ဖြန် (${dateIso.slice(5)})`;
  return `သန်ဘက်ခါ (${dateIso.slice(5)})`;
}

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  app.use(express.json({ limit: "15mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.get("/api/weather", async (req, res) => {
    try {
      const rawRegion =
        typeof req.query.region === "string" && req.query.region.trim()
          ? req.query.region.trim()
          : "ဧရာဝတီတိုင်းဒေသကြီး";

      const coords = MYANMAR_REGION_COORDS[rawRegion];
      if (!coords) {
        res.status(400).json({
          error: "ရွေးချယ်ထားသော ဒေသအမည် မမှန်ကန်ပါ။ မြန်မာနိုင်ငံ တိုင်း/ပြည်နယ်စာရင်းမှ ရွေးချယ်ပါ။",
        });
        return;
      }

      const url = new URL("https://api.open-meteo.com/v1/forecast");
      url.searchParams.set("latitude", String(coords.lat));
      url.searchParams.set("longitude", String(coords.lon));
      url.searchParams.set("timezone", "Asia/Yangon");
      url.searchParams.set("forecast_days", "3");
      url.searchParams.set(
        "current",
        "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m"
      );
      url.searchParams.set(
        "daily",
        "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,et0_fao_evapotranspiration"
      );

      const upstreamRes = await fetch(url.toString(), {
        headers: { Accept: "application/json", "User-Agent": "myanma-farm-friend" },
        signal: AbortSignal.timeout(8000),
      });

      if (!upstreamRes.ok) {
        throw new Error(`Weather upstream failed with ${upstreamRes.status}`);
      }

      const raw = (await upstreamRes.json()) as {
        current?: {
          temperature_2m?: number;
          relative_humidity_2m?: number;
          precipitation?: number;
          weather_code?: number;
          wind_speed_10m?: number;
        };
        daily?: {
          time?: string[];
          weather_code?: number[];
          temperature_2m_max?: number[];
          temperature_2m_min?: number[];
          precipitation_sum?: number[];
          precipitation_probability_max?: number[];
          wind_speed_10m_max?: number[];
          et0_fao_evapotranspiration?: number[];
        };
      };

      const times = raw.daily?.time ?? [];
      if (times.length === 0) {
        throw new Error("Empty weather forecast payload");
      }

      const days = times.slice(0, 3).map((dateIso, i) => {
        const weatherCode = Number(raw.daily?.weather_code?.[i] ?? 0);
        return {
          dateIso,
          dayLabelMm: formatDayLabelMm(dateIso, i),
          weatherCode,
          conditionMm: describeWmoCodeMm(weatherCode),
          tempMaxC: Math.round(Number(raw.daily?.temperature_2m_max?.[i] ?? 0) * 10) / 10,
          tempMinC: Math.round(Number(raw.daily?.temperature_2m_min?.[i] ?? 0) * 10) / 10,
          precipitationMm:
            Math.round(Number(raw.daily?.precipitation_sum?.[i] ?? 0) * 10) / 10,
          precipitationProbPercent: Math.round(
            Number(raw.daily?.precipitation_probability_max?.[i] ?? 0)
          ),
          windMaxKmh:
            Math.round(Number(raw.daily?.wind_speed_10m_max?.[i] ?? 0) * 10) / 10,
          evapotranspirationMm:
            Math.round(
              Number(raw.daily?.et0_fao_evapotranspiration?.[i] ?? 0) * 10
            ) / 10,
        };
      });

      const totalRain3DayMm =
        Math.round(days.reduce((sum, d) => sum + d.precipitationMm, 0) * 10) / 10;
      const maxDailyRainMm = Math.max(...days.map((d) => d.precipitationMm));
      const maxTemp3DayC = Math.max(...days.map((d) => d.tempMaxC));
      const minTemp3DayC = Math.min(...days.map((d) => d.tempMinC));
      const maxWind3DayKmh = Math.max(...days.map((d) => d.windMaxKmh));
      const maxEt0Mm = Math.max(...days.map((d) => d.evapotranspirationMm));
      const hasStormCode = days.some((d) => d.weatherCode >= 95);
      const currentHumidity = Math.round(
        Number(raw.current?.relative_humidity_2m ?? 60)
      );

      const alerts: {
        kind: "flood" | "drought" | "heat" | "wind" | "normal";
        severity: "high" | "moderate" | "normal";
        severityLabelMm: string;
        titleMm: string;
        summaryMm: string;
        farmActionsMm: string[];
      }[] = [];

      // 1. Flood / Heavy Rainfall Risk
      if (maxDailyRainMm >= 50 || totalRain3DayMm >= 85 || hasStormCode) {
        alerts.push({
          kind: "flood",
          severity: "high",
          severityLabelMm: "အထူးသတိပေးချက် (အဆင့်မြင့်)",
          titleMm: "ရေကြီးရေလျှံနှင့် မိုးသည်းထန်စွာရွာသွန်းနိုင်မှု သတိပေးချက်",
          summaryMm: `လာမည့် ၃ ရက်အတွင်း စုစုပေါင်းမိုးရေချိန် ${totalRain3DayMm} mm (တစ်ရက်အများဆုံး ${maxDailyRainMm} mm) အထိ ရှိနိုင်သဖြင့် မြေနိမ့်စိုက်ခင်းများ ရေဝပ်/ရေလွှမ်းမိုးနိုင်ခြေ မြင့်မားပါသည်။`,
          farmActionsMm: [
            "စိုက်ခင်းဘေးပတ်လည် ရေထုတ်မြောင်းများကို မိုးမရွာမီ ချက်ချင်းရှင်းလင်းဖွင့်ပေးပါ။",
            "ယူရီးယားမြေဩဇာကျွေးခြင်းနှင့် ပိုးသတ်ဆေး/ရွက်ဖျန်းဆေး ဖျန်းခြင်းကို မိုးစဲချိန်အထိ ရွှေ့ဆိုင်းပါ။",
            "ရင့်မှည့်ပြီးသီးနှံများ (စပါး၊ ပဲ၊ နှမ်း) ကို ရေမမီမီ ဦးစားပေးရိတ်သိမ်း၍ မြင့်ရာတွင် ဖုံးအုပ်သိမ်းဆည်းပါ။",
          ],
        });
      } else if (maxDailyRainMm >= 25 || totalRain3DayMm >= 50) {
        alerts.push({
          kind: "flood",
          severity: "moderate",
          severityLabelMm: "သတိပြုရန် (မိုးများနိုင်)",
          titleMm: "မိုးအသင့်အတင့်မှ သည်းထန်နိုင်မှုနှင့် ရေဝပ်သတိပေးချက်",
          summaryMm: `လာမည့် ၃ ရက်အတွင်း စုစုပေါင်းမိုးရေချိန် ${totalRain3DayMm} mm (တစ်ရက်အများဆုံး ${maxDailyRainMm} mm) ခန့် ရွာသွန်းနိုင်ပါသည်။`,
          farmActionsMm: [
            "ပဲမျိုးစုံ၊ နှမ်းနှင့် ဟင်းသီးဟင်းရွက်ဘောင်များတွင် ရေမဝပ်စေရန် ရေနုတ်မြောင်းစစ်ဆေးပါ။",
            "မိုးရွာချိန်နှင့် တိုက်ဆိုင်၍ ဆေးဖျန်းခြင်း မပြုလုပ်ပါနှင့်။",
          ],
        });
      }

      // 2. Drought / Dry-Heat Moisture Stress Risk
      if (
        totalRain3DayMm < 2 &&
        (maxTemp3DayC >= 37 ||
          maxEt0Mm >= 5.5 ||
          (maxTemp3DayC >= 35 && currentHumidity <= 40))
      ) {
        const isHighDrought = maxTemp3DayC >= 39 || maxEt0Mm >= 6.5;
        alerts.push({
          kind: "drought",
          severity: isHighDrought ? "high" : "moderate",
          severityLabelMm: isHighDrought
            ? "အထူးသတိပေးချက် (ခြောက်သွေ့/အပူမြင့်)"
            : "သတိပြုရန် (ခြောက်သွေ့/အစိုဓာတ်လျော့)",
          titleMm: "မိုးခေါင်ခြောက်သွေ့မှုနှင့် အပူချိန်မြင့်မားမှု သတိပေးချက်",
          summaryMm: `လာမည့် ၃ ရက်အတွင်း မိုးရွာသွန်းမှု နည်းပါးပြီး (${totalRain3DayMm} mm) အမြင့်ဆုံးအပူချိန် ${maxTemp3DayC}°C နှင့် ရေငွေ့ပျံနှုန်း ${maxEt0Mm} mm/day ရှိသဖြင့် မြေအစိုဓာတ် အလျင်အမြန် ခန်းခြောက်နိုင်ပါသည်။`,
          farmActionsMm: [
            "အပင်ခြေတွင် ကောက်ရိုးခြောက်၊ ဗေဒါ သို့မဟုတ် သစ်ရွက်ခြောက်များဖြင့် မြေဖုံးခြင်း (Mulching) ပြုလုပ်၍ အစိုဓာတ်ထိန်းပါ။",
            "နေပူပြင်းချိန် မဟုတ်ဘဲ နံနက်စောစော သို့မဟုတ် ညနေစောင်းတွင်သာ ရေလောင်း/ရေသွင်းပါ။",
            "ပူပြင်းခြောက်သွေ့ချိန်၌ မွှားပင့်ကူနီ၊ လှေးပိုးနှင့် ယင်ဖြူများ ပွားများတတ်သဖြင့် အရွက်အောက်မျက်နှာပြင်ကို စစ်ဆေးပါ။",
          ],
        });
      } else if (maxTemp3DayC >= 38) {
        alerts.push({
          kind: "heat",
          severity: "moderate",
          severityLabelMm: "သတိပြုရန် (အပူလွန်)",
          titleMm: "နေ့အပူချိန်မြင့်မားမှု သတိပေးချက်",
          summaryMm: `လာမည့် ၃ ရက်အတွင်း နေ့အပူချိန် ${maxTemp3DayC}°C အထိ မြင့်တက်နိုင်သဖြင့် ပန်းပွင့်/ဝတ်မှုန်ကူးနေသော သီးနှံများ ထိခိုက်နိုင်ပါသည်။`,
          farmActionsMm: [
            "နေ့လယ်ပူချိန်တွင် ရွက်ဖျန်းဆေး/ပိုးသတ်ဆေး လုံးဝမဖျန်းပါနှင့် (အရွက်လောင်တတ်သည်)။",
            "ပျိုးပင်ငယ်များကို ယာယီအရိပ်ကာပေး၍ ညနေပိုင်း ရေဖြန်းပေးပါ။",
          ],
        });
      }

      // 3. Strong Wind Risk
      if (maxWind3DayKmh >= 40) {
        alerts.push({
          kind: "wind",
          severity: maxWind3DayKmh >= 55 ? "high" : "moderate",
          severityLabelMm: "လေပြင်းသတိပေးချက်",
          titleMm: "လေပြင်းတိုက်ခတ်နိုင်မှု သတိပေးချက်",
          summaryMm: `လာမည့် ၃ ရက်အတွင်း လေတိုက်နှုန်း တစ်နာရီ ${maxWind3DayKmh} km/h အထိ ရောက်ရှိနိုင်ပါသည်။`,
          farmActionsMm: [
            "ငှက်ပျော၊ သင်္ဘော၊ ခရမ်းချဉ်စင်နှင့် နှမ်း/ပြောင်းပင်မြင့်များကို ထောက်တိုင်/ကြိုးချည် ထိန်းသိမ်းပါ။",
            "လေပြင်းတိုက်ချိန်တွင် ပိုးသတ်ဆေးဖျန်းခြင်း (ဆေးမှုန်လွင့်စဉ်အန္တရာယ်) ကို ရပ်ဆိုင်းထားပါ။",
          ],
        });
      }

      if (alerts.length === 0) {
        alerts.push({
          kind: "normal",
          severity: "normal",
          severityLabelMm: "ပုံမှန်အခြေအနေ",
          titleMm: "လာမည့် ၃ ရက်အတွင်း ပြင်းထန်မိုးလေဝသဘေး သတိပေးချက် မရှိသေးပါ",
          summaryMm: `မိုးရေချိန် စုစုပေါင်း ${totalRain3DayMm} mm နှင့် အပူချိန် ${minTemp3DayC}°C – ${maxTemp3DayC}°C အတွင်း ရှိနိုင်သဖြင့် ပုံမှန်စိုက်ခင်းလုပ်ငန်းများ ဆောင်ရွက်နိုင်ပါသည်။`,
          farmActionsMm: [
            "မိုးလေဝသအခြေအနေ ပြောင်းလဲမှုကို နေ့စဉ်ပြန်လည်စစ်ဆေး၍ မြေဩဇာကျွေးခြင်းနှင့် ဆေးဖျန်းခြင်းကို ရာသီဥတုနှင့် ချိန်ညှိပါ။",
          ],
        });
      }

      const currentCode = Number(raw.current?.weather_code ?? 0);

      res.json({
        region: rawRegion,
        stationLabelMm: coords.stationLabelMm,
        fetchedAtIso: new Date().toISOString(),
        current: {
          temperatureC:
            Math.round(Number(raw.current?.temperature_2m ?? 0) * 10) / 10,
          humidityPercent: currentHumidity,
          windKmh:
            Math.round(Number(raw.current?.wind_speed_10m ?? 0) * 10) / 10,
          precipitationMm:
            Math.round(Number(raw.current?.precipitation ?? 0) * 10) / 10,
          conditionMm: describeWmoCodeMm(currentCode),
        },
        days,
        alerts,
        summaryStats: {
          totalRain3DayMm,
          maxTemp3DayC,
          minTemp3DayC,
          maxWind3DayKmh,
        },
      });
    } catch (err: unknown) {
      console.error("Weather forecast fetch error:", err);
      res.status(502).json({
        error:
          "မိုးလေဝသခန့်မှန်းချက် ရယူရာတွင် အခက်အခဲရှိနေပါသည်။ အင်တာနက်လိုင်းစစ်ဆေးပြီး ပြန်လည်ကြိုးစားပါ။",
      });
    }
  });

  app.post("/api/analyze-soil", async (req, res) => {
    try {
      const { imageBase64, mimeType, region, season } = req.body as {
        imageBase64?: string;
        mimeType?: string;
        region?: string;
        season?: string;
      };

      if (!imageBase64 || typeof imageBase64 !== "string") {
        res.status(400).json({
          error: "မြေဓာတ်ပုံ မတွေ့ရှိပါ။ ကျေးဇူးပြု၍ ဓာတ်ပုံရိုက် သို့မဟုတ် ရွေးချယ်တင်ပေးပါ။",
        });
        return;
      }

      const normalizedMime = (mimeType || "image/jpeg").toLowerCase();
      if (!ALLOWED_MIME_TYPES.has(normalizedMime)) {
        res.status(400).json({
          error: "ပံ့ပိုးထားသော ဓာတ်ပုံအမျိုးအစား (JPEG, PNG, WebP) ကိုသာ အသုံးပြုပါ။",
        });
        return;
      }

      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "");
      if (!cleanBase64 || cleanBase64.length < 32) {
        res.status(400).json({
          error: "ဓာတ်ပုံဒေတာ မပြည့်စုံပါ။ ကျေးဇူးပြု၍ နောက်ထပ်ဓာတ်ပုံတစ်ပုံ ထပ်မံရွေးချယ်ပါ။",
        });
        return;
      }

      const safeRegion = region?.trim() || "မြန်မာနိုင်ငံ (ယေဘုယျ)";
      const safeSeason = season?.trim() || "မိုးရာသီ";

      const ai = getGeminiClient();

      const systemInstruction = `You are a careful, scientifically honest Myanmar agricultural soil specialist helping smallholder farmers in Myanmar.
Respond STRICTLY in natural, polite, farmer-friendly Myanmar (Burmese) language.

CRITICAL DIAGNOSTIC & HONESTY RULES:
1. CLOSE-UP & CLARITY CHECK FIRST:
   - Inspect whether the image clearly shows BARE SOIL up close (individual soil grains/clods/crumbs visible in good daylight).
   - If the photo does NOT show soil at all (e.g., people, indoor floor, screen, animals), OR if the soil is too far away (landscape view), covered by grass/rice/mulch, too blurry, or too dark/shadowed to inspect soil texture up close:
     * Set "isPhotoClearEnough": false
     * Set "confidenceLevel": "insufficient" (or "low" if soil is barely visible from afar)
     * Set "soilCategory": "unknown"
     * Set "soilTypeMm": "မြေသားကို အနီးကပ်မမြင်ရသဖြင့် အတိအကျ မခန့်မှန်းနိုင်ပါ"
     * In "retakeRequestMm", politely ask the farmer to take a sharp close-up photo from about 6–12 inches (တစ်ထွာခန့် အကွာ) above bare, cleared soil in bright natural daylight, preferably placing a coin or hand beside it for scale.
     * For "soilLikelihoods", return the 4 categories with 0% (or very tentative low numbers only if partial bare soil is visible) and state clearly that a close-up photo is needed first.
     * In "recommendedCrops", return an empty array [] when soil is unknown/not visible, or general tentative notes only if partial soil is visible.

2. MULTI-CLASS LIKELIHOODS (WHEN CLOSE-UP SOIL IS VISIBLE):
   - Even with a good close-up photo, visual texture cannot be 100% certain. NEVER pretend absolute certainty.
   - Always evaluate and return ALL FOUR soil types in "soilLikelihoods", sorted from highest to lowest likelihoodPercent (summing to 100):
     1) "sandy" — သဲမြေ (Sandy Soil)
     2) "clay" — ရွှံ့မြေ (Clay Soil)
     3) "silty" — နုန်းမြေ (Silty Soil)
     4) "loam" — Loam Soil (နုန်းစနယ်မြေ / မြေဆွေးနုန်း)
   - Choose "confidenceLevel" honestly:
     * "high": Only when crisp close-up bare soil in clear daylight clearly shows grain/clod traits (even then, remind that touch/jar tests confirm it).
     * "medium": Good soil view, but moisture, shadow, or mixed texture leaves 2+ types plausible.
     * "low": Slightly blurry, dim, wet mud glare, or partial plant cover; also set "isPhotoClearEnough": false and ask for a clearer close-up retake in "retakeRequestMm".

3. POSSIBLE REASONS & PRACTICAL FIELD TESTS (MANDATORY IN BURMESE):
   - "possibleReasonsMm": Explain in clear Burmese *why* those soil types look likely (color, clod formation, grain coarseness, surface cracks, moisture glare) AND what limitations affect the visual estimate.
   - "handTestGuidanceMm": Give step-by-step Burmese guidance for **လက်ဖြင့်ညှစ်စမ်းသပ်ခြင်း (Hand Squeeze & Ribbon Test)** — take a handful of soil, wet slightly until moist like putty, squeeze into a ball, then press between thumb and index finger:
     * သဲမြေ: ကြမ်းရှပြီး အလုံးမဖြစ်ဘဲ ပြိုကျလွယ်မည်။
     * နုန်းမြေ (Silty): ချောမွေ့နူးညံ့သော်လည်း အပြားရှည် ဖိထုတ်လျှင် ပြတ်ကျလွယ်မည်။
     * ရွှံ့မြေ: စေးကပ်ပြီး လက်ချောင်းကြား ဖိညှစ်လျှင် မကျိုးဘဲ အပြားရှည် (၂ လက်မခန့်အထိ) ထွက်လာမည်။
     * Loam Soil: စေးပိုင်ရုံမျှ အလုံးဖြစ်ပြီး ညှစ်ကြည့်လျှင် မျှတစွာ ကြေမွလွယ်မည်။
   - "jarTestGuidanceMm": Give step-by-step Burmese guidance for **ရေဘူးထဲထည့်၍ အနည်ကျစမ်းသပ်ခြင်း (Clear Bottle / Jar Settling Test)** — fill a clear plastic water bottle 1/3 with soil and 2/3 with clean water (plus 1 pinch of salt or 2 drops dish soap), shake hard for 1–2 minutes, and let stand upright:
     * ၁ မိနစ်အတွင်း အောက်ဆုံးတွင် အနည်ထိုင်သောအလွှာ = သဲ (Sand)
     * ၁ - ၂ နာရီအတွင်း အလယ်တွင် ထိုင်သောအလွှာ = နုန်း (Silt)
     * ၂၄ နာရီအကြာ အပေါ်ဆုံးတွင် ထိုင်သောအလွှာ = ရွှံ့ (Clay)
     Measure the thickness of each layer to know the true soil mix.

4. STRICT PROHIBITION ON pH / NPK / SALINITY GUESSING:
   - NEVER estimate, guess, or report pH values (not even "slightly acidic" or "around 6.5"), NPK nutrient amounts, or salinity/EC levels from a photo.
   - Explicitly explain in "photoLimitationReminderMm" that a single soil photo CANNOT measure pH, NPK, or salinity, and recommend laboratory testing (DoA Soil Lab) or a proper soil test kit.`;

      const promptText = `တောင်သူရွေးချယ်ထားသော ဒေသ - ${safeRegion}
စိုက်ပျိုးမည့် ရာသီ - ${safeSeason}

ပူးတွဲပါဓာတ်ပုံကို အနီးကပ်မြေသား ရှင်းလင်းမှု ရှိ/မရှိ ဦးစွာစစ်ဆေးပါ။
- မြေသားကို အနီးကပ် မမြင်ရလျှင် (ဝေးလွန်းခြင်း၊ ဝါးနေခြင်း၊ အပင်/မြက်ဖုံးနေခြင်း၊ မှောင်နေခြင်း) မြေအမျိုးအစားကို အတိအကျ မခန့်မှန်းဘဲ နောက်ထပ် အနီးကပ်ဓာတ်ပုံ တောင်းဆိုပါ။
- သဲမြေ၊ ရွှံ့မြေ၊ နုန်းမြေနှင့် Loam Soil (၄) မျိုးလုံးအတွက် ဖြစ်နိုင်ခြေ ရာခိုင်နှုန်းနှင့် အကြောင်းရင်းများကို ဖော်ပြပါ။
- ယုံကြည်မှုအဆင့်၊ ဖြစ်နိုင်သောအကြောင်းရင်း၊ လက်ဖြင့်ညှစ်စမ်းသပ်နည်းနှင့် ရေဘူးထဲထည့်၍ အနည်ကျစမ်းသပ်နည်းတို့ကို မြန်မာဘာသာဖြင့် ပြည့်စုံစွာ ဖြေကြားပေးပါ။
- pH၊ NPK နှင့် ဆားဓာတ်ကို လုံးဝ မခန့်မှန်းပါနှင့်။`;

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: "gemini-4-hydrogen",
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: normalizedMime === "image/jpg" ? "image/jpeg" : normalizedMime,
                  data: cleanBase64,
                },
              },
              { text: promptText },
            ],
          },
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                isPhotoClearEnough: {
                  type: Type.BOOLEAN,
                  description:
                    "True ONLY if bare soil grains/clods are clearly visible up close in decent lighting; false if distant, blurry, shadowed, covered, or not soil.",
                },
                confidenceLevel: {
                  type: Type.STRING,
                  description: "One of: high, medium, low, insufficient",
                },
                confidenceLabelMm: {
                  type: Type.STRING,
                  description:
                    "Short Burmese confidence label e.g. 'ယုံကြည်မှုအဆင့် — အလယ်အလတ်' or 'အနီးကပ်ဓာတ်ပုံ ထပ်မံလိုအပ်သည်'.",
                },
                confidenceReasonMm: {
                  type: Type.STRING,
                  description:
                    "Why this confidence level was assigned based on photo clarity, distance, lighting, or cover.",
                },
                retakeRequestMm: {
                  type: Type.STRING,
                  description:
                    "If photo is unclear/distant/low confidence, clear Burmese request for a closer, sharper photo; otherwise brief photography tip.",
                },
                soilCategory: {
                  type: Type.STRING,
                  description:
                    "One of: sandy, clay, loam, sandy_loam, clay_loam, silty, unknown. Use unknown when not close-up or unclear.",
                },
                soilTypeMm: {
                  type: Type.STRING,
                  description:
                    "Leading probable soil type in Burmese, or explicit statement that exact classification is not possible without a close-up soil photo.",
                },
                confidenceNoteMm: {
                  type: Type.STRING,
                  description: "Brief honest summary note in Burmese.",
                },
                soilLikelihoods: {
                  type: Type.ARRAY,
                  description:
                    "Likelihood breakdown for all 4 soil types: sandy, clay, silty, loam.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      typeKey: {
                        type: Type.STRING,
                        description: "One of: sandy, clay, silty, loam",
                      },
                      typeNameMm: { type: Type.STRING },
                      likelihoodPercent: { type: Type.INTEGER },
                      likelihoodLabelMm: { type: Type.STRING },
                      reasonMm: { type: Type.STRING },
                    },
                    required: [
                      "typeKey",
                      "typeNameMm",
                      "likelihoodPercent",
                      "likelihoodLabelMm",
                      "reasonMm",
                    ],
                  },
                },
                possibleReasonsMm: {
                  type: Type.STRING,
                  description:
                    "Detailed Burmese explanation of visual reasons for these likelihoods and factors causing uncertainty.",
                },
                visualObservationsMm: {
                  type: Type.STRING,
                  description:
                    "Observations of soil color, texture, clods, distance, or cover in Burmese.",
                },
                waterAndDrainageMm: {
                  type: Type.STRING,
                  description:
                    "Expected water retention and drainage notes in Burmese (or guidance to confirm via field tests if unclear).",
                },
                handTestGuidanceMm: {
                  type: Type.STRING,
                  description:
                    "Practical Burmese instructions for the Hand Squeeze / Ribbon Test tailored to the observation.",
                },
                jarTestGuidanceMm: {
                  type: Type.STRING,
                  description:
                    "Practical Burmese instructions for the Water Bottle / Jar Settling Test (1 min sand, 1-2 hr silt, 24 hr clay).",
                },
                soilImprovementTipsMm: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "3 to 4 practical soil improvement tips in Burmese.",
                },
                recommendedCrops: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      cropNameMm: { type: Type.STRING },
                      suitabilityReasonMm: { type: Type.STRING },
                      plantingCareMm: { type: Type.STRING },
                    },
                    required: ["cropNameMm", "suitabilityReasonMm", "plantingCareMm"],
                  },
                },
                photoLimitationReminderMm: {
                  type: Type.STRING,
                  description:
                    "Explicit Burmese statement that photo alone CANNOT measure or estimate pH, NPK, or salinity.",
                },
              },
              required: [
                "isPhotoClearEnough",
                "confidenceLevel",
                "confidenceLabelMm",
                "confidenceReasonMm",
                "retakeRequestMm",
                "soilCategory",
                "soilTypeMm",
                "confidenceNoteMm",
                "soilLikelihoods",
                "possibleReasonsMm",
                "visualObservationsMm",
                "waterAndDrainageMm",
                "handTestGuidanceMm",
                "jarTestGuidanceMm",
                "soilImprovementTipsMm",
                "recommendedCrops",
                "photoLimitationReminderMm",
              ],
            },
          },
        })
      );

      const text = (response.text ?? "").trim();
      if (!text) {
        throw new Error("Empty response from Gemini");
      }

      const parsed = safeParseJson<Record<string, unknown>>(text);
      res.json(parsed);
    } catch (err: unknown) {
      console.error("Soil analysis error:", err);
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  app.post("/api/pest-advice", async (req, res) => {
    try {
      const { crop, symptomQuestion, region } = req.body as {
        crop?: string;
        symptomQuestion?: string;
        region?: string;
      };

      if (!symptomQuestion || !symptomQuestion.trim()) {
        res.status(400).json({
          error: "သိလိုသော ပိုးမွှား သို့မဟုတ် ရောဂါလက္ခဏာကို ရေးသားပေးပါ။",
        });
        return;
      }

      const ai = getGeminiClient();

      const response = await withRetry(() =>
        ai.models.generateContent({
          model: "gemini-4-hydrogen",
          contents: `သီးနှံ - ${crop || "စပါး/ပဲ/နှမ်း/မြေပဲ"}
ဒေသ - ${region || "မြန်မာနိုင်ငံ"}
တောင်သူမေးမြန်းချက် - ${symptomQuestion.trim()}

ဤလက္ခဏာအတွက် ဖြစ်နိုင်ခြေရှိသော ပိုးမွှား/ရောဂါ၊ သဘာဝနည်းဖြင့် ကာကွယ်နှိမ်နင်းနည်း၊ စိုက်နည်းစနစ်ပြုပြင်နည်းနှင့် ဓာတုဆေးသုံးရန်လိုအပ်ပါက သတိပြုရမည့်အချက်များကို တိုတိုရှင်းရှင်း မြန်မာဘာသာဖြင့် ပြန်ဖြေပေးပါ။`,
          config: {
            systemInstruction:
              "You are a Myanmar crop protection specialist. Provide clear, safe, practical IPM advice strictly in Burmese. Prioritize cultural and organic prevention first, never invent unsafe chemical dosages, and remind farmers to read label instructions or consult local DoA extension officers.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                likelyIssueMm: { type: Type.STRING },
                immediateActionsMm: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                organicControlMm: { type: Type.STRING },
                safetyNoteMm: { type: Type.STRING },
              },
              required: [
                "likelyIssueMm",
                "immediateActionsMm",
                "organicControlMm",
                "safetyNoteMm",
              ],
            },
          },
        })
      );

      const text = (response.text ?? "").trim();
      if (!text) {
        throw new Error("Empty response from Gemini");
      }
      res.json(safeParseJson<Record<string, unknown>>(text));
    } catch (err: unknown) {
      console.error("Pest advice error:", err);
      const mapped = mapGeminiError(err);
      res.status(mapped.status).json({ error: mapped.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: { server: httpServer },
        allowedHosts: true,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*splat", (_req, res) => {
      const indexFile = path.join(distPath, "index.html");
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send("Build artifacts not found.");
      }
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Myanma Farm Friend server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
