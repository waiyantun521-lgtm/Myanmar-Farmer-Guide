import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bug,
  Calculator,
  CalendarClock,
  ChevronRight,
  Compass,
  Droplets,
  FlaskConical,
  Layers,
  Leaf,
  MapPin,
  Ruler,
  Search,
  Sprout,
  Sun,
} from "lucide-react";
import { FORTY_CROPS_CATALOG } from "../data/cropsCatalog";
import { MYANMAR_REGIONS } from "../data/farmData";
import type {
  CropCategoryFilter,
  CropGuideProfile,
  CropKey,
  SeasonFilter,
  SimpleSoilKey,
  SoilFilter,
} from "../types/farm";

interface CropGuideViewProps {
  initialRegion?: string;
  initialSeason?: SeasonFilter;
  initialSoil?: SoilFilter;
  onCalculateCropFertilizer: (cropKey: CropKey, soilKey: SimpleSoilKey) => void;
  onOpenCruciferPests?: (scope: "cabbage" | "cauliflower") => void;
  onOpenCropPests?: (cropId: string) => void;
}

const CATEGORY_TABS: { key: CropCategoryFilter; labelMm: string }[] = [
  { key: "all", labelMm: "အားလုံး (၄၂ မျိုး)" },
  { key: "cereal_industrial", labelMm: "နှံစားနှင့် စက်မှုသီးနှံ" },
  { key: "oilseed_pulse", labelMm: "ဆီထွက်နှင့် ပဲမျိုးစုံ" },
  { key: "vegetable_tuber", labelMm: "ဟင်းသီးဟင်းရွက်နှင့် ဥ/အသီးအနှံ" },
  { key: "fruit_plantation", labelMm: "သစ်သီးဝလံနှင့် နှစ်ရှည်ပင်" },
];

