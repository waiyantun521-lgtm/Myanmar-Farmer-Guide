import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Camera,
  CheckCircle2,
  Droplets,
  FlaskConical,
  Hand,
  ImagePlus,
  Info,
  Loader2,
  MapPin,
  RotateCcw,
  ShieldAlert,
  Sprout,
  Sun,
  Upload,
  X,
} from "lucide-react";
import {
  HERO_SOIL_IMAGE,
  MYANMAR_REGIONS,
  MYANMAR_SEASONS,
} from "../data/farmData";
import type { SimpleSoilKey, SoilAnalysisResult, SoilCategory } from "../types/farm";
import { ResilientImage } from "./ResilientImage";
import { WeatherAlertSection } from "./WeatherAlertSection";

interface SoilAnalyzerViewProps {
  onApplySoilToCalculator: (soil: SimpleSoilKey) => void;
  onExploreCrops: (region: string, season: string, soil: SimpleSoilKey) => void;
}

function mapSoilCategoryToSimple(cat: SoilCategory): SimpleSoilKey {
  if (cat === "sandy" || cat === "sandy_loam") return "sandy";
  if (cat === "clay" || cat === "clay_loam") return "clay";
  return "loam";
}

async function readAsDataUrlFallback(
  file: Blob
): Promise<{ base64: string; mimeType: string; previewUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === "string" ? reader.result : "";
      if (!dataUrl) {
        reject(new Error("ပုံဖတ်ရှု၍ မရပါ။ အခြားဓာတ်ပုံတစ်ပုံ ရွေးချယ်ကြည့်ပါ။"));
        return;
      }
      resolve({
        base64: dataUrl,
        mimeType: file.type || "image/jpeg",
        previewUrl: dataUrl,
      });
    };
    reader.onerror = () => {
      reject(new Error("ပုံဖတ်ရှု၍ မရပါ။ အခြားဓာတ်ပုံတစ်ပုံ ရွေးချယ်ကြည့်ပါ။"));
    };
    reader.readAsDataURL(file);
  });
}

