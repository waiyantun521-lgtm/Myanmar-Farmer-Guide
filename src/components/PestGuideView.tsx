import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Bug,
  CheckCircle2,
  ChevronRight,
  FlaskConical,
  Leaf,
  Loader2,
  Microscope,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { ALL_CROPS_PESTS, getPestsForCrop } from "../data/allCropsPests";
import { FORTY_CROPS_CATALOG } from "../data/cropsCatalog";
import { CRUCIFER_PESTS } from "../data/cruciferCropsAndPests";
import { MYANMAR_REGIONS, PEST_DISEASE_GUIDE } from "../data/farmData";
import type {
  CropCategoryFilter,
  CropGuideProfile,
  CropPestGuideItem,
  CruciferPestCropScope,
  PestAdviceResult,
  PestCropFilter,
} from "../types/farm";
import { ResilientImage } from "./ResilientImage";

export type PestSectionMode = "all_crops" | "crucifer" | "field_crops";

interface PestGuideViewProps {
  initialSection?: PestSectionMode;
  initialCropId?: string;
  initialCruciferScope?: CruciferPestCropScope;
}

const SECTION_TABS: { key: PestSectionMode; labelMm: string }[] = [
  { key: "all_crops", labelMm: "သီးနှံ ၄၂ မျိုး ပိုးမွှားနှင့် ပိုးသတ်ဆေးလမ်းညွှန်" },
  { key: "crucifer", labelMm: "ဂေါ်ဖီထုပ်နှင့် ပန်းဂေါ်ဖီ (သီးခြားကဏ္ဍ)" },
  { key: "field_crops", labelMm: "စပါး၊ ပဲ၊ နှမ်း၊ မြေပဲ ရောဂါနှင့် ပိုးမွှား" },
];

const CROP_CATEGORY_TABS: { key: CropCategoryFilter; labelMm: string }[] = [
  { key: "all", labelMm: "အားလုံး (၄၂ မျိုး)" },
  { key: "cereal_industrial", labelMm: "နှံစားနှင့် စက်မှုသီးနှံ" },
  { key: "oilseed_pulse", labelMm: "ဆီထွက်နှင့် ပဲမျိုးစုံ" },
  { key: "vegetable_tuber", labelMm: "ဟင်းသီးဟင်းရွက်နှင့် ဥ/အသီးအနှံ" },
  { key: "fruit_plantation", labelMm: "သစ်သီးဝလံနှင့် နှစ်ရှည်ပင်" },
];

const CRUCIFER_SCOPE_TABS: { key: CruciferPestCropScope; labelMm: string }[] = [
  { key: "all", labelMm: "၂ မျိုးလုံး သက်ဆိုင်မှု" },
  { key: "cabbage", labelMm: "ဂေါ်ဖီထုပ် (Cabbage) အတွက်" },
  { key: "cauliflower", labelMm: "ပန်းဂေါ်ဖီ (Cauliflower) အတွက်" },
];

const FIELD_CROP_FILTERS: { key: PestCropFilter; labelMm: string }[] = [
  { key: "all", labelMm: "အားလုံး" },
  { key: "rice", labelMm: "စပါး" },
  { key: "pulses", labelMm: "ပဲမျိုးစုံ" },
  { key: "sesame", labelMm: "နှမ်း" },
  { key: "groundnut", labelMm: "မြေပဲ" },
];

function cleanCropTitle(nameMm: string): string {
  return nameMm.replace(/^[၀-၉0-9]+။\s*/, "").trim();
}

