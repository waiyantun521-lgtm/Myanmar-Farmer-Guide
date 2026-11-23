import { useState } from "react";
import { AlertTriangle, Calculator, CalendarDays, Leaf } from "lucide-react";
import {
  CROP_FERTILIZER_PROFILES,
  SOIL_ADJUSTMENT_FACTORS,
} from "../data/farmData";
import type { CropKey, SimpleSoilKey } from "../types/farm";

interface FertilizerCalculatorViewProps {
  soilType: SimpleSoilKey;
  onSoilTypeChange: (soil: SimpleSoilKey) => void;
  selectedCrop: CropKey;
  onSelectedCropChange: (crop: CropKey) => void;
}

const KG_PER_BAG = 50;
const KG_PER_VISS = 1.633;

function formatNum(val: number, decimals = 1): string {
  return Number.isFinite(val) ? val.toFixed(decimals) : "0";
}

export function FertilizerCalculatorView({
  soilType,
  onSoilTypeChange,
  selectedCrop,
  onSelectedCropChange,
}: FertilizerCalculatorViewProps) {
  const [acresInput, setAcresInput] = useState<string>("1");
  const [combineOrganic, setCombineOrganic] = useState<boolean>(true);

  const parsedAcres = Math.max(0.1, Math.min(500, parseFloat(acresInput) || 0));
  const cropProfile =
    CROP_FERTILIZER_PROFILES.find((c) => c.key === selectedCrop) ??
    CROP_FERTILIZER_PROFILES[0];
  const soilInfo = SOIL_ADJUSTMENT_FACTORS[soilType];

  // Combining ample organic compost typically offsets ~15% synthetic nitrogen/phosphorus need
  const organicOffset = combineOrganic ? 0.85 : 1.0;

  const ureaKg =
    cropProfile.basePerAcreKg.urea *
    soilInfo.ureaFactor *
    organicOffset *
    parsedAcres;
  const tSuperKg =
    cropProfile.basePerAcreKg.tSuper *
    soilInfo.tSuperFactor *
    organicOffset *
    parsedAcres;
  const potashKg =
    cropProfile.basePerAcreKg.potash *
    soilInfo.potashFactor *
    parsedAcres;
  const compostCarts =
    cropProfile.basePerAcreKg.compostCarts *
    soilInfo.compostFactor *
    (combineOrganic ? 1.0 : 0.5) *
    parsedAcres;

  const fertilizerRows = [
    {
      nameMm: "ယူရီးယား (ပုလဲ - Urea 46%)",
      kg: ureaKg,
      bags: ureaKg / KG_PER_BAG,
      viss: ureaKg / KG_PER_VISS,
      roleMm: "အပင်ကြီးထွားမှုနှင့် အရွက်စိမ်းလန်းမှုအတွက်",
    },
    {
      nameMm: "တီစူပါ (T-Super 46%)",
      kg: tSuperKg,
      bags: tSuperKg / KG_PER_BAG,
      viss: tSuperKg / KG_PER_VISS,
      roleMm: "အမြစ်ဖွံ့ဖြိုးမှုနှင့် ပန်းပွင့်အသီးတင်အားအတွက်",
    },
    {
      nameMm: "ပိုတက်ရှ် (MOP Potash 60%)",
      kg: potashKg,
      bags: potashKg / KG_PER_BAG,
      viss: potashKg / KG_PER_VISS,
      roleMm: "ပင်စည်ခိုင်မာမှု၊ အစေ့အဆန်အောင်မြင်မှုနှင့် ရောဂါဒဏ်ခံနိုင်ရန်",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-2">
        <p className="text-xs sm:text-sm text-[#546358]">
          မြေအမျိုးအစားနှင့် စိုက်ဧကအလိုက် ခန့်မှန်းနှုန်းထား
        </p>
        <h1 className="text-2xl font-bold text-[#18221D]">
          တစ်ဧက မြေဩဇာလိုအပ်ချက် တွက်ချက်စက်
        </h1>
        <p className="text-sm text-[#445248]">
          သီးနှံအမျိုးအစား၊ မြေသားအနေအထားနှင့် စိုက်ပျိုးဧကကို ရွေးချယ်၍ လိုအပ်သော မြေဩဇာအိတ်နှင့်
          ပိဿာပမာဏကို တွက်ချက်နိုင်ပါသည်။
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <section className="lg:col-span-5 bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#15623E]" aria-hidden="true" />
            <h2 className="text-lg font-bold text-[#18221D]">
              တွက်ချက်မည့် အချက်အလက်များ
            </h2>
          </div>

          {/* Crop Selector */}
          <div className="space-y-2">
            <label
              htmlFor="calc-crop"
              className="block text-sm font-medium text-[#2C3A30]"
            >
              ၁။ စိုက်ပျိုးမည့် သီးနှံရွေးချယ်ပါ
            </label>
            <select
              id="calc-crop"
              value={selectedCrop}
              onChange={(e) => onSelectedCropChange(e.target.value as CropKey)}
              className="w-full min-h-[46px] px-3.5 py-2.5 text-sm bg-[#FAF9F6] border border-[#D4D9CE] rounded-xl text-[#18221D] focus:outline-none focus:ring-2 focus:ring-[#15623E]"
            >
              {CROP_FERTILIZER_PROFILES.map((crop) => (
                <option key={crop.key} value={crop.key}>
                  {crop.nameMm}
                </option>
              ))}
            </select>
            <p className="text-xs text-[#546358]">{cropProfile.shortDescMm}</p>
          </div>

          {/* Soil Type Selector */}
          <div className="space-y-2">
            <span className="block text-sm font-medium text-[#2C3A30]">
              ၂။ မြေအမျိုးအစား ရွေးချယ်ပါ
            </span>
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#F3F5F0] rounded-xl">
              {(["sandy", "loam", "clay"] as SimpleSoilKey[]).map((key) => {
                const active = soilType === key;
                const label =
                  key === "sandy" ? "သဲမြေ" : key === "loam" ? "နုန်းမြေ" : "ရွှံ့မြေ";
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSoilTypeChange(key)}
                    className={`min-h-[44px] px-2 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      active
                        ? "bg-white text-[#15623E] shadow-sm font-semibold"
                        : "text-[#445248] hover:text-[#18221D]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[#546358] leading-relaxed">
              {soilInfo.noteMm}
            </p>
          </div>

          {/* Acreage Input */}
          <div className="space-y-2">
            <label
              htmlFor="calc-acres"
              className="block text-sm font-medium text-[#2C3A30]"
            >
              ၃။ စိုက်ပျိုးဧက အရေအတွက်
            </label>
            <div className="flex items-center gap-2">
              <input
                id="calc-acres"
                type="number"
                min="0.1"
                max="500"
                step="0.5"
                value={acresInput}
                onChange={(e) => setAcresInput(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2.5 text-base font-mono tabular-nums bg-[#FAF9F6] border border-[#D4D9CE] rounded-xl text-[#18221D] focus:outline-none focus:ring-2 focus:ring-[#15623E]"
              />
              <span className="text-sm font-medium text-[#445248] whitespace-nowrap shrink-0">
                ဧက
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {["0.5", "1", "2", "5", "10"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAcresInput(preset)}
                  className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-medium tabular-nums border transition-colors ${
                    acresInput === preset
                      ? "bg-[#15623E] text-white border-[#15623E]"
                      : "bg-white text-[#445248] border-[#D4D9CE] hover:bg-[#F3F5F0]"
                  }`}
                >
                  {preset} ဧက
                </button>
              ))}
            </div>
          </div>

          {/* Organic Blend Toggle */}
          <div className="pt-1 border-t border-[#ECEFE7]">
            <button
              type="button"
              onClick={() => setCombineOrganic((prev) => !prev)}
              aria-pressed={combineOrganic}
              className="w-full min-h-[48px] flex items-center justify-between gap-3 p-3 rounded-xl bg-[#FAF9F6] border border-[#E2E5DC] text-left"
            >
              <div className="flex items-start gap-2.5">
                <Leaf
                  className="w-4 h-4 text-[#15623E] shrink-0 mt-1"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-[#18221D]">
                    သဘာဝမြေဆွေး ပူးတွဲထည့်သွင်းမည်
                  </p>
                  <p className="text-xs text-[#546358]">
                    မြေဆွေးလုံလောက်စွာ ထည့်ပါက ဓာတ်မြေဩဇာ ကုန်ကျစရိတ် ၁၅% ခန့် လျှော့ချနိုင်သည်
                  </p>
                </div>
              </div>
              <span
                className={`w-11 h-6 rounded-full transition-colors p-0.5 shrink-0 flex items-center ${
                  combineOrganic ? "bg-[#15623E] justify-end" : "bg-[#CBD2C6] justify-start"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-white shadow-sm block" />
              </span>
            </button>
          </div>
        </section>

        {/* Results Column */}
        <section className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#ECEFE7] pb-3">
              <h2 className="text-lg font-bold text-[#18221D]">
                စုစုပေါင်း လိုအပ်မည့် ခန့်မှန်းပမာဏ
              </h2>
              <span className="text-sm font-medium text-[#15623E] tabular-nums">
                {formatNum(parsedAcres, 1)} ဧက · {soilInfo.nameMm}
              </span>
            </div>

            <div className="divide-y divide-[#ECEFE7]">
              {fertilizerRows.map((row) => (
                <div
                  key={row.nameMm}
                  className="py-4 first:pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <p className="text-base font-semibold text-[#18221D]">
                      {row.nameMm}
                    </p>
                    <p className="text-xs text-[#546358]">{row.roleMm}</p>
                  </div>
                  <div className="flex items-baseline gap-3 sm:text-right shrink-0">
                    <span className="text-xl font-bold font-mono text-[#15623E] tabular-nums">
                      {formatNum(row.bags, 2)} အိတ်
                    </span>
                    <span className="text-xs text-[#546358] font-mono tabular-nums">
                      ({formatNum(row.viss, 1)} ပိဿာ / {formatNum(row.kg, 1)} kg)
                    </span>
                  </div>
                </div>
              ))}

              {/* Organic Compost Row */}
              <div className="py-4 last:pb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <p className="text-base font-semibold text-[#18221D]">
                    သဘာဝမြေဆွေး / နွားချေးဆွေး
                  </p>
                  <p className="text-xs text-[#546358]">
                    မြေသားဖွဲ့စည်းပုံနှင့် အဏုဇီဝပိုးများ ကောင်းမွန်စေရန်
                  </p>
                </div>
                <div className="flex items-baseline gap-3 sm:text-right shrink-0">
                  <span className="text-xl font-bold font-mono text-[#15623E] tabular-nums">
                    {formatNum(compostCarts, 1)} လှည်း
                  </span>
                  <span className="text-xs text-[#546358] font-mono tabular-nums">
                    (ခန့်မှန်း {Math.round(compostCarts * 300)} ပိဿာ)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#546358] pt-2 border-t border-[#ECEFE7]">
              မှတ်ချက် — ၁ အိတ် = ၅၀ ကီလိုဂရမ် (ခန့်မှန်း ၃၀.၆ ပိဿာ) နှုန်းဖြင့် တွက်ချက်ထားပါသည်။
            </p>
          </div>

          {/* Split Application Schedule */}
          <div className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#15623E]" aria-hidden="true" />
              <h3 className="text-lg font-bold text-[#18221D]">
                အချိန်အခါအလိုက် ခွဲဝေကျွေးမွေးရန် အစီအစဉ်
              </h3>
            </div>

            <div className="divide-y divide-[#ECEFE7]">
              {cropProfile.scheduleMm.map((stage, idx) => (
                <div key={idx} className="py-3.5 first:pt-1 last:pb-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[#18221D]">
                      {stage.stageMm}
                    </p>
                    <span className="text-xs font-medium text-[#15623E]">
                      {stage.timingMm}
                    </span>
                  </div>
                  <p className="text-sm text-[#445248]">{stage.ratioNoteMm}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 flex items-start gap-3">
            <AlertTriangle
              className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
              အထက်ပါ ပမာဏများသည် စိုက်ပျိုးရေးစံနှုန်း ခန့်မှန်းချက်သာ ဖြစ်ပါသည်။ ယခင်ရာသီ
              မြေဩဇာကျန်ရှိမှုနှင့် တိကျသော မြေဆီလွှာ NPK ဓာတ်ခွဲရလဒ်အပေါ် မူတည်၍ ချိန်ဆသုံးစွဲပါ။
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
