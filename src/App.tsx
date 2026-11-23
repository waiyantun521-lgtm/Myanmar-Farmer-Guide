import { useState } from "react";
import { Bug, Calculator, Camera, Leaf, Sprout } from "lucide-react";
import { CropGuideView } from "./components/CropGuideView";
import { FertilizerCalculatorView } from "./components/FertilizerCalculatorView";
import { OrganicFertilizerView } from "./components/OrganicFertilizerView";
import { PestGuideView, type PestSectionMode } from "./components/PestGuideView";
import { OfflineIndicator, PWAInstallBanner } from "./components/PWAInstallBanner";
import { SoilAnalyzerView } from "./components/SoilAnalyzerView";
import type {
  AppTab,
  CropKey,
  CruciferPestCropScope,
  SeasonFilter,
  SimpleSoilKey,
  SoilFilter,
} from "./types/farm";

const NAV_ITEMS: {
  id: AppTab;
  desktopLabelMm: string;
  mobileLabelMm: string;
  icon: typeof Camera;
}[] = [
  {
    id: "soil",
    desktopLabelMm: "မြေစစ်ဆေး",
    mobileLabelMm: "မြေစစ်ဆေး",
    icon: Camera,
  },
  {
    id: "crops",
    desktopLabelMm: "သီးနှံရွေးချယ်",
    mobileLabelMm: "သီးနှံများ",
    icon: Leaf,
  },
  {
    id: "organic",
    desktopLabelMm: "သဘာဝမြေဩဇာ",
    mobileLabelMm: "သဘာဝမြေ",
    icon: Sprout,
  },
  {
    id: "calculator",
    desktopLabelMm: "မြေဩဇာတွက်စက်",
    mobileLabelMm: "တွက်စက်",
    icon: Calculator,
  },
  {
    id: "pests",
    desktopLabelMm: "ပိုးမွှားကာကွယ်ရေး",
    mobileLabelMm: "ပိုးမွှား",
    icon: Bug,
  },
];