function CropPestDetailCard({
  pest,
  index,
  onJumpToCrop,
  showCropBadge = false,
}: {
  pest: CropPestGuideItem;
  index: number;
  onJumpToCrop?: (cropId: string) => void;
  showCropBadge?: boolean;
}) {
  return (
    <article className="bg-white border border-[#E2E5DC] rounded-2xl overflow-hidden flex flex-col">
      {/* 2. Pest Photo */}
      <div className="aspect-[16/10] w-full bg-[#EEF2EA] overflow-hidden border-b border-[#ECEFE7]">
        <ResilientImage
          src={pest.imageUrl}
          alt={pest.imageAltMm}
          fallbackTitleMm={pest.nameMm}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* 1. Pest Names & Metadata (Zero-Pill) */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#546358]">
            <div className="flex flex-wrap items-center gap-1.5">
              {showCropBadge && (
                <>
                  <span className="font-semibold text-[#15623E]">
                    {cleanCropTitle(pest.cropNameMm)}
                  </span>
                  <span aria-hidden="true">·</span>
                </>
              )}
              <span className="font-semibold text-[#15623E]">
                ပိုးမွှား ၀{index + 1}
              </span>
              <span aria-hidden="true">·</span>
              <span>{pest.englishName}</span>
              <span aria-hidden="true">·</span>
              <span className="italic">{pest.scientificName}</span>
            </div>

            <span
              className={`font-medium flex items-center gap-1 ${
                pest.severityMm === "အထူးသတိပြုရန်"
                  ? "text-amber-800"
                  : "text-[#445248]"
              }`}
            >
              {pest.severityMm === "အထူးသတိပြုရန်" && (
                <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              {pest.severityMm}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-[#18221D]">
              {pest.nameMm}
            </h3>
            {showCropBadge && onJumpToCrop && (
              <button
                type="button"
                onClick={() => onJumpToCrop(pest.cropId)}
                className="min-h-[38px] px-3 py-1.5 rounded-lg bg-[#F3F5F0] hover:bg-[#E5EAE0] text-xs font-medium text-[#15623E] whitespace-nowrap transition-colors"
              >
                {cleanCropTitle(pest.cropNameMm)} စာရင်းသို့ ကြည့်မည်
              </button>
            )}
          </div>
        </div>

        {/* 3. Affected Plant Parts */}
        <div className="rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] p-3.5 space-y-1">
          <h4 className="text-xs font-bold text-[#15623E]">
            ၃။ ပိုးကျရောက်သည့် အပင်အစိတ်အပိုင်း
          </h4>
          <p className="text-sm text-[#18221D] leading-relaxed">
            {pest.affectedPartsMm}
          </p>
        </div>

        {/* 4. Symptoms */}
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-[#18221D]">
            ၄။ ပိုးကျရောက်သည့် လက္ခဏာများ
          </h4>
          <p className="text-sm text-[#35443A] leading-relaxed">
            {pest.symptomsMm}
          </p>
        </div>

        {/* 5. Prevention */}
        <div className="border-t border-[#ECEFE7] pt-3.5 space-y-1.5">
          <h4 className="text-xs sm:text-sm font-bold text-[#18221D]">
            ၅။ ကြိုတင်ကာကွယ်နည်းများ
          </h4>
          <ul className="space-y-1.5">
            {pest.preventionMm.map((tip, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-[#35443A]"
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

        {/* 6. Natural Control */}
        <div className="border-t border-[#ECEFE7] pt-3.5 space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-[#15623E] flex items-center gap-1.5">
            <Leaf className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>၆။ သဘာဝပိုးမွှားကာကွယ်နည်း</span>
          </h4>
          <p className="text-sm text-[#35443A] leading-relaxed">
            {pest.naturalControlMm}
          </p>
        </div>

        {/* 7. Bio-Pesticide Usage Conditions */}
        <div className="border-t border-[#ECEFE7] pt-3.5 space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-[#15623E] flex items-center gap-1.5">
            <Microscope className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>၇။ ဇီဝပိုးသတ်ဆေး အသုံးပြုနိုင်သည့်အခြေအနေ</span>
          </h4>
          <p className="text-sm text-[#35443A] leading-relaxed">
            {pest.bioPesticideMm}
          </p>
        </div>

        {/* 8. Chemical Pesticide Guide (All 9 Required Sub-Fields) */}
        <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-4 sm:p-5 space-y-3">
          <div className="flex items-start gap-2">
            <FlaskConical
              className="w-4 h-4 text-amber-900 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                ၈။ လိုအပ်ပါက ဓာတုပိုးသတ်ဆေး အကြောင်း (ဘေးကင်းရေးနှင့် မှတ်ပုံတင်စစ်ဆေးရန် လမ်းညွှန်)
              </h4>
              <p className="text-xs text-amber-900">
                သဘာဝနှင့် ဇီဝနည်းများဖြင့် မထိန်းချုပ်နိုင်ဘဲ စီးပွားရေးထိခိုက်မှုအဆင့် ကျော်လွန်မှသာ အောက်ပါအချက် ၉ ချက်ကို စစ်ဆေးလိုက်နာပါ။
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-2.5 text-xs sm:text-sm text-amber-950 divide-y divide-amber-200/70">
            <div className="pt-2 first:pt-0 space-y-0.5">
              <dt className="font-bold text-amber-900">
                (၁) ဆေးအမည်နှင့် Active Ingredient
              </dt>
              <dd className="leading-relaxed">
                {pest.chemicalGuide.activeIngredientInfoMm}
              </dd>
            </div>

            <div className="pt-2 space-y-0.5">
              <dt className="font-bold text-amber-900">
                (၂) ဆေးအုပ်စုနှင့် အာနိသင်လုပ်ဆောင်ပုံ (IRAC / Mode of Action)
              </dt>
              <dd className="leading-relaxed">
                {pest.chemicalGuide.groupAndModeMm}
              </dd>
            </div>

            <div className="pt-2 space-y-0.5">
              <dt className="font-bold text-amber-900">
                (၃) ဘယ်ပိုး (မည်သည့်အဆင့်) ကို ထိန်းချုပ်နိုင်သလဲ
              </dt>
              <dd className="leading-relaxed">
                {pest.chemicalGuide.targetPestControlMm}
              </dd>
            </div>

            <div className="pt-2 space-y-0.5">
              <dt className="font-bold text-red-900">
                (၄) သက်ဆိုင်ရာသီးနှံတွင် အသုံးပြုခွင့်ရှိ၊ မရှိ (PRB မှတ်ပုံတင်စစ်ဆေးချက်)
              </dt>
              <dd className="leading-relaxed text-red-950 font-medium">
                {pest.chemicalGuide.cropAuthorizationStatusMm}
              </dd>
            </div>

            <div className="pt-2 space-y-0.5">
              <dt className="font-bold text-amber-900">
                (၅) ဆေးဘူးတံဆိပ်ပါ သုံးစွဲနှုန်းနှင့် အသုံးပြုနည်း
              </dt>
              <dd className="leading-relaxed">
                {pest.chemicalGuide.labelDosageAndMethodMm}
              </dd>
            </div>

            <div className="pt-2 space-y-0.5">
              <dt className="font-bold text-amber-900">
                (၆) ဆေးဖြန်းချိန်နှင့် ကြိုတင်ကာကွယ်ရေး
              </dt>
              <dd className="leading-relaxed">
                {pest.chemicalGuide.sprayTimingAndPrecautionMm}
              </dd>
            </div>

            <div className="pt-2 space-y-0.5">
              <dt className="font-bold text-amber-900">
                (၇) ရိတ်သိမ်းမတိုင်မီ စောင့်ဆိုင်းရမည့်ကာလ (PHI)
              </dt>
              <dd className="leading-relaxed">
                {pest.chemicalGuide.phiWarningMm}
              </dd>
            </div>

            <div className="pt-2 space-y-0.5">
              <dt className="font-bold text-amber-900">
                (၈) ဆေးဖြန်းရာတွင် ဝတ်ဆင်ရမည့် အကာအကွယ်ပစ္စည်းများ (PPE)
              </dt>
              <dd className="leading-relaxed">
                {pest.chemicalGuide.ppeRequiredMm}
              </dd>
            </div>

            <div className="pt-2 space-y-0.5">
              <dt className="font-bold text-amber-900">
                (၉) ပိုးသတ်ဆေးအုပ်စု မတူညီသည့်ဆေးများကို စနစ်တကျ လှည့်လည်အသုံးပြုနည်း
              </dt>
              <dd className="leading-relaxed">
                {pest.chemicalGuide.moaRotationMm}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}

export function PestGuideView({
  initialSection = "all_crops",
  initialCropId,
  initialCruciferScope = "all",
}: PestGuideViewProps) {
  const [sectionMode, setSectionMode] = useState<PestSectionMode>(initialSection);
  const [categoryFilter, setCategoryFilter] = useState<CropCategoryFilter>("all");
  const [selectedCropId, setSelectedCropId] = useState<string>(
    initialCropId || FORTY_CROPS_CATALOG[0].id
  );
  const [mobileShowDetail, setMobileShowDetail] = useState<boolean>(Boolean(initialCropId));
  const [searchScope, setSearchScope] = useState<"all_42" | "selected_crop">("all_42");
  const [cruciferScope, setCruciferScope] =
    useState<CruciferPestCropScope>(initialCruciferScope);
  const [cropFilter, setCropFilter] = useState<PestCropFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSectionMode(initialSection);
  }, [initialSection]);

  useEffect(() => {
    if (initialCropId) {
      setSelectedCropId(initialCropId);
      setCategoryFilter("all");
      setSearchQuery("");
      setMobileShowDetail(true);
    }
  }, [initialCropId]);

  useEffect(() => {
    setCruciferScope(initialCruciferScope);
  }, [initialCruciferScope]);

  // AI Quick Consultation state
  const [consultCrop, setConsultCrop] = useState("စပါး");
  const [consultRegion, setConsultRegion] = useState<string>(MYANMAR_REGIONS[0]);
  const [symptomQuestion, setSymptomQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);
  const [adviceResult, setAdviceResult] = useState<PestAdviceResult | null>(null);

  const q = searchQuery.trim().toLowerCase();

  // Crops directory filtered by category
  const visibleCrops = FORTY_CROPS_CATALOG.filter(
    (crop) => categoryFilter === "all" || crop.category === categoryFilter
  );

  const activeCrop: CropGuideProfile =
    visibleCrops.find((c) => c.id === selectedCropId) ??
    visibleCrops[0] ??
    FORTY_CROPS_CATALOG[0];

  const activeCropPests = getPestsForCrop(activeCrop.id);

  // Search filtering for the 42-crop guide
  const matchingPestsFromSearch: CropPestGuideItem[] = q
    ? (searchScope === "all_42" ? ALL_CROPS_PESTS : activeCropPests).filter(
        (p) =>
          p.nameMm.toLowerCase().includes(q) ||
          p.englishName.toLowerCase().includes(q) ||
          p.scientificName.toLowerCase().includes(q) ||
          p.cropNameMm.toLowerCase().includes(q) ||
          p.affectedPartsMm.toLowerCase().includes(q) ||
          p.symptomsMm.toLowerCase().includes(q) ||
          p.chemicalGuide.activeIngredientInfoMm.toLowerCase().includes(q)
      )
    : [];

  const filteredCruciferPests = CRUCIFER_PESTS.filter((pest) => {
    if (!q) return true;
    return (
      pest.nameMm.toLowerCase().includes(q) ||
      pest.englishName.toLowerCase().includes(q) ||
      pest.scientificName.toLowerCase().includes(q) ||
      pest.symptomsMm.toLowerCase().includes(q) ||
      pest.causesMm.toLowerCase().includes(q) ||
      pest.cabbageRelevanceMm.toLowerCase().includes(q) ||
      pest.cauliflowerRelevanceMm.toLowerCase().includes(q) ||
      pest.naturalControlMm.toLowerCase().includes(q)
    );
  });

  const filteredFieldEntries = PEST_DISEASE_GUIDE.filter((item) => {
    const matchesCrop = cropFilter === "all" || item.cropKey === cropFilter;
    const matchesSearch =
      !q ||
      item.nameMm.toLowerCase().includes(q) ||
      item.cropNameMm.toLowerCase().includes(q) ||
      item.symptomsMm.toLowerCase().includes(q) ||
      item.englishName.toLowerCase().includes(q);
    return matchesCrop && matchesSearch;
  });

  const handleSelectDirectoryCrop = (cropId: string) => {
    setSelectedCropId(cropId);
    setMobileShowDetail(true);
    const found = FORTY_CROPS_CATALOG.find((c) => c.id === cropId);
    if (found) {
      setConsultCrop(cleanCropTitle(found.nameMm));
    }
  };

  const handleJumpToCropFromSearch = (cropId: string) => {
    setSearchQuery("");
    setCategoryFilter("all");
    handleSelectDirectoryCrop(cropId);
  };

  const handleAskPestAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomQuestion.trim()) {
      setAskError("သိလိုသော ရောဂါ သို့မဟုတ် ပိုးမွှားလက္ခဏာကို ရေးသားပေးပါ။");
      return;
    }
    setIsAsking(true);
    setAskError(null);
    setAdviceResult(null);
    try {
      const res = await fetch("/api/pest-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop: consultCrop,
          region: consultRegion,
          symptomQuestion,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "မေးမြန်းမှု မအောင်မြင်ပါ။");
      }
      setAdviceResult(data as PestAdviceResult);
    } catch (err) {
      setAskError(
        err instanceof Error
          ? err.message
          : "ဆာဗာနှင့် ချိတ်ဆက်၍ မရပါ။ ထပ်မံကြိုးစားပါ။"
      );
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Page Header, Mode Tabs & Search System */}
      <section className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="space-y-1.5">
          <div className="text-xs sm:text-sm text-[#546358] flex flex-wrap items-center gap-2">
            <span>သီးနှံ ၄၂ မျိုး ပိုးမွှားကာကွယ်ရေးနှင့် ပိုးသတ်ဆေးလမ်းညွှန်စနစ်</span>
            <span aria-hidden="true">·</span>
            <span>ပိုးမွှား {ALL_CROPS_PESTS.length} မျိုးစာရင်း</span>
          </div>
          <h1 className="text-2xl font-bold text-[#18221D]">
            ပိုးမွှားကာကွယ်ရေးနှင့် ပိုးသတ်ဆေးလမ်းညွှန်
          </h1>
          <p className="text-sm text-[#445248] leading-relaxed">
            App ထဲရှိ သီးနှံ ၄၂ မျိုးလုံးအတွက် သီးခြားပိုးမွှားစာရင်းများ၊ ပိုးမွှားဓာတ်ပုံ၊ လက္ခဏာ၊ သဘာဝ/ဇီဝနည်းနှင့် ဓာတုပိုးသတ်ဆေး ဘေးကင်းရေးလမ်းညွှန် ၉ ချက်တို့ကို သီးနှံအလိုက် ရှာဖွေလေ့လာနိုင်ပါသည်။
          </p>
        </div>

        {/* Section Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#F3F5F0] rounded-xl overflow-x-auto">
          {SECTION_TABS.map((tab) => {
            const active = sectionMode === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSectionMode(tab.key)}
                className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                  active
                    ? "bg-white text-[#15623E] shadow-sm font-semibold"
                    : "text-[#445248] hover:text-[#18221D]"
                }`}
              >
                {tab.labelMm}
              </button>
            );
          })}
        </div>

        {/* Pest Name Search System */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 pt-1">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-[#546358] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ပိုးမွှားအမည် (မြန်မာ/English)၊ သီးနှံအမည် သို့မဟုတ် လက္ခဏာ ရှာရန်..."
              aria-label="ပိုးမွှားအမည် ရှာဖွေရေးစနစ်"
              className="w-full min-h-[46px] pl-10 pr-4 py-2.5 text-sm bg-[#FAF9F6] border border-[#D4D9CE] rounded-xl text-[#18221D] placeholder:text-[#78857B] focus:outline-none focus:ring-2 focus:ring-[#15623E]"
            />
          </div>

          {sectionMode === "all_crops" && (
            <div className="flex items-center gap-1 p-1 bg-[#F3F5F0] rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setSearchScope("all_42")}
                className={`min-h-[42px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  searchScope === "all_42"
                    ? "bg-white text-[#15623E] shadow-sm font-semibold"
                    : "text-[#445248]"
                }`}
              >
                သီးနှံ ၄၂ မျိုးလုံးတွင် ရှာမည်
              </button>
              <button
                type="button"
                onClick={() => setSearchScope("selected_crop")}
                className={`min-h-[42px] px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  searchScope === "selected_crop"
                    ? "bg-white text-[#15623E] shadow-sm font-semibold"
                    : "text-[#445248]"
                }`}
              >
                ရွေးထားသော သီးနှံ၌သာ
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 1: ALL 42 CROPS PEST & PESTICIDE GUIDE */}
      {sectionMode === "all_crops" && (
        <section aria-labelledby="all-crops-pest-heading" className="space-y-5">
          {/* Mandatory Official Registration & Non-Guessing Notice */}
          <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-4 sm:p-5 flex items-start gap-3">
            <ShieldAlert
              className="w-5 h-5 text-amber-800 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div className="text-xs sm:text-sm text-amber-950 leading-relaxed space-y-1">
              <p className="font-bold text-amber-900">
                မြန်မာနိုင်ငံ ပိုးသတ်ဆေးမှတ်ပုံတင်အဖွဲ့ (PRB) ခွင့်ပြုချက်နှင့် ဆေးနှုန်းထား မသေချာမှုဆိုင်ရာ သတိပေးချက်
              </p>
              <p>
                ဤ App သည် အွန်လိုင်း PRB တရားဝင်မှတ်ပုံတင်ဒေတာဘေ့စ်နှင့် တိုက်ရိုက်ချိတ်ဆက် စစ်ဆေးနိုင်ခြင်း မရှိသေးပါ။ ထို့ကြောင့်{" "}
                <strong>သီးနှံတစ်မျိုးချင်းစီအတွက် ဆေးအမည်အလိုက် တရားဝင်ခွင့်ပြုချက် ရှိ/မရှိမှာ မသေချာသေးပါ</strong> —
                ဝယ်ယူအသုံးပြုမည့် ဆေးဘူးတံဆိပ်ပေါ်ရှိ မှတ်ပုံတင်အမှတ်၊ သက်ဆိုင်ရာသီးနှံခွင့်ပြုချက်၊ တိကျသောသုံးစွဲနှုန်းနှင့်
                ရိတ်သိမ်းမတိုင်မီ စောင့်ဆိုင်းရမည့်ကာလ (PHI) ကို ကိုယ်တိုင်စစ်ဆေးပြီး နီးစပ်ရာ စိုက်ပျိုးရေးဦးစီးဌာန/PPD နှင့် တိုက်ဆိုင်အတည်ပြုသုံးစွဲပါ။
              </p>
            </div>
          </div>

          {/* Search Results View OR Crop-by-Crop Directory */}
          {q ? (
            <div className="space-y-4">
              <div className="bg-white border border-[#E2E5DC] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h2
                    id="all-crops-pest-heading"
                    className="text-base sm:text-lg font-bold text-[#18221D]"
                  >
                    “{searchQuery}” ရှာဖွေမှုရလဒ် ({matchingPestsFromSearch.length} ခု)
                  </h2>
                  <p className="text-xs text-[#546358]">
                    {searchScope === "all_42"
                      ? "သီးနှံ ၄၂ မျိုးလုံးရှိ ပိုးမွှားစာရင်းများမှ ရှာဖွေပြသထားပါသည်"
                      : `${cleanCropTitle(activeCrop.nameMm)} အတွင်းမှ ရှာဖွေပြသထားပါသည်`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#F3F5F0] hover:bg-[#E6EAE1] text-xs font-medium text-[#18221D] whitespace-nowrap"
                >
                  ရှာဖွေမှု ရှင်းလင်းမည်
                </button>
              </div>

              {matchingPestsFromSearch.length === 0 ? (
                <div className="bg-white border border-[#E2E5DC] rounded-2xl p-8 text-center space-y-3">
                  <p className="text-base font-semibold text-[#18221D]">
                    “{searchQuery}” နှင့် ကိုက်ညီသော ပိုးမွှားအချက်အလက် မတွေ့ရှိပါ
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="min-h-[44px] px-5 py-2 rounded-xl bg-[#15623E] text-white text-sm font-medium"
                  >
                    သီးနှံ ၄၂ မျိုး စာရင်းသို့ ပြန်သွားမည်
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {matchingPestsFromSearch.map((pest, idx) => (
                    <CropPestDetailCard
                      key={pest.id}
                      pest={pest}
                      index={idx}
                      showCropBadge
                      onJumpToCrop={handleJumpToCropFromSearch}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Crop Category Filter Bar */}
              <div className="bg-white border border-[#E2E5DC] rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2
                    id="all-crops-pest-heading"
                    className="text-base sm:text-lg font-bold text-[#18221D]"
                  >
                    သီးနှံအလိုက် ပိုးမွှားစာရင်း (သီးနှံ {visibleCrops.length} မျိုး)
                  </h2>
                  <span className="text-xs text-[#546358]">
                    သီးနှံတစ်မျိုးကို နှိပ်၍ ပိုးမွှားနှင့် ပိုးသတ်ဆေးလမ်းညွှန် ကြည့်ရှုပါ
                  </span>
                </div>

                <div className="flex items-center gap-1 p-1 bg-[#F3F5F0] rounded-xl overflow-x-auto">
                  {CROP_CATEGORY_TABS.map((tab) => {
                    const active = categoryFilter === tab.key;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => {
                          setCategoryFilter(tab.key);
                          setMobileShowDetail(false);
                        }}
                        className={`min-h-[42px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                          active
                            ? "bg-white text-[#15623E] shadow-sm font-semibold"
                            : "text-[#445248] hover:text-[#18221D]"
                        }`}
                      >
                        {tab.labelMm}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Master-Detail Crop-to-Pest Browser */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Crop Directory List */}
                <div
                  className={`lg:col-span-4 bg-white border border-[#E2E5DC] rounded-2xl overflow-hidden ${
                    mobileShowDetail ? "hidden lg:block" : "block"
                  }`}
                >
                  <div className="px-4 py-3 border-b border-[#ECEFE7] text-xs font-bold text-[#18221D]">
                    သီးနှံရွေးချယ်ရန် ({visibleCrops.length} မျိုး)
                  </div>
                  <div className="divide-y divide-[#ECEFE7] lg:max-h-[960px] lg:overflow-y-auto">
                    {visibleCrops.map((crop) => {
                      const isSelected = activeCrop.id === crop.id;
                      const pestCount = getPestsForCrop(crop.id).length;
                      return (
                        <button
                          key={crop.id}
                          type="button"
                          onClick={() => handleSelectDirectoryCrop(crop.id)}
                          className={`w-full min-h-[64px] px-4 py-3.5 text-left flex items-center justify-between gap-3 transition-colors ${
                            isSelected
                              ? "bg-[#EEF2EA]/80"
                              : "bg-white hover:bg-[#FAF9F6]"
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-sm sm:text-base font-bold text-[#18221D] truncate">
                              {crop.nameMm}
                            </p>
                            <div className="text-xs text-[#546358] flex items-center gap-1.5">
                              <span className="truncate">{crop.englishName}</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-medium text-[#15623E] shrink-0">
                                ပိုးမွှား {pestCount} မျိုး
                              </span>
                            </div>
                          </div>
                          <ChevronRight
                            className={`w-4 h-4 shrink-0 ${
                              isSelected ? "text-[#15623E]" : "text-[#78857B]"
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Selected Crop's Pest List */}
                <div
                  className={`lg:col-span-8 space-y-5 ${
                    mobileShowDetail ? "block" : "hidden lg:block"
                  }`}
                >
                  <div className="lg:hidden">
                    <button
                      type="button"
                      onClick={() => setMobileShowDetail(false)}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-[#D4D9CE] text-sm font-medium text-[#18221D] inline-flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      <span>သီးနှံ ၄၂ မျိုး စာရင်းသို့ ပြန်သွားမည်</span>
                    </button>
                  </div>

                  <div className="bg-white border border-[#E2E5DC] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-[#546358] flex items-center gap-1.5">
                        <span className="font-semibold text-[#15623E]">
                          {activeCrop.categoryLabelMm}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{activeCrop.englishName}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#18221D]">
                        {activeCrop.nameMm} — ပိုးမွှားကာကွယ်ရေးနှင့် ပိုးသတ်ဆေးလမ်းညွှန်
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-[#15623E]">
                      အဓိကပိုးမွှား {activeCropPests.length} မျိုး
                    </span>
                  </div>

                  <div className="space-y-5">
                    {activeCropPests.map((pest, idx) => (
                      <CropPestDetailCard key={pest.id} pest={pest} index={idx} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* SECTION 2: DEDICATED CRUCIFER (CABBAGE & CAULIFLOWER) 6-PEST SPOTLIGHT */}
      {sectionMode === "crucifer" && (
        <section
          aria-labelledby="crucifer-pest-heading"
          className="space-y-5"
        >
          <div className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <div className="text-xs sm:text-sm text-[#546358] flex flex-wrap items-center gap-2">
                  <span>သီးခြား ပိုးမွှားကာကွယ်ရေးကဏ္ဍ</span>
                  <span aria-hidden="true">·</span>
                  <span>ဂေါ်ဖီထုပ် (Cabbage) နှင့် ပန်းဂေါ်ဖီ (Cauliflower)</span>
                </div>
                <h2
                  id="crucifer-pest-heading"
                  className="text-xl sm:text-2xl font-bold text-[#18221D]"
                >
                  ဂေါ်ဖီထုပ်နှင့် ပန်းဂေါ်ဖီ ပိုးမွှား ၆ မျိုး ကာကွယ်နှိမ်နင်းနည်း
                </h2>
              </div>

              <div className="flex items-center gap-1 p-1 bg-[#F3F5F0] rounded-xl overflow-x-auto shrink-0">
                {CRUCIFER_SCOPE_TABS.map((tab) => {
                  const active = cruciferScope === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setCruciferScope(tab.key)}
                      className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
                        active
                          ? "bg-white text-[#15623E] shadow-sm font-semibold"
                          : "text-[#445248] hover:text-[#18221D]"
                      }`}
                    >
                      {tab.labelMm}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-amber-300 bg-amber-50/85 p-4 flex items-start gap-3">
              <ShieldAlert
                className="w-5 h-5 text-amber-800 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="text-xs sm:text-sm text-amber-950 leading-relaxed space-y-1">
                <p className="font-bold text-amber-900">
                  ဓာတုပိုးသတ်ဆေး ဘေးကင်းစွာ သုံးစွဲရေး အရေးကြီးသတိပေးချက်
                </p>
                <p>
                  ဓာတုပိုးသတ်ဆေး အသုံးပြုရန် လိုအပ်လာပါက ဂေါ်ဖီထုပ်/ပန်းဂေါ်ဖီ သီးနှံအတွက်
                  တရားဝင် <strong>မှတ်ပုံတင်ထားသော ဆေး</strong> ကိုသာ ရွေးချယ်အသုံးပြုပါ။
                  ဆေးဘူးပေါ်ပါ ညွှန်ကြားချက်၊ သတ်မှတ်သုံးစွဲနှုန်း၊ ရိတ်သိမ်းမတိုင်မီ စောင့်ဆိုင်းရမည့်ကာလ (PHI)
                  နှင့် အကာအကွယ်ပစ္စည်း (PPE) များကို တိကျစွာ လိုက်နာပါ —
                  မသေချာသော ဆေးနှုန်းထားများကို မိမိသဘောဖြင့် မခန့်မှန်းပါနှင့်။
                </p>
              </div>
            </div>
          </div>

          {filteredCruciferPests.length === 0 ? (
            <div className="bg-white border border-[#E2E5DC] rounded-2xl p-8 text-center space-y-2">
              <p className="text-base font-semibold text-[#18221D]">
                ဂေါ်ဖီ/ပန်းဂေါ်ဖီ ပိုးမွှားစာရင်းတွင် ရှာဖွေမှုနှင့် ကိုက်ညီသော အချက်အလက် မတွေ့ရှိပါ
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-[#15623E] text-white text-sm font-medium"
              >
                ပိုးမွှား ၆ မျိုးလုံး ပြန်ပြမည်
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCruciferPests.map((pest, idx) => (
                <article
                  key={pest.id}
                  className="bg-white border border-[#E2E5DC] rounded-2xl overflow-hidden flex flex-col"
                >
                  <div className="aspect-[4/3] w-full bg-[#EEF2EA] overflow-hidden border-b border-[#ECEFE7]">
                    <ResilientImage
                      src={pest.imageUrl}
                      alt={pest.imageAltMm}
                      fallbackTitleMm={pest.nameMm}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#546358]">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-[#15623E]">
                            ပိုးမွှား ၀{idx + 1}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{pest.englishName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="italic">{pest.scientificName}</span>
                        </div>
                        <span
                          className={`font-medium flex items-center gap-1 ${
                            pest.severityMm === "အထူးသတိပြုရန်"
                              ? "text-amber-800"
                              : "text-[#445248]"
                          }`}
                        >
                          {pest.severityMm === "အထူးသတိပြုရန်" && (
                            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                          )}
                          {pest.severityMm}
                        </span>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-[#18221D]">
                        {pest.nameMm}
                      </h3>
                    </div>

                    <div className="rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] p-4 space-y-2.5">
                      <p className="text-xs font-bold text-[#15623E]">
                        သီးနှံတစ်မျိုးစီအပေါ် သက်ဆိုင်မှုနှင့် ထိခိုက်ပုံ
                      </p>
                      {(cruciferScope === "all" || cruciferScope === "cabbage") && (
                        <div className="text-xs sm:text-sm text-[#2C3A30] leading-relaxed">
                          <span className="font-semibold text-[#18221D]">
                            ဂေါ်ဖီထုပ် (Cabbage) —{" "}
                          </span>
                          {pest.cabbageRelevanceMm}
                        </div>
                      )}
                      {(cruciferScope === "all" || cruciferScope === "cauliflower") && (
                        <div className="text-xs sm:text-sm text-[#2C3A30] leading-relaxed">
                          <span className="font-semibold text-[#18221D]">
                            ပန်းဂေါ်ဖီ (Cauliflower) —{" "}
                          </span>
                          {pest.cauliflowerRelevanceMm}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[#18221D]">
                        ၂။ အပင်တွင် တွေ့ရသော လက္ခဏာများ
                      </h4>
                      <p className="text-sm text-[#35443A] leading-relaxed">
                        {pest.symptomsMm}
                      </p>
                    </div>

                    <div className="border-t border-[#ECEFE7] pt-3 space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[#18221D]">
                        ၃။ ပိုးကျရောက်ရသည့် အကြောင်းရင်း
                      </h4>
                      <p className="text-sm text-[#35443A] leading-relaxed">
                        {pest.causesMm}
                      </p>
                    </div>

                    <div className="border-t border-[#ECEFE7] pt-3 space-y-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-[#18221D]">
                        ၄။ ကြိုတင်ကာကွယ်နည်းများ
                      </h4>
                      <ul className="space-y-1.5">
                        {pest.preventionMm.map((tip, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-[#35443A]"
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

                    <div className="border-t border-[#ECEFE7] pt-3 space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[#15623E] flex items-center gap-1.5">
                        <Leaf className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>၅။ သဘာဝနည်းဖြင့် ကာကွယ်နှိမ်နင်းနည်း</span>
                      </h4>
                      <p className="text-sm text-[#35443A] leading-relaxed">
                        {pest.naturalControlMm}
                      </p>
                    </div>

                    <div className="mt-auto rounded-xl bg-amber-50/80 border border-amber-200 p-4 space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-amber-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>၆။ လိုအပ်ပါက သင့်တော်သော ပိုးသတ်ဆေးနှင့် ဘေးကင်းရေးလမ်းညွှန်</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                        {pest.chemicalGuidanceMm}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECTION 3: EXISTING FIELD CROPS DISEASE & PEST GUIDE (RICE, PULSES, SESAME, GROUNDNUT) */}
      {sectionMode === "field_crops" && (
        <section aria-labelledby="field-pest-heading" className="space-y-5">
          <div className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-[#546358]">
                  စိုက်ပျိုးရေး သီးနှံ ၄ မျိုး အဓိက ရောဂါနှင့် ပိုးမွှားကာကွယ်နှိမ်နင်းနည်း
                </p>
                <h2
                  id="field-pest-heading"
                  className="text-xl font-bold text-[#18221D]"
                >
                  စပါး၊ ပဲ၊ နှမ်း၊ မြေပဲ ရောဂါနှင့် ပိုးမွှားကာကွယ်နည်းများ
                </h2>
              </div>

              <div className="flex items-center gap-1 p-1 bg-[#F3F5F0] rounded-xl overflow-x-auto">
                {FIELD_CROP_FILTERS.map((tab) => {
                  const active = cropFilter === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setCropFilter(tab.key)}
                      className={`min-h-[42px] px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                        active
                          ? "bg-white text-[#15623E] shadow-sm font-semibold"
                          : "text-[#445248] hover:text-[#18221D]"
                      }`}
                    >
                      {tab.labelMm}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {filteredFieldEntries.length === 0 ? (
            <div className="bg-white border border-[#E2E5DC] rounded-2xl p-8 text-center space-y-2">
              <p className="text-base font-semibold text-[#18221D]">
                ကိုက်ညီသော အချက်အလက် မတွေ့ရှိပါ
              </p>
              <p className="text-sm text-[#546358]">
                အခြားသီးနှံအမျိုးအစားကို ပြောင်းလဲရှာဖွေကြည့်ပါ သို့မဟုတ် အောက်တွင် AI ဖြင့် တိုက်ရိုက်မေးမြန်းပါ။
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredFieldEntries.map((entry) => (
                <article
                  key={entry.id}
                  className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#546358]">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#15623E]">
                          {entry.cropNameMm}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{entry.categoryMm}</span>
                        <span aria-hidden="true">·</span>
                        <span>{entry.englishName}</span>
                      </div>
                      <span
                        className={`font-medium flex items-center gap-1 ${
                          entry.severityMm === "အထူးသတိပြုရန်"
                            ? "text-amber-800"
                            : "text-[#445248]"
                        }`}
                      >
                        {entry.severityMm === "အထူးသတိပြုရန်" && (
                          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                        {entry.severityMm}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#18221D] flex items-center gap-2">
                      <Bug className="w-4 h-4 text-[#15623E] shrink-0" aria-hidden="true" />
                      <span>{entry.nameMm}</span>
                    </h3>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-[#2C3A30]">
                        တွေ့ရတတ်သော လက္ခဏာများ
                      </p>
                      <p className="text-sm text-[#445248] leading-relaxed">
                        {entry.symptomsMm}
                      </p>
                    </div>

                    <div className="border-t border-[#ECEFE7] pt-3 space-y-1.5">
                      <p className="text-xs font-semibold text-[#2C3A30]">
                        ကြိုတင်ကာကွယ်နည်းများ
                      </p>
                      <ul className="space-y-1.5">
                        {entry.preventionMm.map((tip, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-[#35443A]"
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

                    <div className="border-t border-[#ECEFE7] pt-3 space-y-1">
                      <p className="text-xs font-semibold text-[#15623E]">
                        သဘာဝနည်းဖြင့် နှိမ်နင်းခြင်း
                      </p>
                      <p className="text-sm text-[#35443A] leading-relaxed">
                        {entry.organicControlMm}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] p-3.5 text-xs text-[#445248] leading-relaxed flex items-start gap-2">
                    <ShieldCheck
                      className="w-4 h-4 text-[#15623E] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{entry.safeIpmNoteMm}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* AI Pest & Symptom Consultation Section (Supports All 42 Crops) */}
      <section className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-[#18221D]">
            မိမိစိုက်ခင်းမှ ပိုးမွှား/ရောဂါလက္ခဏာကို AI ဖြင့် ထပ်မံမေးမြန်းရန်
          </h2>
          <p className="text-sm text-[#546358]">
            သီးနှံ ၄၂ မျိုးအတွင်း မည်သည့်သီးနှံတွင်မဆို တွေ့ရသော လက္ခဏာများကို အောက်တွင် ရွေးချယ်မေးမြန်းနိုင်ပါသည်။
          </p>
        </div>

        <form onSubmit={handleAskPestAi} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-[#2C3A30]">သီးနှံ (၄၂ မျိုး)</span>
              <select
                value={consultCrop}
                onChange={(e) => setConsultCrop(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 text-sm bg-[#FAF9F6] border border-[#D4D9CE] rounded-xl text-[#18221D]"
              >
                {FORTY_CROPS_CATALOG.map((crop) => {
                  const label = cleanCropTitle(crop.nameMm);
                  return (
                    <option key={crop.id} value={label}>
                      {label} ({crop.englishName})
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-[#2C3A30]">ဒေသ</span>
              <select
                value={consultRegion}
                onChange={(e) => setConsultRegion(e.target.value)}
                className="w-full min-h-[44px] px-3 py-2 text-sm bg-[#FAF9F6] border border-[#D4D9CE] rounded-xl text-[#18221D]"
              >
                {MYANMAR_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="pest-symptom-input"
              className="block text-xs font-medium text-[#2C3A30]"
            >
              တွေ့ရှိရသော လက္ခဏာ
            </label>
            <textarea
              id="pest-symptom-input"
              rows={3}
              value={symptomQuestion}
              onChange={(e) => setSymptomQuestion(e.target.value)}
              placeholder="ဥပမာ - ပြောင်းဖူးခေါင်ထဲမှာ လွှစာမှုန့်လို ပိုးချေးတွေနဲ့ အရွက်ပေါက်နေပါတယ်..."
              className="w-full p-3.5 text-sm bg-[#FAF9F6] border border-[#D4D9CE] rounded-xl text-[#18221D] placeholder:text-[#78857B] focus:outline-none focus:ring-2 focus:ring-[#15623E]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="submit"
              disabled={isAsking}
              className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#15623E] hover:bg-[#114F32] text-white text-sm font-semibold flex items-center gap-2 transition-colors disabled:opacity-60"
            >
              {isAsking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>အကြံပြုချက် ရှာဖွေနေသည်...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" aria-hidden="true" />
                  <span>အကြံဉာဏ် မေးမြန်းမည်</span>
                </>
              )}
            </button>
          </div>
        </form>

        {askError && (
          <div
            role="alert"
            className="rounded-xl border border-red-300 bg-red-50 p-3.5 text-sm text-red-900"
          >
            {askError}
          </div>
        )}

        {adviceResult && (
          <div className="rounded-2xl border border-[#D4D9CE] bg-[#FAF9F6] p-5 space-y-3">
            <h3 className="text-base font-bold text-[#15623E]">
              ဖြစ်နိုင်ခြေ — {adviceResult.likelyIssueMm}
            </h3>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-[#2C3A30]">
                ချက်ချင်းလုပ်ဆောင်သင့်သည့် အချက်များ
              </p>
              <ul className="space-y-1.5">
                {adviceResult.immediateActionsMm.map((act, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#2C3A30]">
                    <CheckCircle2
                      className="w-4 h-4 text-[#15623E] shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-sm text-[#2C3A30]">
              <span className="font-semibold">သဘာဝနည်းဖြင့် ကာကွယ်ခြင်း — </span>
              {adviceResult.organicControlMm}
            </div>
            <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-3">
              {adviceResult.safetyNoteMm}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
