import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  Droplets,
  Flame,
  MapPin,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sprout,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import { MYANMAR_REGIONS } from "../data/farmData";
import type {
  RegionWeatherForecastResponse,
  WeatherAlertItem,
  WeatherAlertKind,
  WeatherDayForecast,
} from "../types/farm";

interface WeatherAlertSectionProps {
  region: string;
  onRegionChange: (region: string) => void;
}

type WeatherSectionTab = "forecast" | "safety_tips";

interface SafetyPlaybook {
  id: string;
  kind: WeatherAlertKind;
  isActiveNow: boolean;
  badgeTextMm: string;
  titleMm: string;
  rationaleMm: string;
  phases: {
    phaseTitleMm: string;
    stepsMm: string[];
  }[];
  fieldTimingRuleMm: string;
}

function WeatherConditionIcon({
  code,
  className = "w-5 h-5",
}: {
  code: number;
  className?: string;
}) {
  if (code >= 95) {
    return <CloudLightning className={`${className} text-red-700`} aria-hidden="true" />;
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return <CloudRain className={`${className} text-[#15623E]`} aria-hidden="true" />;
  }
  if (code === 45 || code === 48) {
    return <CloudFog className={`${className} text-[#546358]`} aria-hidden="true" />;
  }
  if (code >= 1 && code <= 3) {
    return <Cloud className={`${className} text-[#546358]`} aria-hidden="true" />;
  }
  return <Sun className={`${className} text-amber-600`} aria-hidden="true" />;
}

function AlertVisualIcon({ alert }: { alert: WeatherAlertItem }) {
  if (alert.kind === "flood") {
    return (
      <Droplets
        className={`w-5 h-5 shrink-0 mt-0.5 ${
          alert.severity === "high" ? "text-red-700" : "text-amber-800"
        }`}
        aria-hidden="true"
      />
    );
  }
  if (alert.kind === "drought" || alert.kind === "heat") {
    return (
      <Flame
        className={`w-5 h-5 shrink-0 mt-0.5 ${
          alert.severity === "high" ? "text-red-700" : "text-amber-800"
        }`}
        aria-hidden="true"
      />
    );
  }
  if (alert.kind === "wind") {
    return (
      <Wind
        className={`w-5 h-5 shrink-0 mt-0.5 ${
          alert.severity === "high" ? "text-red-700" : "text-amber-800"
        }`}
        aria-hidden="true"
      />
    );
  }
  return (
    <CheckCircle2
      className="w-5 h-5 text-[#15623E] shrink-0 mt-0.5"
      aria-hidden="true"
    />
  );
}

function alertContainerClasses(severity: WeatherAlertItem["severity"]): string {
  if (severity === "high") {
    return "border-red-300 bg-red-50/85 text-red-950";
  }
  if (severity === "moderate") {
    return "border-amber-300 bg-amber-50/85 text-amber-950";
  }
  return "border-[#D4DDD0] bg-[#FAF9F6] text-[#18221D]";
}