function mapSeasonLabelToFilter(seasonLabel: string): SeasonFilter {
  if (seasonLabel.includes("မိုး")) return "monsoon";
  if (seasonLabel.includes("ဆောင်း")) return "winter";
  if (seasonLabel.includes("နွေ")) return "summer";
  return "all";
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("soil");
  const [calculatorSoilType, setCalculatorSoilType] =
    useState<SimpleSoilKey>("loam");
  const [calculatorCrop, setCalculatorCrop] = useState<CropKey>("rice");

  const [cropFilterRegion, setCropFilterRegion] = useState<string>("all");
  const [cropFilterSeason, setCropFilterSeason] = useState<SeasonFilter>("all");
  const [cropFilterSoil, setCropFilterSoil] = useState<SoilFilter>("all");
  const [pestSection, setPestSection] = useState<PestSectionMode>("all_crops");
  const [selectedPestCropId, setSelectedPestCropId] = useState<string | undefined>(
    undefined
  );
  const [cruciferPestScope, setCruciferPestScope] =
    useState<CruciferPestCropScope>("all");

  const handleSelectTab = (tab: AppTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplySoilToCalculator = (soil: SimpleSoilKey) => {
    setCalculatorSoilType(soil);
    handleSelectTab("calculator");
  };

  const handleExploreCropsFromSoil = (
    region: string,
    season: string,
    soil: SimpleSoilKey
  ) => {
    setCropFilterRegion(region);
    setCropFilterSeason(mapSeasonLabelToFilter(season));
    setCropFilterSoil(soil);
    handleSelectTab("crops");
  };

  const handleCalculateCropFertilizer = (
    cropKey: CropKey,
    soilKey: SimpleSoilKey
  ) => {
    setCalculatorCrop(cropKey);
    setCalculatorSoilType(soilKey);
    handleSelectTab("calculator");
  };

  const handleOpenCruciferPests = (scope: "cabbage" | "cauliflower") => {
    setPestSection("crucifer");
    setCruciferPestScope(scope);
    handleSelectTab("pests");
  };

  const handleOpenCropPests = (cropId: string) => {
    setPestSection("all_crops");
    setSelectedPestCropId(cropId);
    handleSelectTab("pests");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#18221D]">
      {/* Desktop 3-Zone Top Bar & Mobile Compact Header */}
      <header className="bg-white border-b border-[#E2E5DC] md:sticky md:top-0 md:z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Single-line Brand Title */}
          <button
            type="button"
            onClick={() => handleSelectTab("soil")}
            className="text-lg sm:text-xl font-bold tracking-tight text-[#15623E] whitespace-nowrap shrink-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#15623E] rounded-md px-1"
          >
            မြေယာမိတ်ဆွေ
          </button>

          {/* Zone 2: Desktop Single-Line Text Nav Links (5 items) */}
          <nav
            aria-label="အဓိက လမ်းညွှန်"
            className="hidden md:flex items-center gap-5"
          >
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`py-2 text-sm font-medium whitespace-nowrap shrink-0 border-b-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#15623E] ${
                    active
                      ? "border-[#15623E] text-[#15623E] font-semibold"
                      : "border-transparent text-[#445248] hover:text-[#18221D] hover:border-[#CFD6C8]"
                  }`}
                >
                  {item.desktopLabelMm}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => handleSelectTab("soil")}
              className="min-h-[40px] px-4 py-2 rounded-xl bg-[#15623E] hover:bg-[#114F32] text-white text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-colors"
            >
              မြေဓာတ်ပုံ စစ်ဆေးမည်
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 md:pb-12">
        <OfflineIndicator />
        <PWAInstallBanner />
        {activeTab === "soil" && (
          <SoilAnalyzerView
            onApplySoilToCalculator={handleApplySoilToCalculator}
            onExploreCrops={handleExploreCropsFromSoil}
          />
        )}
        {activeTab === "crops" && (
          <CropGuideView
            initialRegion={cropFilterRegion}
            initialSeason={cropFilterSeason}
            initialSoil={cropFilterSoil}
            onCalculateCropFertilizer={handleCalculateCropFertilizer}
            onOpenCruciferPests={handleOpenCruciferPests}
            onOpenCropPests={handleOpenCropPests}
          />
        )}
        {activeTab === "organic" && <OrganicFertilizerView />}
        {activeTab === "calculator" && (
          <FertilizerCalculatorView
            soilType={calculatorSoilType}
            onSoilTypeChange={setCalculatorSoilType}
            selectedCrop={calculatorCrop}
            onSelectedCropChange={setCalculatorCrop}
          />
        )}
        {activeTab === "pests" && (
          <PestGuideView
            initialSection={pestSection}
            initialCropId={selectedPestCropId}
            initialCruciferScope={cruciferPestScope}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="hidden md:block border-t border-[#E2E5DC] bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-[#546358]">
          <span>မြေယာမိတ်ဆွေ (Myanma Farm Friend) · မြန်မာ့စိုက်ပျိုးရေး အထောက်အကူပြု</span>
          <span>
            သတိပြုရန် — ဓာတ်ပုံတစ်ပုံတည်းဖြင့် pH၊ NPK နှင့် ဆားဓာတ်ကို အတိအကျ မတိုင်းတာနိုင်ပါ။
          </span>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Thumb-Zone Navigation (5 tabs, height 64px <= 15% mobile viewport) */}
      <nav
        aria-label="မိုဘိုင်း လမ်းညွှန်ဘား"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E5DC] pb-safe"
      >
        <div className="grid grid-cols-5 h-16 items-center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`h-full min-h-[44px] flex flex-col items-center justify-center gap-1 px-0.5 transition-colors ${
                  active ? "text-[#15623E] font-semibold" : "text-[#546358]"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${active ? "stroke-[2.25]" : "stroke-[1.75]"}`}
                  aria-hidden="true"
                />
                <span className="text-[10px] leading-none whitespace-nowrap truncate max-w-full">
                  {item.mobileLabelMm}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