async function compressImageFile(
  fileOrBlob: Blob
): Promise<{ base64: string; mimeType: string; previewUrl: string }> {
  if (fileOrBlob.type && !fileOrBlob.type.startsWith("image/")) {
    throw new Error("ဓာတ်ပုံဖိုင် (JPEG, PNG, WebP) ကိုသာ ရွေးချယ်ပေးပါ။");
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(fileOrBlob);
    const img = new Image();
    img.onload = () => {
      try {
        const maxDim = 1280;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          reject(new Error("ဓာတ်ပုံပြင်ဆင်၍ မရပါ။"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        URL.revokeObjectURL(objectUrl);
        resolve({
          base64: dataUrl,
          mimeType: "image/jpeg",
          previewUrl: dataUrl,
        });
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };
    img.onerror = async () => {
      URL.revokeObjectURL(objectUrl);
      if (fileOrBlob.size <= 8 * 1024 * 1024) {
        try {
          const fallback = await readAsDataUrlFallback(fileOrBlob);
          resolve(fallback);
          return;
        } catch {
          // fall through to Burmese error
        }
      }
      reject(new Error("ပုံဖတ်ရှု၍ မရပါ။ JPEG သို့မဟုတ် PNG ဓာတ်ပုံတစ်ပုံ ရွေးချယ်ကြည့်ပါ။"));
    };
    img.src = objectUrl;
  });
}

export function SoilAnalyzerView({
  onApplySoilToCalculator,
  onExploreCrops,
}: SoilAnalyzerViewProps) {
  const [region, setRegion] = useState<string>(MYANMAR_REGIONS[0]);
  const [season, setSeason] = useState<string>(MYANMAR_SEASONS[0]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<SoilAnalysisResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const captureInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
    setCameraError(null);
  };

  const openLiveCamera = async () => {
    setCameraError(null);
    setErrorMsg(null);
    const isTouchOrMobile =
      window.matchMedia("(pointer: coarse)").matches ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    // On smartphones/tablets, trigger native rear camera synchronously inside user gesture
    if (isTouchOrMobile || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      captureInputRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 60);
    } catch {
      setErrorMsg(
        "ဘရောက်ဇာ ကင်မရာဖွင့်ခွင့် မရရှိပါ။ 'Gallery မှ ရွေးမည်' ခလုတ်မှတစ်ဆင့် ဓာတ်ပုံရွေးချယ်နိုင်ပါသည်။"
      );
    }
  };

  const captureFromVideo = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
    setPreviewUrl(dataUrl);
    setImageBase64(dataUrl);
    setMimeType("image/jpeg");
    setResult(null);
    setErrorMsg(null);
    stopCameraStream();
  };

  const handleFileSelected = async (file: File | undefined) => {
    if (!file) return;
    setErrorMsg(null);
    setResult(null);
    try {
      const compressed = await compressImageFile(file);
      setPreviewUrl(compressed.previewUrl);
      setImageBase64(compressed.base64);
      setMimeType(compressed.mimeType);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "ဓာတ်ပုံပြင်ဆင်ရာတွင် အခက်အခဲရှိနေပါသည်။"
      );
    }
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      setErrorMsg("စစ်ဆေးရန် မြေဓာတ်ပုံတစ်ပုံကို ဦးစွာရိုက်ယူ သို့မဟုတ် တင်ပေးပါ။");
      return;
    }
    setIsAnalyzing(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/analyze-soil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          region,
          season,
        }),
      });
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error(
          res.status === 413
            ? "ဓာတ်ပုံဖိုင်အရွယ်အစား ကြီးလွန်းနေပါသည်။ အခြားပုံတစ်ပုံဖြင့် ထပ်မံကြိုးစားပါ။"
            : "ဆာဗာမှ အချက်အလက် ပြန်လည်ပေးပို့ရာတွင် အခက်အခဲရှိနေပါသည်။ ထပ်မံကြိုးစားပါ။"
        );
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "စစ်ဆေးမှု မအောင်မြင်ပါ။ ထပ်မံကြိုးစားကြည့်ပါ။");
      }
      setResult(data as SoilAnalysisResult);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "ဆာဗာနှင့် ချိတ်ဆက်၍ မရပါ။ အင်တာနက်လိုင်း စစ်ဆေးပြီး ထပ်မံကြိုးစားပါ။"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetPhoto = () => {
    setPreviewUrl(null);
    setImageBase64(null);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6">
      {/* Intro Hero Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch bg-white border border-[#E2E5DC] rounded-2xl overflow-hidden">
        <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-center space-y-4">
          <div className="text-xs sm:text-sm font-medium text-[#546358] flex flex-wrap items-center gap-2">
            <span>AI မြေဆီလွှာစစ်ဆေးခြင်း</span>
            <span aria-hidden="true">·</span>
            <span>ဒေသအလိုက် သီးနှံရွေးချယ်မှု</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#18221D] leading-snug"
            style={{ textWrap: "balance" }}
          >
            စိုက်ခင်းမြေဓာတ်ပုံရိုက်ပြီး မြေအမျိုးအစားနှင့် သင့်တော်သည့် သီးနှံများကို စစ်ဆေးပါ
          </h1>
          <p className="text-sm sm:text-base text-[#445248] leading-relaxed">
            သဘာဝနေရောင်အောက်တွင် မြေသားပုံစံထင်ရှားစွာ ဓာတ်ပုံရိုက်တင်ခြင်းဖြင့် သဲမြေ၊ ရွှံ့မြေ၊
            နုန်းမြေ စသည်တို့ကို Gemini AI ဖြင့် ခန့်မှန်းပေးပြီး မိမိဒေသနှင့် ရာသီအလိုက်
            စိုက်ပျိုးသင့်သော သီးနှံများကို အကြံပြုပေးပါမည်။
          </p>

          {/* Mandatory Photo Limitation Warning */}
          <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 flex items-start gap-3">
            <AlertTriangle
              className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="text-xs sm:text-sm text-amber-950 leading-relaxed space-y-1">
              <p className="font-semibold text-amber-900">
                အရေးကြီးသတိပေးချက် (ဓာတ်ပုံစစ်ဆေးမှု ကန့်သတ်ချက်)
              </p>
              <p>
                မြေအရောင်ဓာတ်ပုံတစ်ပုံတည်းဖြင့် မြေချဉ်ငန်ဓာတ် (pH)၊ NPK အာဟာရပမာဏနှင့်
                ဆားဓာတ် (Salinity) တို့ကို အတိအကျ မတိုင်းတာနိုင်ပါ။ မျက်မြင်မြေအမျိုးအစားကိုသာ
                ခန့်မှန်းပေးခြင်းဖြစ်ပြီး တိကျသောစစ်ဆေးမှုအတွက် မြေဆီလွှာဓာတ်ခွဲခန်းတွင် စစ်ဆေးသင့်ပါသည်။
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 min-h-[220px] lg:min-h-full relative bg-[#EEF2EA]">
          <ResilientImage
            src={HERO_SOIL_IMAGE}
            alt="တောင်သူတစ်ဦး၏ လက်ထဲမှ မြေဆီသြဇာကောင်းသော စိုက်ခင်းမြေသား"
            fallbackTitleMm="မြန်မာ့စိုက်ခင်း မြေဆီလွှာ"
            className="w-full h-full object-cover lg:absolute lg:inset-0"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 text-white">
            <p className="text-xs sm:text-sm font-medium">
              နေရောင်အောက်တွင် အပေါ်ယံ ၂-၃ လက်မခန့် ခြစ်၍ ကြည်လင်စွာ ရိုက်ကူးပါ
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard 3-Day Weather Forecast & Extreme Weather Alert */}
      <WeatherAlertSection region={region} onRegionChange={setRegion} />

      {/* Main Analyzer Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input & Capture Column */}
        <section className="lg:col-span-5 bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-5">
          <h2 className="text-lg font-bold text-[#18221D]">
            ၁။ ဒေသ၊ ရာသီနှင့် မြေဓာတ်ပုံ ထည့်သွင်းရန်
          </h2>

          {/* Region & Season Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[#2C3A30] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#15623E]" aria-hidden="true" />
                စိုက်ပျိုးမည့် ဒေသ (တိုင်း/ပြည်နယ်)
              </span>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D4D9CE] rounded-xl text-[#18221D] focus:outline-none focus:ring-2 focus:ring-[#15623E]"
              >
                {MYANMAR_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-[#2C3A30] flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-[#15623E]" aria-hidden="true" />
                စိုက်ပျိုးမည့် ရာသီ
              </span>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D4D9CE] rounded-xl text-[#18221D] focus:outline-none focus:ring-2 focus:ring-[#15623E]"
              >
                {MYANMAR_SEASONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Hidden Inputs */}
          <input
            ref={captureInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
          />
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
          />

          {/* Upload / Preview Dropzone */}
          {!previewUrl ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileSelected(e.dataTransfer.files?.[0]);
              }}
              className={`rounded-2xl border-2 border-dashed transition-colors p-6 text-center space-y-4 ${
                isDragging
                  ? "border-[#15623E] bg-[#15623E]/5"
                  : "border-[#CFD6C8] bg-[#FAF9F6]"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#EEF2EA] text-[#15623E] flex items-center justify-center mx-auto">
                <ImagePlus className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#18221D]">
                  မြေသားဓာတ်ပုံ ရိုက်ယူပါ သို့မဟုတ် ဖုန်းထဲမှ ရွေးချယ်ပါ
                </p>
                <p className="text-xs text-[#546358]">
                  အရိပ်မကျဘဲ မြေမှုန်မြေခဲ ထင်ရှားသည့်ပုံဆိုလျှင် ပိုမိုတိကျစွာ ခန့်မှန်းနိုင်ပါသည်
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={openLiveCamera}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#15623E] hover:bg-[#114F32] text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                >
                  <Camera className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">Camera ဖြင့် ရိုက်မည်</span>
                </button>
                <button
                  type="button"
                  onClick={() => uploadInputRef.current?.click()}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-white hover:bg-[#F3F5F0] text-[#18221D] border border-[#CFD6C8] text-sm font-medium flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                >
                  <Upload className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">Gallery မှ ရွေးမည်</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-[#E2E5DC] aspect-[4/3] bg-[#F3F5F0]">
                <img
                  src={previewUrl}
                  alt="စစ်ဆေးမည့် မြေဓာတ်ပုံ"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={resetPhoto}
                  disabled={isAnalyzing}
                  aria-label="ဓာတ်ပုံဖယ်ရှားရန်"
                  className="absolute top-3 right-3 min-h-[44px] min-w-[44px] rounded-xl bg-black/65 hover:bg-black/80 text-white flex items-center justify-center transition-colors disabled:opacity-40"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={resetPhoto}
                  disabled={isAnalyzing}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[#CFD6C8] bg-white hover:bg-[#F3F5F0] text-sm font-medium text-[#18221D] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">ပုံအသစ်ပြောင်းမည်</span>
                </button>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#15623E] hover:bg-[#114F32] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 active:scale-[0.98]"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
                      <span className="whitespace-nowrap">AI စစ်ဆေးနေသည်...</span>
                    </>
                  ) : (
                    <>
                      <Sprout className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className="whitespace-nowrap">AI ဖြင့် စစ်ဆေးမည်</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div
              role="alert"
              className="rounded-xl border border-red-300 bg-red-50 p-3.5 text-sm text-red-900 space-y-2.5"
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" aria-hidden="true" />
                <p>{errorMsg}</p>
              </div>
              {imageBase64 && !isAnalyzing && (
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-red-800 hover:bg-red-900 text-white text-xs font-medium transition-colors"
                >
                  ထပ်မံကြိုးစားမည်
                </button>
              )}
            </div>
          )}
        </section>

        {/* Results Column */}
        <section className="lg:col-span-7 space-y-5">
          {!result && !isAnalyzing && (
            <div className="space-y-5">
              <div className="bg-white border border-[#E2E5DC] rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="text-lg font-bold text-[#18221D]">
                  ၂။ AI ခန့်မှန်းချက်နှင့် လက်တွေ့စစ်ဆေးနည်း လမ်းညွှန်
                </h2>
                <p className="text-sm text-[#546358] leading-relaxed">
                  အပေါ်ယံမြက်နှင့် သစ်ရွက်များဖယ်ရှားပြီး မြေသားအနီးကပ်ပုံ (၁ ပေခန့် အကွာမှ နေရောင်ထဲတွင်)
                  ရိုက်တင်ပေးပါ။ မြေသားကို အနီးကပ်မမြင်ရပါက AI က အတိအကျ မခန့်မှန်းဘဲ နောက်ထပ်ဓာတ်ပုံ
                  ထပ်မံတောင်းဆိုပါမည်။
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E8DF]">
                    <p className="text-sm font-semibold text-[#18221D]">
                      ဖြစ်နိုင်ခြေ ၄ မျိုးနှင့် ယုံကြည်မှုအဆင့်
                    </p>
                    <p className="text-xs text-[#546358] mt-1">
                      သဲမြေ၊ ရွှံ့မြေ၊ နုန်းမြေနှင့် Loam Soil တို့ကို ဖြစ်နိုင်ခြေအလိုက် ခွဲခြားပြသခြင်း
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E8DF]">
                    <p className="text-sm font-semibold text-[#18221D]">
                      လက်ဖြင့်ညှစ် &amp; ရေဘူးအနည်ကျ စမ်းသပ်နည်း
                    </p>
                    <p className="text-xs text-[#546358] mt-1">
                      လယ်ကွင်းထဲတွင် ကိုယ်တိုင်သေချာစွာ အတည်ပြုနိုင်မည့် လက်တွေ့စမ်းသပ်နည်းများ
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E8DF]">
                    <p className="text-sm font-semibold text-[#18221D]">
                      သင့်တော်သော သီးနှံနှင့် မြေပြုပြင်နည်း
                    </p>
                    <p className="text-xs text-[#546358] mt-1">
                      ရွေးချယ်ထားသော ဒေသ၊ ရာသီနှင့် မြေသားကိုက်ညီသည့် အကြံပြုချက်များ
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E8DF]">
                    <p className="text-sm font-semibold text-[#18221D]">
                      pH၊ NPK နှင့် ဆားဓာတ် မခန့်မှန်းခြင်း
                    </p>
                    <p className="text-xs text-[#546358] mt-1">
                      ဓာတ်ပုံတစ်ပုံတည်းဖြင့် မတိုင်းတာနိုင်သော ဓာတုဓာတ်ခွဲချက်များကို မှားယွင်းမခန့်မှန်းပါ
                    </p>
                  </div>
                </div>
              </div>

              {/* Always-available Quick Field Test Reference */}
              <div className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-4">
                <h3 className="text-base font-bold text-[#18221D]">
                  စိုက်ခင်းထဲတွင် ကိုယ်တိုင်စစ်ဆေးနိုင်သည့် လက်တွေ့နည်းလမ်း ၂ မျိုး
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] space-y-1.5">
                    <p className="text-sm font-semibold text-[#15623E] flex items-center gap-1.5">
                      <Hand className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>၁။ လက်ဖြင့်ညှစ်စမ်းသပ်ခြင်း</span>
                    </p>
                    <p className="text-xs text-[#445248] leading-relaxed">
                      မြေတစ်ဆုပ်ကို ရေအနည်းငယ်စွတ်၍ ညှစ်ကြည့်ပါ။ သဲမြေသည် ကြမ်းရှပြီး အလုံးမဖြစ်ဘဲ ပြိုကျတတ်သည်။
                      Loam Soil သည် စေးပိုင်ရုံမျှ အလုံးဖြစ်၍ ဖိလျှင် ကြေမွလွယ်သည်။ ရွှံ့မြေသည် စေးကပ်ပြီး
                      လက်ချောင်းကြား ဖိညှစ်ပါက အပြားရှည် ထွက်လာပါမည်။
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] space-y-1.5">
                    <p className="text-sm font-semibold text-[#15623E] flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>၂။ ရေဘူးထဲထည့်၍ အနည်ကျစမ်းသပ်ခြင်း</span>
                    </p>
                    <p className="text-xs text-[#445248] leading-relaxed">
                      ရေသန့်ဘူးအကြည်ထဲသို့ မြေ ၃ ပုံ ၁ ပုံ၊ ရေသန့် ၃ ပုံ ၂ ပုံ (ဆားအနည်းငယ်) ထည့်၍ ပြင်းပြင်းလှုပ်ပြီး
                      တည့်တည့်ထောင်ထားပါ။ ၁ မိနစ်တွင် အောက်ဆုံး၌ သဲ၊ ၁-၂ နာရီတွင် အလယ်၌ နုန်း၊ ၂၄ နာရီတွင်
                      အပေါ်ဆုံး၌ ရွှံ့အလွှာများ ခွဲခြားမြင်နိုင်ပါသည်။
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="bg-white border border-[#E2E5DC] rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3 min-h-[280px]">
              <Loader2 className="w-8 h-8 text-[#15623E] animate-spin" aria-hidden="true" />
              <p className="text-base font-semibold text-[#18221D]">
                Gemini AI ဖြင့် မြေသားအနီးကပ်ပုံ ရှင်းလင်းမှုနှင့် မြေအမျိုးအစား ဖြစ်နိုင်ခြေများကို စစ်ဆေးနေပါသည်...
              </p>
              <p className="text-xs text-[#546358]">
                {region} · {season} အတွက် သင့်တော်သော သီးနှံနှင့် လက်တွေ့စမ်းသပ်နည်းများ ပြင်ဆင်နေပါသည်
              </p>
            </div>
          )}

          {result && (
            <div className="space-y-5">
              {/* Retake / Low-Clarity Guardrail Card */}
              {(!result.isPhotoClearEnough ||
                result.confidenceLevel === "insufficient" ||
                result.confidenceLevel === "low") && (
                <div
                  role="status"
                  className="rounded-2xl border border-amber-400 bg-amber-50 p-5 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <ShieldAlert
                      className="w-6 h-6 text-amber-800 shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-amber-950">
                        မြေသားပုံ မရှင်းလင်းသေးသဖြင့် နောက်ထပ် အနီးကပ်ဓာတ်ပုံ ထပ်မံပေးပို့ပါ
                      </h3>
                      <p className="text-sm text-amber-900 leading-relaxed">
                        {result.retakeRequestMm}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2.5 pl-9">
                    <button
                      type="button"
                      onClick={openLiveCamera}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      <Camera className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>အနီးကပ် Camera ထပ်ရိုက်မည်</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => uploadInputRef.current?.click()}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-amber-100/60 text-amber-950 border border-amber-300 text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      <Upload className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Gallery မှ ပုံအသစ်ရွေးမည်</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Primary Soil Prediction + Confidence Level */}
              <div className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#546358]">
                      <span>{region}</span>
                      <span aria-hidden="true">·</span>
                      <span>{season}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`font-semibold inline-flex items-center gap-1 ${
                          result.confidenceLevel === "high"
                            ? "text-[#15623E]"
                            : result.confidenceLevel === "medium"
                              ? "text-[#2C3A30]"
                              : "text-amber-800"
                        }`}
                      >
                        <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        {result.confidenceLabelMm}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-[#18221D]">
                      {result.soilTypeMm}
                    </h2>

                    <p className="text-xs sm:text-sm text-[#445248] leading-relaxed">
                      {result.confidenceReasonMm}
                    </p>
                  </div>

                  {result.isPhotoClearEnough && result.soilCategory !== "unknown" && (
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          onApplySoilToCalculator(
                            mapSoilCategoryToSimple(result.soilCategory)
                          )
                        }
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-[#15623E] hover:bg-[#114F32] text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>ဤမြေဖြင့် မြေဩဇာတွက်မည်</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onExploreCrops(
                            region,
                            season,
                            mapSoilCategoryToSimple(result.soilCategory)
                          )
                        }
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-white hover:bg-[#F3F5F0] text-[#15623E] border border-[#CFD6C8] text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                      >
                        <span>သီးနှံ ၄၂ မျိုးတွင် ရှာမည်</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 4 Soil Types Likelihood Breakdown */}
                {result.soilLikelihoods && result.soilLikelihoods.length > 0 && (
                  <div className="border-t border-[#ECEFE7] pt-4 space-y-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="text-sm font-bold text-[#18221D]">
                        မြေအမျိုးအစား (၄) မျိုး ဖြစ်နိုင်ခြေ ခွဲခြမ်းစိတ်ဖြာမှု
                      </h3>
                      <span className="text-xs text-[#546358]">
                        မျက်မြင်လက္ခဏာအပေါ် အခြေခံသည့် ဖြစ်နိုင်ခြေ
                      </span>
                    </div>

                    <div className="space-y-3">
                      {result.soilLikelihoods.map((item) => {
                        const pct = Math.max(0, Math.min(100, item.likelihoodPercent || 0));
                        return (
                          <div
                            key={item.typeKey}
                            className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] space-y-2"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                              <span className="font-semibold text-[#18221D]">
                                {item.typeNameMm}
                              </span>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-[#546358]">
                                  {item.likelihoodLabelMm}
                                </span>
                                <span className="font-mono font-bold text-[#15623E] tabular-nums">
                                  {pct}%
                                </span>
                              </div>
                            </div>

                            <div className="w-full h-2 bg-[#E5E8DF] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#15623E] rounded-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>

                            <p className="text-xs text-[#445248] leading-relaxed">
                              {item.reasonMm}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Possible Reasons + Visual Observations + Drainage */}
                <div className="border-t border-[#ECEFE7] pt-4 space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-[#18221D]">
                      ဖြစ်နိုင်သော အကြောင်းရင်းနှင့် ခန့်မှန်းချက် ရှင်းလင်းချက်
                    </h3>
                    <p className="text-sm text-[#35443A] leading-relaxed">
                      {result.possibleReasonsMm}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-semibold text-[#18221D]">
                        မျက်မြင်မြေသား လက္ခဏာ
                      </h3>
                      <p className="text-sm text-[#445248] leading-relaxed">
                        {result.visualObservationsMm}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-semibold text-[#18221D] flex items-center gap-1.5">
                        <Droplets className="w-4 h-4 text-[#15623E]" aria-hidden="true" />
                        ရေထိန်းအားနှင့် ရေစီးဆင်းမှု
                      </h3>
                      <p className="text-sm text-[#445248] leading-relaxed">
                        {result.waterAndDrainageMm}
                      </p>
                    </div>
                  </div>
                </div>

                {result.soilImprovementTipsMm.length > 0 && (
                  <div className="border-t border-[#ECEFE7] pt-4 space-y-2.5">
                    <h3 className="text-sm font-semibold text-[#18221D]">
                      မြေဆီလွှာ ပိုမိုကောင်းမွန်စေရန် ပြုပြင်နည်းများ
                    </h3>
                    <ul className="space-y-2">
                      {result.soilImprovementTipsMm.map((tip, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-[#35443A]"
                        >
                          <CheckCircle2
                            className="w-4 h-4 text-[#15623E] shrink-0 mt-1"
                            aria-hidden="true"
                          />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Practical Field Tests Card (Hand Squeeze + Water Bottle Settling) */}
              <div className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-bold text-[#18221D]">
                    မြေအမျိုးအစား သေချာစေရန် လက်တွေ့စမ်းသပ်ရမည့် နည်းလမ်းများ
                  </h3>
                  <p className="text-xs text-[#546358]">
                    AI ခန့်မှန်းချက်ကို စိုက်ခင်းထဲတွင် အောက်ပါလက်တွေ့နည်း ၂ မျိုးဖြင့် တိုက်ဆိုင်အတည်ပြုပါ
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] space-y-2">
                    <h4 className="text-sm font-bold text-[#15623E] flex items-center gap-2">
                      <Hand className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>၁။ လက်ဖြင့်ညှစ်စမ်းသပ်ခြင်း (Hand Test)</span>
                    </h4>
                    <p className="text-sm text-[#35443A] leading-relaxed">
                      {result.handTestGuidanceMm}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] space-y-2">
                    <h4 className="text-sm font-bold text-[#15623E] flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>၂။ ရေဘူးထဲထည့်၍ အနည်ကျစမ်းသပ်ခြင်း (Jar Test)</span>
                    </h4>
                    <p className="text-sm text-[#35443A] leading-relaxed">
                      {result.jarTestGuidanceMm}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Crops */}
              {result.recommendedCrops && result.recommendedCrops.length > 0 && (
                <div className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="space-y-0.5">
                    <h3 className="text-lg font-bold text-[#18221D]">
                      သင့်တော်သော သီးနှံအကြံပြုချက်များ
                    </h3>
                    <p className="text-xs text-[#546358]">
                      {result.soilTypeMm} · {region} · {season}
                    </p>
                  </div>

                  <div className="divide-y divide-[#ECEFE7]">
                    {result.recommendedCrops.map((crop, idx) => (
                      <div key={idx} className="py-3.5 first:pt-1 last:pb-1 space-y-1.5">
                        <p className="text-base font-semibold text-[#15623E]">
                          {crop.cropNameMm}
                        </p>
                        <p className="text-sm text-[#2C3A30] leading-relaxed">
                          {crop.suitabilityReasonMm}
                        </p>
                        <p className="text-xs sm:text-sm text-[#546358] leading-relaxed">
                          စိုက်ပျိုးဂရုစိုက်ရန် — {crop.plantingCareMm}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explicit Photo Limitation Reminder */}
              <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-4 sm:p-5 flex items-start gap-3">
                <AlertTriangle
                  className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="space-y-1 text-xs sm:text-sm text-amber-950 leading-relaxed">
                  <p className="font-semibold text-amber-900">
                    pH၊ NPK နှင့် ဆားဓာတ် မခန့်မှန်းနိုင်ကြောင်း သတိပေးချက်
                  </p>
                  <p>{result.photoLimitationReminderMm}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Live Camera Modal (desktop/browser webcam support) */}
      {cameraOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="ကင်မရာဖြင့် မြေဓာတ်ပုံရိုက်ရန်"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden border border-[#E2E5DC]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#ECEFE7]">
              <h3 className="text-base font-bold text-[#18221D]">
                မြေသားဓာတ်ပုံ ရိုက်ကူးရန်
              </h3>
              <button
                type="button"
                onClick={stopCameraStream}
                aria-label="ပိတ်ရန်"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-[#445248] hover:bg-[#F3F5F0]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-black aspect-[4/3] relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            {cameraError && (
              <p className="px-5 py-2 text-xs text-red-700">{cameraError}</p>
            )}
            <div className="p-4 flex items-center justify-end gap-3 bg-[#FAF9F6]">
              <button
                type="button"
                onClick={stopCameraStream}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#CFD6C8] bg-white text-sm font-medium text-[#18221D]"
              >
                မလုပ်တော့ပါ
              </button>
              <button
                type="button"
                onClick={captureFromVideo}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#15623E] text-white text-sm font-semibold flex items-center gap-2"
              >
                <Camera className="w-4 h-4" aria-hidden="true" />
                <span>ဓာတ်ပုံရိုက်မည်</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