function buildSafetyPlaybooks(
  forecast: RegionWeatherForecastResponse
): SafetyPlaybook[] {
  const activeKinds = new Set(forecast.alerts.map((a) => a.kind));
  const { totalRain3DayMm, maxTemp3DayC, maxWind3DayKmh } = forecast.summaryStats;
  const playbooks: SafetyPlaybook[] = [];

  if (activeKinds.has("flood")) {
    playbooks.push({
      id: "flood-active",
      kind: "flood",
      isActiveNow: true,
      badgeTextMm: `လက်ရှိသတိပေးချက် · ၃ ရက်မိုး ${totalRain3DayMm} mm`,
      titleMm: "ရေကြီးရေလျှံနှင့် မိုးသည်းထန်မှုမှ သီးနှံကာကွယ်ရေး လမ်းညွှန်",
      rationaleMm:
        "မြေနိမ့်စိုက်ခင်းများ ရေဝပ်ပါက အမြစ်အသက်ရှူကျပ်၍ ပုပ်ရိခြင်း၊ ဘက်တီးရီးယားရွက်ခြောက်နှင့် မှိုရောဂါများ အလျင်အမြန် ကူးစက်တတ်သဖြင့် မိုးမကျမီနှင့် ရေကျပြီးချိန် စီမံခန့်ခွဲမှု အရေးကြီးပါသည်။",
      phases: [
        {
          phaseTitleMm: "၁။ မိုးသည်းထန်မှု မစတင်မီ ချက်ချင်းပြင်ဆင်ရန်",
          stepsMm: [
            "စိုက်ခင်းပတ်လည် ရေထုတ်မြောင်းနှင့် ရေသွင်းရေထုတ်ပေါက်များရှိ အမှိုက်၊ ပေါင်းမြက်နှင့် နုန်းပိတ်ဆို့မှုများကို ရှင်းလင်းဖွင့်ပေးပါ။",
            "ပဲမျိုးစုံ၊ ငရုတ်၊ ခရမ်းချဉ်နှင့် ဟင်းသီးဟင်းရွက်ဘောင်များကို မြေဖို့မြှင့်တင်၍ ရေဆင်းမြောင်း နက်အောင် တူးဖော်ပါ။",
            "ရင့်မှည့်နေပြီဖြစ်သော စပါး၊ နှမ်း၊ မြေပဲနှင့် ပဲများကို ရေမဝပ်မီ ဦးစားပေး ရိတ်သိမ်း၍ ရေလွတ်မြင့်ရာ၌ ဖုံးအုပ်သိမ်းဆည်းပါ။",
          ],
        },
        {
          phaseTitleMm: "၂။ မိုးရွာသွန်းနေစဉ် ရှောင်ကြဉ်ရမည့်အချက်များ",
          stepsMm: [
            "ယူရီးယားနှင့် မြေခံဓာတ်မြေဩဇာ ကျွေးခြင်းကို မိုးစဲပြီး ရေတည်ငြိမ်ချိန်အထိ ရွှေ့ဆိုင်းပါ (ရေနှင့်အတူ မျောပါဆုံးရှုံးမည်)။",
            "ရွက်ဖျန်းအားဆေးနှင့် ပိုးသတ်ဆေးဖျန်းခြင်းကို ခေတ္တရပ်ဆိုင်းထားပါ။",
            "သိုလှောင်ထားသော မျိုးစေ့အိတ်နှင့် ဓာတ်မြေဩဇာအိတ်များကို မြေနှင့်တိုက်ရိုက်မထိစေဘဲ ခုံမြင့်ပေါ်တင်၍ မိုးလုံအောင် ဖုံးအုပ်ပါ။",
          ],
        },
        {
          phaseTitleMm: "၃။ ရေကျပြီးနောက် သီးနှံပြန်လည်ထူထောင်ရေး",
          stepsMm: [
            "စိုက်ခင်းအတွင်း ရေဝပ်နေပါက ၄၈ နာရီအတွင်း ရေကုန်အောင် အမြန်ဆုံး ဖောက်ထုတ်ပါ (ပဲနှင့် ဟင်းသီးဟင်းရွက်များ ရေဝပ်ဒဏ် မခံနိုင်ပါ)။",
            "ရေကျပြီး ၃-၅ ရက်အတွင်း ခါးရိရောဂါ၊ မြစ်ပုပ်ရောဂါနှင့် စပါးဘက်တီးရီးယားရွက်ခြောက် လက္ခဏာများကို စစ်ဆေးပါ။",
            "အပင်အမြစ် ပြန်လည်နိုးကြားလာမှသာ သဘာဝမြေဩဇာရည် သို့မဟုတ် အာဟာရဖြည့်စွက်မှုကို အနည်းငယ်စီ ပြန်လည်ပံ့ပိုးပါ။",
          ],
        },
      ],
      fieldTimingRuleMm:
        "မြေဩဇာနှင့် ဆေးဖျန်းလုပ်ငန်းများကို မိုးရွာနိုင်ခြေ ၄၀% အောက်ကျဆင်းပြီး မြေစိုရုံအခြေအနေရောက်မှ ပြန်စပါ။",
    });
  }

  if (activeKinds.has("drought") || activeKinds.has("heat")) {
    playbooks.push({
      id: "drought-heat-active",
      kind: activeKinds.has("drought") ? "drought" : "heat",
      isActiveNow: true,
      badgeTextMm: `လက်ရှိသတိပေးချက် · အမြင့်ဆုံး ${maxTemp3DayC}°C`,
      titleMm: "အပူလှိုင်းနှင့် ခြောက်သွေ့မှုဒဏ်မှ သီးနှံကာကွယ်ရေး လမ်းညွှန်",
      rationaleMm:
        "နေ့အပူချိန်မြင့်မားပြီး မိုးနည်းချိန်တွင် ရေငွေ့ပျံနှုန်း မြင့်တက်၍ အပွင့်ကြွေခြင်း၊ ဝတ်မှုန်မအောင်ခြင်းနှင့် မွှားပင့်ကူနီ/လှေးပိုး/ယင်ဖြူများ ပွားများလာတတ်ပါသည်။",
      phases: [
        {
          phaseTitleMm: "၁။ မြေအစိုဓာတ် ထိန်းသိမ်းရေးနှင့် မြေဖုံးခြင်း",
          stepsMm: [
            "အပင်ခြေပတ်လည်တွင် ကောက်ရိုးခြောက်၊ ဗေဒါခြောက် သို့မဟုတ် ဆွေးမြေ့ပြီး မြေဆွေးဖြင့် ၂-၃ လက်မထူ မြေဖုံးခြင်း (Mulching) ပြုလုပ်ပါ။",
            "ပေါင်းမြက်များကို အမြစ်မနုတ်ဘဲ မြေစပ်မှ ဖြတ်တောက်၍ အပင်ခြေတွင် ပြန်ဖုံးပေးခြင်းဖြင့် မြေအပူချိန် လျှော့ချပါ။",
            "ယူရီးယားမြေဩဇာ တစ်မျိုးတည်း အလွန်အကျွံ မကျွေးဘဲ အပင်ရေငတ်ဒဏ်ခံနိုင်ရန် ပိုတက်ရှ်နှင့် သဘာဝမြေဆွေး မျှတအောင် ချိန်ဆပါ။",
          ],
        },
        {
          phaseTitleMm: "၂။ ရေသွင်းချိန်နှင့် ဆေးဖျန်းချိန် ဘေးကင်းရေး",
          stepsMm: [
            "နေပူပြင်းချိန် (နံနက် ၁၀ နာရီမှ ညနေ ၄ နာရီအတွင်း) ရေလောင်းခြင်းနှင့် ပိုးသတ်ဆေး/ရွက်ဖျန်းဆေး ဖျန်းခြင်းကို ရှောင်ကြဉ်ပါ။",
            "နံနက် ၆:၀၀ - ၈:၃၀ သို့မဟုတ် ညနေ ၅:၀၀ နောက်ပိုင်းတွင်သာ အပင်ခြေသို့ တိုက်ရိုက် ရေသွင်း/ရေလောင်းပေးပါ။",
            "ပျိုးခင်းနှင့် ဟင်းသီးဟင်းရွက်နုများပေါ်တွင် အရိပ်ကာပိုက် (Shade net 50%) သို့မဟုတ် ထန်းရွက်/ဝါးကပ် ယာယီအရိပ် မိုးပေးပါ။",
          ],
        },
        {
          phaseTitleMm: "၃။ ပူပြင်းခြောက်သွေ့ရာသီ ပိုးမွှားစောင့်ကြည့်ရေး",
          stepsMm: [
            "မွှားပင့်ကူနီ၊ လှေးပိုးနှင့် ယင်ဖြူများ အရွက်အောက်မျက်နှာပြင်၌ ကျရောက်နိုင်သဖြင့် ၂ ရက်တစ်ကြိမ် အရွက်အောက်ကို လှန်စစ်ဆေးပါ။",
            "လိုအပ်ပါက တမာဆီ သို့မဟုတ် ဆပ်ပြာရည်အပျော့စားကို ညနေအေးချိန်မှသာ ဖျန်းပါ (နေပူချိန် ဆီပါသောဆေးဖျန်းပါက အရွက်လောင်တတ်သည်)။",
          ],
        },
      ],
      fieldTimingRuleMm:
        "ဆေးဖျန်းခြင်းနှင့် ရေသွင်းခြင်းအားလုံးကို အပူချိန် ၃၂°C အောက်ကျဆင်းသည့် နံနက်စောစော သို့မဟုတ် ညနေစောင်းတွင်သာ ပြုလုပ်ပါ။",
    });
  }

  if (activeKinds.has("wind")) {
    playbooks.push({
      id: "wind-active",
      kind: "wind",
      isActiveNow: true,
      badgeTextMm: `လက်ရှိသတိပေးချက် · လေတိုက်နှုန်း ${maxWind3DayKmh} km/h`,
      titleMm: "လေပြင်းတိုက်ခတ်မှုမှ သီးနှံပင်များ ကာကွယ်ရေး လမ်းညွှန်",
      rationaleMm:
        "လေပြင်းတိုက်ခတ်ပါက အပင်မြင့်များ ကျိုးလဲခြင်း၊ အကိုင်းအခက်ကျိုးပဲ့၍ မှိုရောဂါဝင်ခြင်းနှင့် ဆေးမှုန်လွင့်စဉ်ခြင်းတို့ ဖြစ်ပေါ်နိုင်ပါသည်။",
      phases: [
        {
          phaseTitleMm: "လေပြင်းမတိုက်မီနှင့် တိုက်ပြီးနောက် လုပ်ဆောင်ရန်",
          stepsMm: [
            "ငှက်ပျော၊ သင်္ဘော၊ ပြောင်း၊ ခရမ်းချဉ်စင်နှင့် ပဲစင်းငုံကဲ့သို့ ပင်စည်မြင့်သီးနှံများကို ဝါးထောက်တိုင်/ကြိုးဖြင့် ခိုင်ခံ့အောင် ချည်နှောင်ထိန်းသိမ်းပါ။",
            "လေတိုက်နှုန်း ၁၅ km/h ကျော်ချိန်တွင် မည်သည့်ပိုးသတ်ဆေး/ပေါင်းသတ်ဆေးမျှ မဖျန်းပါနှင့် (ဘေးစိုက်ခင်းများနှင့် ဆေးဖျန်းသူအတွက် အန္တရာယ်ရှိသည်)။",
            "လေတိုက်ပြီးနောက် ကျိုးပဲ့သွားသော အကိုင်းများကို ဓားသန့်သန့်ဖြင့် ညီညာစွာ ဖြတ်တောက်ရှင်းလင်း၍ ရောဂါမဝင်စေရန် ဂရုပြုပါ။",
          ],
        },
      ],
      fieldTimingRuleMm:
        "လေငြိမ်သည့် နံနက်စောစောပိုင်းတွင်သာ ဆေးဖျန်းခြင်းနှင့် အပင်ထောက်တိုင်စစ်ဆေးခြင်း ဆောင်ရွက်ပါ။",
    });
  }

  if (activeKinds.has("normal") || playbooks.length === 0) {
    playbooks.push({
      id: "normal-operations",
      kind: "normal",
      isActiveNow: true,
      badgeTextMm: `ပုံမှန်အခြေအနေ · ၃ ရက်မိုး ${totalRain3DayMm} mm · အပူ ${maxTemp3DayC}°C`,
      titleMm: "ရာသီဥတုသင့်တင့်ချိန် စိုက်ခင်းဘေးကင်းရေးနှင့် ကြိုတင်ပြင်ဆင်မှု",
      rationaleMm:
        "လာမည့် ၃ ရက်အတွင်း ရေကြီး/မိုးခေါင်/လေပြင်း သတိပေးချက် မရှိသေးသဖြင့် စိုက်ခင်းပြုစုမှုလုပ်ငန်းများကို ဘေးကင်းစွာ ဆောင်ရွက်ရန် အကောင်းဆုံးအချိန်ဖြစ်ပါသည်။",
      phases: [
        {
          phaseTitleMm: "လက်ရှိသင့်တော်သည့် စိုက်ခင်းလုပ်ငန်းများ",
          stepsMm: [
            "အပင်သက်တမ်းအလိုက် ခွဲကျွေးရမည့် မြေဩဇာ (တီစူပါ/ပိုတက်ရှ်/ယူရီးယား သို့မဟုတ် သဘာဝမြေဆွေး) ကို မြေအစိုဓာတ်ရှိချိန်တွင် စနစ်တကျ ထည့်သွင်းနိုင်ပါသည်။",
            "အပင်ခြေပေါင်းရှင်းခြင်း၊ မြေတောင်မြှောက်ခြင်းနှင့် ရေနုတ်မြောင်းများ ကြိုတင်ပြုပြင်ထားခြင်းဖြင့် ရုတ်တရက်မိုးများလာပါက ခံနိုင်ရည်ရှိစေပါ။",
            "စိုက်ခင်းအတွင်း ပိုးမွှားကင်းထောက်စစ်ဆေးခြင်း (အရွက်အောက်မျက်နှာပြင်နှင့် အညွန့်နုစစ်ဆေးခြင်း) ကို ပုံမှန်ပြုလုပ်ပါ။",
          ],
        },
      ],
      fieldTimingRuleMm:
        "ရာသီဥတုအပြောင်းအလဲ မြန်တတ်သဖြင့် မြေဩဇာကျွေးခြင်းနှင့် ဆေးဖျန်းခြင်းမပြုမီ နေ့စဉ်ခန့်မှန်းချက်ကို စစ်ဆေးပါ။",
    });
  }

  return playbooks;
}