export function CropGuideView({
  initialRegion = "all",
  initialSeason = "all",
  initialSoil = "all",
  onCalculateCropFertilizer,
  onOpenCruciferPests,
  onOpenCropPests,
}: CropGuideViewProps) {
  const [regionFilter, setRegionFilter] = useState<string>(initialRegion);
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>(initialSeason);
  const [soilFilter, setSoilFilter] = useState<SoilFilter>(initialSoil);
  const [categoryFilter, setCategoryFilter] = useState<CropCategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedCropId, setSelectedCropId] = useState<string>(
    FORTY_CROPS_CATALOG[0].id
  );
  const [mobileShowDetail, setMobileShowDetail] = useState<boolean>(false);

  useEffect(() => {
    if (initialRegion) setRegionFilter(initialRegion);
  }, [initialRegion]);

  useEffect(() => {
    if (initialSeason) setSeasonFilter(initialSeason);
  }, [initialSeason]);

  useEffect(() => {
    if (initialSoil) setSoilFilter(initialSoil);
  }, [initialSoil]);

  const filteredCrops = FORTY_CROPS_CATALOG.filter((crop) => {
    const matchesRegion =
      regionFilter === "all" || crop.suitableRegions.includes(regionFilter);
    const matchesSeason =
      seasonFilter === "all" || crop.seasonKeys.includes(seasonFilter);
    const matchesSoil =
      soilFilter === "all" || crop.suitableSoilKeys.includes(soilFilter);
    const matchesCategory =
      categoryFilter === "all" || crop.category === categoryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      crop.nameMm.toLowerCase().includes(q) ||
      crop.englishName.toLowerCase().includes(q) ||
      crop.categoryLabelMm.toLowerCase().includes(q) ||
      crop.suitableRegionsMm.toLowerCase().includes(q) ||
      crop.suitableSoilMm.toLowerCase().includes(q) ||
      crop.recommendedSeasonMm.toLowerCase().includes(q);

    return (
      matchesRegion &&
      matchesSeason &&
      matchesSoil &&
      matchesCategory &&
      matchesSearch
    );
  });

  const activeCrop: CropGuideProfile | null =
    filteredCrops.find((c) => c.id === selectedCropId) ??
    filteredCrops[0] ??
    null;

  const handleSelectCrop = (crop: CropGuideProfile) => {
    setSelectedCropId(crop.id);
    setMobileShowDetail(true);
  };

  const resetFilters = () => {
    setRegionFilter("all");
    setSeasonFilter("all");
    setSoilFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");
  };

  const defaultSoilForCrop = (crop: CropGuideProfile): SimpleSoilKey => {
    if (soilFilter !== "all" && crop.suitableSoilKeys.includes(soilFilter)) {
      return soilFilter;
    }
    return crop.suitableSoilKeys[0] ?? "loam";
  };

  return (
    <div className="space-y-6">
      {/* Header & Smart Selector (Region + Season + Soil Type) */}
      <section className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="space-y-1.5">
          <div className="text-xs sm:text-sm text-[#546358] flex flex-wrap items-center gap-2">
            <span>မြန်မာ့စိုက်ပျိုးရေး သီးနှံ ၄၂ မျိုး လမ်းညွှန်</span>
            <span aria-hidden="true">·</span>
            <span>သီးနှံအုပ်စု၊ ဒေသ၊ ရာသီနှင့် မြေအမျိုးအစားအလိုက် ရှာဖွေစနစ်</span>
          </div>
          <h1 className="text-2xl font-bold text-[#18221D]">
            သီးနှံရွေးချယ်စနစ်နှင့် စိုက်ပျိုးရေးလမ်းညွှန်
          </h1>
          <p className="text-sm text-[#445248] leading-relaxed">
            မြန်မာနိုင်ငံတွင် စိုက်ပျိုးနိုင်သော သီးနှံ ၄၂ မျိုး (ဂေါ်ဖီထုပ်နှင့် ပန်းဂေါ်ဖီ အပါအဝင်) ကို အုပ်စုအလိုက် စစ်ထုတ်ခြင်း၊
            အမည်ဖြင့် ရှာဖွေခြင်းနှင့် ဒေသ/ရာသီ/မြေအမျိုးအစားအလိုက် ရွေးချယ်၍ စိုက်ပျိုးနည်းအပြည့်အစုံ ကြည့်ရှုနိုင်ပါသည်။
          </p>
        </div>

        {/* Verification & Accuracy Warning */}
        <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 flex items-start gap-3">
          <AlertTriangle
            className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
            <span className="font-semibold text-amber-900">အရေးကြီးသတိပေးချက် — </span>
            ဖော်ပြထားသော မြေ pH နှင့် ဓာတ်မြေဩဇာလိုအပ်ချက်များသည် ယေဘုယျသီးနှံလက္ခဏာ လမ်းညွှန်ချက်သာ ဖြစ်ပါသည်။
            အတည်ပြုမြေဆီလွှာ ဓာတ်ခွဲစစ်ဆေးချက် မရှိဘဲ တစ်ဧက ဓာတ်မြေဩဇာပမာဏ အတိအကျကို မခန့်မှန်းသင့်ပါ —
            စိုက်ခင်းမြေအစစ်ကို စစ်ဆေးပြီး နီးစပ်ရာ စိုက်ပျိုးရေးဦးစီးဌာနနှင့် တိုက်ဆိုင်အတည်ပြုသုံးစွဲပါ။
          </p>
        </div>

        {/* 3-Factor Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-[#2C3A30] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#15623E]" aria-hidden="true" />
              ဒေသ (တိုင်း/ပြည်နယ်)
            </span>
            <select
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                setMobileShowDetail(false);
              }}
              className="w-full min-h-[44px] px-3 py-2 text-sm bg-[#FAF9F6] border border-[#D4D9CE] rounded-xl text-[#18221D] focus:outline-none focus:ring-2 focus:ring-[#15623E]"
            >
              <option value="all">ဒေသအားလုံး</option>
              {MYANMAR_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-[#2C3A30] flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-[#15623E]" aria-hidden="true" />
              စိုက်ပျိုးရာသီ
            </span>
            <select
              value={seasonFilter}
              onChange={(e) => {
                setSeasonFilter(e.target.value as SeasonFilter);
                setMobileShowDetail(false);
              }}
              className="w-full min-h-[44px] px-3 py-2 text-sm bg-[#FAF9F6] border border-[#D4D9CE] rounded-xl text-[#18221D] focus:outline-none focus:ring-2 focus:ring-[#15623E]"
            >
              <option value="all">ရာသီအားလုံး</option>
              <option value="monsoon">မိုးရာသီ</option>
              <option value="winter">ဆောင်းရာသီ</option>
              <option value="summer">နွေရာသီ</option>
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-[#2C3A30] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#15623E]" aria-hidden="true" />
              မြေအမျိုးအစား
            </span>
            <select
              value={soilFilter}
              onChange={(e) => {
                setSoilFilter(e.target.value as SoilFilter);
                setMobileShowDetail(false);
              }}
              className="w-full min-h-[44px] px-3 py-2 text-sm bg-[#FAF9F6] border border-[#D4D9CE] rounded-xl text-[#18221D] focus:outline-none focus:ring-2 focus:ring-[#15623E]"
            >
              <option value="all">မြေအမျိုးအစား အားလုံး</option>
              <option value="loam">နုန်းမြေ / Loam Soil</option>
              <option value="sandy">သဲမြေ / သဲနုန်းမြေ</option>
              <option value="clay">ရွှံ့မြေ / ရွှံ့နုန်းမြေ</option>
            </select>
          </label>
        </div>

        {/* Crop Group Tabs & Search */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1 p-1 bg-[#F3F5F0] rounded-xl overflow-x-auto">
            {CATEGORY_TABS.map((tab) => {
              const active = categoryFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setCategoryFilter(tab.key);
                    setMobileShowDetail(false);
                  }}
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

          <div className="relative xl:w-72 shrink-0">
            <Search
              className="w-4 h-4 text-[#546358] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="သီးနှံအမည် / ဒေသ ရှာရန်..."
              aria-label="သီးနှံအမည် ရှာဖွေရန်"
              className="w-full min-h-[44px] pl-10 pr-3.5 py-2 text-sm bg-[#FAF9F6] border border-[#D4D9CE] rounded-xl text-[#18221D] placeholder:text-[#78857B] focus:outline-none focus:ring-2 focus:ring-[#15623E]"
            />
          </div>
        </div>
      </section>

      {/* Results Area: Master-Detail on Desktop, List-to-Detail on Mobile */}
      {filteredCrops.length === 0 ? (
        <div className="bg-white border border-[#E2E5DC] rounded-2xl p-8 text-center space-y-3">
          <p className="text-base font-semibold text-[#18221D]">
            ရွေးချယ်ထားသော အုပ်စု၊ ဒေသ၊ ရာသီနှင့် မြေအမျိုးအစားအတွက် ကိုက်ညီသော သီးနှံမတွေ့ရှိပါ
          </p>
          <p className="text-sm text-[#546358]">
            စစ်ထုတ်မှုများကို ပြန်လည်ပြင်ဆင်၍ ကြည့်ရှုနိုင်ပါသည်။
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-[#15623E] text-white text-sm font-medium"
          >
            စစ်ထုတ်မှုအားလုံး ပြန်ဖွင့်မည်
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Crop List Column */}
          <section
            className={`lg:col-span-5 bg-white border border-[#E2E5DC] rounded-2xl overflow-hidden ${
              mobileShowDetail ? "hidden lg:block" : "block"
            }`}
          >
            <div className="px-5 py-3.5 border-b border-[#ECEFE7] flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-[#18221D]">
                ကိုက်ညီသော သီးနှံများ ({filteredCrops.length} မျိုး)
              </h2>
              {(regionFilter !== "all" ||
                seasonFilter !== "all" ||
                soilFilter !== "all" ||
                categoryFilter !== "all" ||
                searchQuery.trim() !== "") && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="min-h-[36px] px-2 text-xs font-medium text-[#15623E] hover:underline whitespace-nowrap"
                >
                  အားလုံးပြန်ပြမည်
                </button>
              )}
            </div>

            <div className="divide-y divide-[#ECEFE7] lg:max-h-[820px] lg:overflow-y-auto">
              {filteredCrops.map((crop) => {
                const isSelected = activeCrop?.id === crop.id;
                return (
                  <button
                    key={crop.id}
                    type="button"
                    onClick={() => handleSelectCrop(crop)}
                    className={`w-full min-h-[68px] px-5 py-4 text-left flex items-center justify-between gap-3 transition-colors ${
                      isSelected
                        ? "bg-[#EEF2EA]/75"
                        : "bg-white hover:bg-[#FAF9F6]"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#546358]">
                        <span className="font-medium text-[#15623E]">
                          {crop.categoryLabelMm}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{crop.englishName}</span>
                      </div>
                      <p className="text-base font-bold text-[#18221D] truncate">
                        {crop.nameMm}
                      </p>
                      <p className="text-xs text-[#546358] line-clamp-1">
                        {crop.recommendedSeasonMm}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 shrink-0 ${
                        isSelected ? "text-[#15623E]" : "text-[#78857B]"
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>
          </section>

          {/* Crop Detail Panel (All Required Agronomic Sections + pH Suitability) */}
          {activeCrop && (
            <section
              className={`lg:col-span-7 space-y-5 ${
                mobileShowDetail ? "block" : "hidden lg:block"
              }`}
            >
              {/* Mobile Back Button */}
              <div className="lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileShowDetail(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-[#D4D9CE] text-sm font-medium text-[#18221D] inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>သီးနှံစာရင်းသို့ ပြန်သွားမည်</span>
                </button>
              </div>

              <article className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-5">
                {/* Title & Optional Calculator Action */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#ECEFE7] pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#546358]">
                      <span className="font-semibold text-[#15623E]">
                        {activeCrop.categoryLabelMm}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{activeCrop.englishName}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#18221D]">
                      {activeCrop.nameMm}
                    </h2>
                  </div>

                  {activeCrop.calculatorKey ? (
                    <button
                      type="button"
                      onClick={() =>
                        onCalculateCropFertilizer(
                          activeCrop.calculatorKey!,
                          defaultSoilForCrop(activeCrop)
                        )
                      }
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-[#15623E] hover:bg-[#114F32] text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
                    >
                      <Calculator className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>မြေဩဇာတွက်စက်တွင် တွက်မည်</span>
                      <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </button>
                  ) : (
                    <span className="text-xs text-[#546358] bg-[#F3F5F0] px-3 py-2 rounded-xl">
                      မြေဓာတ်ခွဲစစ်ဆေးပြီးမှ မြေဩဇာပမာဏ အတည်ပြုပါ
                    </span>
                  )}
                </div>

                {/* Structured Agronomic Sections */}
                <div className="space-y-4">
                  {/* 1, 2, 3, 4: Soil, pH, Season, Regions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] space-y-1">
                      <p className="text-xs font-bold text-[#15623E] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        ၁။ သင့်တော်သော မြေအမျိုးအစား
                      </p>
                      <p className="text-xs sm:text-sm text-[#2C3A30] leading-relaxed">
                        {activeCrop.suitableSoilMm}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] space-y-1">
                      <p className="text-xs font-bold text-[#15623E] flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        ၂။ မြေ pH သင့်တော်မှု
                      </p>
                      <p className="text-xs sm:text-sm text-[#2C3A30] leading-relaxed">
                        {activeCrop.soilPhMm}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] space-y-1">
                      <p className="text-xs font-bold text-[#15623E] flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        ၃။ စိုက်ပျိုးသင့်သော ရာသီ
                      </p>
                      <p className="text-xs sm:text-sm text-[#2C3A30] leading-relaxed">
                        {activeCrop.recommendedSeasonMm}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] space-y-1">
                      <p className="text-xs font-bold text-[#15623E] flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        ၄။ သင့်တော်သော ဒေသများ
                      </p>
                      <p className="text-xs sm:text-sm text-[#2C3A30] leading-relaxed">
                        {activeCrop.suitableRegionsMm}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Agronomic Blocks */}
                  <div className="divide-y divide-[#ECEFE7]">
                    <div className="py-3.5 space-y-1">
                      <h3 className="text-sm font-bold text-[#18221D] flex items-center gap-1.5">
                        <Sprout className="w-4 h-4 text-[#15623E]" aria-hidden="true" />
                        <span>၅။ မျိုးစေ့ / ပျိုးပင် ရွေးချယ်နည်း</span>
                      </h3>
                      <p className="text-sm text-[#35443A] leading-relaxed">
                        {activeCrop.seedSelectionMm}
                      </p>
                    </div>

                    {activeCrop.nurseryTransplantingMm && (
                      <div className="py-3.5 space-y-1.5">
                        <h3 className="text-sm font-bold text-[#18221D]">
                          မျိုးစေ့ချနည်း၊ ပျိုးထောင်နည်းနှင့် ပြောင်းရွှေ့စိုက်နည်း
                        </h3>
                        <p className="text-sm text-[#35443A] leading-relaxed whitespace-pre-line">
                          {activeCrop.nurseryTransplantingMm}
                        </p>
                      </div>
                    )}

                    {activeCrop.plantSpacingMm && (
                      <div className="py-3.5 space-y-1">
                        <h3 className="text-sm font-bold text-[#18221D] flex items-center gap-1.5">
                          <Ruler className="w-4 h-4 text-[#15623E]" aria-hidden="true" />
                          <span>အပင်ကြား၊ တန်းကြားအကွာအဝေး</span>
                        </h3>
                        <p className="text-sm text-[#35443A] leading-relaxed">
                          {activeCrop.plantSpacingMm}
                        </p>
                      </div>
                    )}

                    <div className="py-3.5 space-y-1">
                      <h3 className="text-sm font-bold text-[#18221D]">
                        ၆။ မျိုးစေ့ချနည်းနှင့် စိုက်ပျိုးအကွာအဝေး
                      </h3>
                      <p className="text-sm text-[#35443A] leading-relaxed">
                        {activeCrop.plantingMethodMm}
                      </p>
                    </div>

                    {activeCrop.irrigationMethodMm && (
                      <div className="py-3.5 space-y-1">
                        <h3 className="text-sm font-bold text-[#18221D] flex items-center gap-1.5">
                          <Droplets className="w-4 h-4 text-[#15623E]" aria-hidden="true" />
                          <span>ရေသွင်းနည်းစနစ်</span>
                        </h3>
                        <p className="text-sm text-[#35443A] leading-relaxed">
                          {activeCrop.irrigationMethodMm}
                        </p>
                      </div>
                    )}

                    <div className="py-3.5 space-y-1">
                      <h3 className="text-sm font-bold text-[#18221D] flex items-center gap-1.5">
                        <Leaf className="w-4 h-4 text-[#15623E]" aria-hidden="true" />
                        <span>၇။ သဘာဝမြေဩဇာနှင့် အသုံးပြုပုံ</span>
                      </h3>
                      <p className="text-sm text-[#35443A] leading-relaxed">
                        {activeCrop.organicFertilizerMm}
                      </p>
                    </div>

                    <div className="py-3.5 space-y-1.5">
                      <h3 className="text-sm font-bold text-[#18221D] flex items-center gap-1.5">
                        <Calculator className="w-4 h-4 text-[#15623E]" aria-hidden="true" />
                        <span>၈။ တစ်ဧကအတွက် မြေဩဇာလိုအပ်ချက် (အာဟာရလမ်းညွှန်)</span>
                      </h3>
                      <p className="text-sm text-[#35443A] leading-relaxed">
                        {activeCrop.oneAcreFertilizerMm}
                      </p>
                    </div>

                    {activeCrop.careToHarvestMm && (
                      <div className="py-3.5 space-y-1">
                        <h3 className="text-sm font-bold text-[#18221D]">
                          စိုက်ပျိုးချိန်မှ ရိတ်သိမ်းချိန်အထိ ပြုစုနည်း
                        </h3>
                        <p className="text-sm text-[#35443A] leading-relaxed">
                          {activeCrop.careToHarvestMm}
                        </p>
                      </div>
                    )}

                    <div className="py-3.5 space-y-2">
                      <h3 className="text-sm font-bold text-[#18221D] flex items-center gap-1.5">
                        <Bug className="w-4 h-4 text-[#15623E]" aria-hidden="true" />
                        <span>၉။ ရောဂါနှင့် ပိုးမွှားကာကွယ်နည်း</span>
                      </h3>
                      <p className="text-sm text-[#35443A] leading-relaxed">
                        {activeCrop.pestDiseaseControlMm}
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        {onOpenCropPests && (
                          <button
                            type="button"
                            onClick={() => onOpenCropPests(activeCrop.id)}
                            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#15623E] hover:bg-[#114F32] text-white text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                          >
                            <Bug className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span>ဤသီးနှံ၏ ပိုးမွှားနှင့် ပိုးသတ်ဆေးလမ်းညွှန် ကြည့်မည်</span>
                            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                          </button>
                        )}
                        {activeCrop.hasCruciferPestSection && onOpenCruciferPests && (
                          <button
                            type="button"
                            onClick={() =>
                              onOpenCruciferPests(
                                activeCrop.id === "cauliflower" ? "cauliflower" : "cabbage"
                              )
                            }
                            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#F3F5F0] hover:bg-[#E5EAE0] text-[#15623E] text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap"
                          >
                            <span>ဂေါ်ဖီ/ပန်းဂေါ်ဖီ ပိုးမွှား ၆ မျိုး သီးခြားကဏ္ဍ</span>
                            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="py-3.5 last:pb-1 space-y-1">
                      <h3 className="text-sm font-bold text-[#18221D] flex items-center gap-1.5">
                        <CalendarClock className="w-4 h-4 text-[#15623E]" aria-hidden="true" />
                        <span>၁၀။ ရိတ်သိမ်းချိန်</span>
                      </h3>
                      <p className="text-sm text-[#35443A] leading-relaxed">
                        {activeCrop.harvestTimeMm}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Crop-Specific Verification Caution */}
                <div className="rounded-xl border border-amber-300 bg-amber-50/85 p-4 flex items-start gap-3">
                  <AlertTriangle
                    className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div className="text-xs sm:text-sm text-amber-950 leading-relaxed space-y-1">
                    <p className="font-semibold text-amber-900">
                      အတည်ပြုစစ်ဆေးရန် သတိပေးချက်
                    </p>
                    <p>{activeCrop.verificationCautionMm}</p>
                  </div>
                </div>
              </article>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