export function WeatherAlertSection({
  region,
  onRegionChange,
}: WeatherAlertSectionProps) {
  const [activeTab, setActiveTab] = useState<WeatherSectionTab>("forecast");
  const [forecast, setForecast] =
    useState<RegionWeatherForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState<number>(0);
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});

  const loadWeather = useCallback(
    async (signal?: AbortSignal) => {
      setIsLoading(true);
      setErrorMsg(null);
      try {
        const res = await fetch(
          `/api/weather?region=${encodeURIComponent(region)}`,
          { signal }
        );
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error("မိုးလေဝသဒေတာ ရယူရာတွင် အခက်အခဲရှိနေပါသည်။");
        }
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error || "မိုးလေဝသခန့်မှန်းချက် ရယူ၍ မရပါ။"
          );
        }
        setForecast(data as RegionWeatherForecastResponse);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "မိုးလေဝသခန့်မှန်းချက် ရယူ၍ မရပါ။ ထပ်မံကြိုးစားပါ။"
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [region]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadWeather(controller.signal);
    return () => controller.abort();
  }, [loadWeather, refreshTick]);

  const toggleCheckedStep = (stepKey: string) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  const playbooks = forecast ? buildSafetyPlaybooks(forecast) : [];
  const hasExtremeAlert = Boolean(
    forecast?.alerts.some((a) => a.severity !== "normal")
  );

  return (
    <section
      aria-labelledby="weather-alert-heading"
      className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-5"
    >
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#ECEFE7] pb-4">
        <div className="space-y-1">
          <div className="text-xs sm:text-sm text-[#546358] flex flex-wrap items-center gap-2">
            <span>မိုးလေဝသ သတိပေးချက် (Weather Alert)</span>
            <span aria-hidden="true">·</span>
            <span>လာမည့် ၃ ရက်စာ ခန့်မှန်းချက်နှင့် ဘေးကင်းရေး</span>
          </div>
          <h2
            id="weather-alert-heading"
            className="text-xl font-bold text-[#18221D]"
          >
            ဒေသအလိုက် ၃ ရက်တာ မိုးလေဝသနှင့် သဘာဝဘေး သတိပေးချက်
          </h2>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          <label className="relative flex-1 sm:w-56">
            <span className="sr-only">မိုးလေဝသကြည့်မည့် ဒေသရွေးချယ်ရန်</span>
            <MapPin
              className="w-4 h-4 text-[#15623E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <select
              value={region}
              onChange={(e) => onRegionChange(e.target.value)}
              className="w-full min-h-[44px] pl-9 pr-3 py-2 text-sm bg-[#FAF9F6] border border-[#D4D9CE] rounded-xl text-[#18221D] focus:outline-none focus:ring-2 focus:ring-[#15623E]"
            >
              {MYANMAR_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => setRefreshTick((n) => n + 1)}
            disabled={isLoading}
            className="min-h-[44px] px-4 py-2 rounded-xl border border-[#CFD6C8] bg-[#FAF9F6] hover:bg-[#F3F5F0] text-xs sm:text-sm font-medium text-[#18221D] inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#15623E] ${isLoading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>ပြန်လည်စစ်ဆေး</span>
          </button>
        </div>
      </div>

      {/* Weather Section Tabs (Forecast vs Safety Tips) */}
      <div
        role="tablist"
        aria-label="မိုးလေဝသနှင့် ဘေးကင်းရေး အကြံပြုချက်များ"
        className="flex items-center gap-1 p-1 bg-[#F3F5F0] rounded-xl overflow-x-auto w-full sm:w-fit"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "forecast"}
          onClick={() => setActiveTab("forecast")}
          className={`min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
            activeTab === "forecast"
              ? "bg-white text-[#15623E] shadow-sm font-semibold"
              : "text-[#445248] hover:text-[#18221D]"
          }`}
        >
          ၃ ရက်စာ ခန့်မှန်းချက်နှင့် သတိပေးချက်
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "safety_tips"}
          onClick={() => setActiveTab("safety_tips")}
          className={`min-h-[44px] px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-colors ${
            activeTab === "safety_tips"
              ? "bg-white text-[#15623E] shadow-sm font-semibold"
              : "text-[#445248] hover:text-[#18221D]"
          }`}
        >
          <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>ဘေးကင်းရေး အကြံပြုချက်များ (Safety Tips)</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && !forecast && (
        <div className="space-y-4 animate-pulse" aria-live="polite">
          <div className="h-20 rounded-xl bg-[#F3F5F0]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-36 rounded-xl bg-[#F3F5F0]" />
            <div className="h-36 rounded-xl bg-[#F3F5F0]" />
            <div className="h-36 rounded-xl bg-[#F3F5F0]" />
          </div>
        </div>
      )}

      {/* Error State */}
      {errorMsg && (
        <div
          role="alert"
          className="rounded-xl border border-red-300 bg-red-50 p-4 flex flex-wrap items-center justify-between gap-3 text-sm text-red-900"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setRefreshTick((n) => n + 1)}
            className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-red-800 hover:bg-red-900 text-white text-xs font-medium whitespace-nowrap"
          >
            ထပ်မံကြိုးစားမည်
          </button>
        </div>
      )}

      {/* Populated Live Forecast & Safety Tips */}
      {forecast && (
        <div className="space-y-5">
          {/* Current Regional Telemetry Line (Zero-Pill, Tabular Numerals) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-[#445248] bg-[#FAF9F6] border border-[#E5E8DF] rounded-xl px-4 py-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold text-[#18221D]">
                {forecast.stationLabelMm}
              </span>
              <span aria-hidden="true">·</span>
              <span>{forecast.current.conditionMm}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums font-medium text-[#18221D]">
                လက်ရှိ {forecast.current.temperatureC}°C
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                စိုထိုင်းဆ {forecast.current.humidityPercent}%
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                လေတိုက်နှုန်း {forecast.current.windKmh} km/h
              </span>
            </div>
            <div className="font-mono tabular-nums text-xs text-[#546358]">
              ၃ ရက်စုစုပေါင်းမိုး {forecast.summaryStats.totalRain3DayMm} mm
            </div>
          </div>

          {/* TAB 1: FORECAST & ALERTS */}
          {activeTab === "forecast" && (
            <div role="tabpanel" className="space-y-5">
              {/* Extreme Weather Alert Cards */}
              <div className="space-y-3">
                {forecast.alerts.map((alert, idx) => (
                  <div
                    key={`${alert.kind}-${idx}`}
                    role={alert.severity === "normal" ? undefined : "status"}
                    className={`rounded-xl border p-4 sm:p-5 space-y-2.5 ${alertContainerClasses(
                      alert.severity
                    )}`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <AlertVisualIcon alert={alert} />
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                            <span className="inline-flex items-center gap-1">
                              {alert.severity !== "normal" && (
                                <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                              )}
                              {alert.severityLabelMm}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-bold">
                            {alert.titleMm}
                          </h3>
                          <p className="text-xs sm:text-sm leading-relaxed opacity-95">
                            {alert.summaryMm}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab("safety_tips")}
                        className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-white/90 hover:bg-white border border-black/10 text-xs font-semibold text-[#15623E] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
                      >
                        <span>ကာကွယ်ရေး အကြံပြုချက်ကြည့်ရန်</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>

                    {alert.farmActionsMm.length > 0 && (
                      <ul className="pl-8 space-y-1 text-xs sm:text-sm">
                        {alert.farmActionsMm.map((action, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span aria-hidden="true" className="font-bold">
                              ·
                            </span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              {/* 3-Day Forecast Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {forecast.days.map((day: WeatherDayForecast) => (
                  <article
                    key={day.dateIso}
                    className="rounded-xl border border-[#E5E8DF] bg-[#FAF9F6] p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-bold text-[#18221D]">
                          {day.dayLabelMm}
                        </p>
                        <p className="text-xs text-[#546358] mt-0.5">
                          {day.conditionMm}
                        </p>
                      </div>
                      <WeatherConditionIcon
                        code={day.weatherCode}
                        className="w-6 h-6 shrink-0"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#E5E8DF] text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[#546358] flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5 text-[#15623E]" aria-hidden="true" />
                          အပူချိန် (မြင့်/နိမ့်)
                        </span>
                        <p className="font-mono tabular-nums text-sm font-bold text-[#18221D]">
                          {day.tempMaxC}° / {day.tempMinC}°C
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[#546358] flex items-center gap-1">
                          <Droplets className="w-3.5 h-3.5 text-[#15623E]" aria-hidden="true" />
                          မိုးရေချိန် ({day.precipitationProbPercent}%)
                        </span>
                        <p className="font-mono tabular-nums text-sm font-bold text-[#18221D]">
                          {day.precipitationMm} mm
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[#546358] flex items-center gap-1">
                          <Wind className="w-3.5 h-3.5 text-[#15623E]" aria-hidden="true" />
                          အများဆုံးလေ
                        </span>
                        <p className="font-mono tabular-nums text-xs font-semibold text-[#2C3A30]">
                          {day.windMaxKmh} km/h
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[#546358]">ရေငွေ့ပျံနှုန်း (ET₀)</span>
                        <p className="font-mono tabular-nums text-xs font-semibold text-[#2C3A30]">
                          {day.evapotranspirationMm} mm
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIONABLE SAFETY TIPS BASED ON CURRENT FORECAST ALERTS */}
          {activeTab === "safety_tips" && (
            <div role="tabpanel" className="space-y-5">
              {/* Context summary */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-[#445248]">
                <p>
                  {hasExtremeAlert
                    ? `${forecast.stationLabelMm} ၏ လက်ရှိသတိပေးချက်များအပေါ် အခြေခံ၍ ဦးစားပေးလုပ်ဆောင်ရမည့် သီးနှံကာကွယ်ရေး အဆင့်များဖြစ်ပါသည်။`
                    : `${forecast.stationLabelMm} တွင် လက်ရှိပြင်းထန်မိုးလေဝသသတိပေးချက် မရှိသေးသော်လည်း အောက်ပါဘေးကင်းရေးနှင့် ကြိုတင်ပြင်ဆင်မှုများကို စစ်ဆေးနိုင်ပါသည်။`}
                </p>
                <span className="text-xs text-[#546358]">
                  အချက်တစ်ခုချင်းစီကို နှိပ်၍ စစ်ဆေးမှတ်သားနိုင်သည်
                </span>
              </div>

              {/* Active Alert Playbooks */}
              <div className="space-y-4">
                {playbooks.map((playbook) => (
                  <article
                    key={playbook.id}
                    className="rounded-xl border border-[#E5E8DF] bg-[#FAF9F6] p-4 sm:p-5 space-y-4"
                  >
                    <div className="space-y-1.5 border-b border-[#E5E8DF] pb-3">
                      <div className="text-xs font-semibold text-[#15623E] flex flex-wrap items-center gap-2">
                        <Sprout className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>{playbook.badgeTextMm}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-[#18221D]">
                        {playbook.titleMm}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#445248] leading-relaxed">
                        {playbook.rationaleMm}
                      </p>
                    </div>

                    <div className="space-y-4 divide-y divide-[#E5E8DF]">
                      {playbook.phases.map((phase, pIdx) => (
                        <div
                          key={phase.phaseTitleMm}
                          className={pIdx === 0 ? "space-y-2.5" : "pt-3.5 space-y-2.5"}
                        >
                          <h4 className="text-xs sm:text-sm font-bold text-[#18221D]">
                            {phase.phaseTitleMm}
                          </h4>
                          <ul className="space-y-2">
                            {phase.stepsMm.map((step, sIdx) => {
                              const stepKey = `${region}-${playbook.id}-${pIdx}-${sIdx}`;
                              const checked = Boolean(checkedSteps[stepKey]);
                              return (
                                <li key={stepKey}>
                                  <button
                                    type="button"
                                    onClick={() => toggleCheckedStep(stepKey)}
                                    aria-pressed={checked}
                                    className="w-full min-h-[40px] text-left flex items-start gap-2.5 py-1 px-2 rounded-lg hover:bg-white transition-colors"
                                  >
                                    <CheckCircle2
                                      className={`w-4 h-4 shrink-0 mt-0.5 transition-colors ${
                                        checked
                                          ? "text-[#15623E]"
                                          : "text-[#9AA59D]"
                                      }`}
                                      aria-hidden="true"
                                    />
                                    <span
                                      className={`text-xs sm:text-sm leading-relaxed ${
                                        checked
                                          ? "line-through text-[#6A786E]"
                                          : "text-[#2C3A30]"
                                      }`}
                                    >
                                      {step}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg bg-white border border-[#E5E8DF] p-3 text-xs text-[#2C3A30] leading-relaxed">
                      <span className="font-bold text-[#15623E]">
                        လုပ်ငန်းချိန်ညှိနှိုင်းရန် —{" "}
                      </span>
                      {playbook.fieldTimingRuleMm}
                    </div>
                  </article>
                ))}
              </div>

              {/* Quick Seasonal Emergency Reference (Always visible for preparedness) */}
              {!hasExtremeAlert && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="rounded-xl border border-[#E5E8DF] bg-[#FAF9F6] p-4 space-y-2">
                    <h4 className="text-sm font-bold text-[#18221D] flex items-center gap-1.5">
                      <Droplets className="w-4 h-4 text-[#15623E]" aria-hidden="true" />
                      <span>ရေကြီး/မိုးများလာပါက ကြိုတင်သတိပြုရန်</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-[#445248] leading-relaxed">
                      မိုးရေချိန် တစ်ရက် ၃၀–၅၀ mm ကျော်နိုင်သည့်အခါ ရေထုတ်မြောင်းများ ကြိုတင်ရှင်းလင်းခြင်း၊ ယူရီးယားကျွေးမှု ရွှေ့ဆိုင်းခြင်းနှင့် ရင့်မှည့်သီးနှံ ဦးစားပေးရိတ်သိမ်းခြင်းတို့ ဆောင်ရွက်ပါ။
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#E5E8DF] bg-[#FAF9F6] p-4 space-y-2">
                    <h4 className="text-sm font-bold text-[#18221D] flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-700" aria-hidden="true" />
                      <span>အပူလှိုင်း/မိုးခေါင်လာပါက ကြိုတင်သတိပြုရန်</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-[#445248] leading-relaxed">
                      အပူချိန် ၃၇°C ကျော်ပြီး မိုးပြတ်ချိန်တွင် အပင်ခြေကောက်ရိုးဖုံးခြင်း (Mulching)၊ နံနက်/ညနေသာ ရေသွင်းခြင်းနှင့် နေ့လယ်ပူချိန် ဆေးဖျန်းခြင်း ရှောင်ကြဉ်ပါ။
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <p className="text-xs text-[#546358] leading-relaxed">
            သတိပြုရန် — ဖော်ပြထားသော ၃ ရက်စာ ခန့်မှန်းချက်သည် တိုင်း/ပြည်နယ် ဗဟိုတည်နေရာအတွက် Open-Meteo တိုက်ရိုက်ဒေတာဖြစ်ပါသည်။ မြို့နယ်အလိုက် ရုတ်တရက်မုန်တိုင်းနှင့် မြစ်ရေကြီးမှု သတင်းများအတွက် မိုးလေဝသနှင့် ဇလဗေဒညွှန်ကြားမှုဦးစီးဌာန (DMH) ထုတ်ပြန်ချက်များကိုလည်း ပူးတွဲစောင့်ကြည့်ပါ။
          </p>
        </div>
      )}
    </section>
  );
}
