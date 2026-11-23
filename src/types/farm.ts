export type AppTab = "soil" | "crops" | "organic" | "calculator" | "pests";

export type SoilCategory =
  | "sandy"
  | "clay"
  | "loam"
  | "sandy_loam"
  | "clay_loam"
  | "silty"
  | "unknown";

export interface CropRecommendation {
  cropNameMm: string;
  suitabilityReasonMm: string;
  plantingCareMm: string;
}

export type ConfidenceLevel = "high" | "medium" | "low" | "insufficient";

export interface SoilLikelihoodItem {
  typeKey: "sandy" | "clay" | "silty" | "loam";
  typeNameMm: string;
  likelihoodPercent: number;
  likelihoodLabelMm: string;
  reasonMm: string;
}

export interface SoilAnalysisResult {
  isPhotoClearEnough: boolean;
  confidenceLevel: ConfidenceLevel;
  confidenceLabelMm: string;
  confidenceReasonMm: string;
  retakeRequestMm: string;
  soilCategory: SoilCategory;
  soilTypeMm: string;
  confidenceNoteMm: string;
  soilLikelihoods: SoilLikelihoodItem[];
  possibleReasonsMm: string;
  visualObservationsMm: string;
  waterAndDrainageMm: string;
  handTestGuidanceMm: string;
  jarTestGuidanceMm: string;
  soilImprovementTipsMm: string[];
  recommendedCrops: CropRecommendation[];
  photoLimitationReminderMm: string;
}

export interface OrganicRecipe {
  id: string;
  titleMm: string;
  subtitleMm: string;
  durationMm: string;
  yieldMm: string;
  imageUrl: string;
  imageAltMm: string;
  ingredients: {
    nameMm: string;
    amountBase: number;
    unitMm: string;
  }[];
  stepsMm: {
    stepNumber: string;
    titleMm: string;
    detailMm: string;
  }[];
  applicationRateMm: string;
  cautionMm: string;
}

export type CropKey =
  | "rice"
  | "pulses"
  | "sesame"
  | "groundnut"
  | "maize"
  | "sunflower"
  | "cotton"
  | "black_gram"
  | "green_gram"
  | "chickpea"
  | "chili"
  | "tomato"
  | "eggplant"
  | "onion"
  | "garlic"
  | "banana"
  | "papaya"
  | "mango"
  | "orange";

export type SimpleSoilKey = "sandy" | "loam" | "clay";

export interface CropFertilizerProfile {
  key: CropKey;
  nameMm: string;
  shortDescMm: string;
  basePerAcreKg: {
    urea: number;
    tSuper: number;
    potash: number;
    compostCarts: number;
  };
  scheduleMm: {
    stageMm: string;
    timingMm: string;
    ratioNoteMm: string;
  }[];
}

export type CropCategoryFilter =
  | "all"
  | "cereal_industrial"
  | "oilseed_pulse"
  | "vegetable_tuber"
  | "fruit_plantation";
export type SeasonFilter = "all" | "monsoon" | "winter" | "summer";
export type SoilFilter = "all" | SimpleSoilKey;

export interface CropGuideProfile {
  id: string;
  calculatorKey?: CropKey;
  nameMm: string;
  englishName: string;
  category: Exclude<CropCategoryFilter, "all">;
  categoryLabelMm: string;
  suitableSoilKeys: SimpleSoilKey[];
  suitableSoilMm: string;
  soilPhMm: string;
  seasonKeys: Exclude<SeasonFilter, "all">[];
  recommendedSeasonMm: string;
  suitableRegions: string[];
  suitableRegionsMm: string;
  seedSelectionMm: string;
  nurseryTransplantingMm?: string;
  plantSpacingMm?: string;
  plantingMethodMm: string;
  irrigationMethodMm?: string;
  organicFertilizerMm: string;
  oneAcreFertilizerMm: string;
  careToHarvestMm?: string;
  pestDiseaseControlMm: string;
  harvestTimeMm: string;
  verificationCautionMm: string;
  hasCruciferPestSection?: boolean;
}

export type PestCropFilter = "all" | "rice" | "pulses" | "sesame" | "groundnut";

export interface PestDiseaseEntry {
  id: string;
  cropKey: Exclude<PestCropFilter, "all">;
  cropNameMm: string;
  categoryMm: "ရောဂါ" | "ပိုးမွှား";
  nameMm: string;
  englishName: string;
  severityMm: "သတိထားရန်" | "အထူးသတိပြုရန်";
  symptomsMm: string;
  preventionMm: string[];
  organicControlMm: string;
  safeIpmNoteMm: string;
}

export type CruciferPestCropScope = "all" | "cabbage" | "cauliflower";

export interface CruciferPestEntry {
  id: string;
  nameMm: string;
  englishName: string;
  scientificName: string;
  severityMm: "သတိထားရန်" | "အထူးသတိပြုရန်";
  imageUrl: string;
  imageAltMm: string;
  cabbageRelevanceMm: string;
  cauliflowerRelevanceMm: string;
  symptomsMm: string;
  causesMm: string;
  preventionMm: string[];
  naturalControlMm: string;
  chemicalGuidanceMm: string;
}

export interface ChemicalPesticideGuide {
  activeIngredientInfoMm: string;
  groupAndModeMm: string;
  targetPestControlMm: string;
  cropAuthorizationStatusMm: string;
  labelDosageAndMethodMm: string;
  sprayTimingAndPrecautionMm: string;
  phiWarningMm: string;
  ppeRequiredMm: string;
  moaRotationMm: string;
}

export interface CropPestGuideItem {
  id: string;
  cropId: string;
  cropNameMm: string;
  nameMm: string;
  englishName: string;
  scientificName: string;
  severityMm: "သတိထားရန်" | "အထူးသတိပြုရန်";
  imageUrl: string;
  imageAltMm: string;
  affectedPartsMm: string;
  symptomsMm: string;
  preventionMm: string[];
  naturalControlMm: string;
  bioPesticideMm: string;
  chemicalGuide: ChemicalPesticideGuide;
}

export interface PestAdviceResult {
  likelyIssueMm: string;
  immediateActionsMm: string[];
  organicControlMm: string;
  safetyNoteMm: string;
}

export type WeatherAlertSeverity = "high" | "moderate" | "normal";
export type WeatherAlertKind = "flood" | "drought" | "heat" | "wind" | "normal";

export interface WeatherDayForecast {
  dateIso: string;
  dayLabelMm: string;
  weatherCode: number;
  conditionMm: string;
  tempMaxC: number;
  tempMinC: number;
  precipitationMm: number;
  precipitationProbPercent: number;
  windMaxKmh: number;
  evapotranspirationMm: number;
}

export interface WeatherAlertItem {
  kind: WeatherAlertKind;
  severity: WeatherAlertSeverity;
  severityLabelMm: string;
  titleMm: string;
  summaryMm: string;
  farmActionsMm: string[];
}

export interface RegionWeatherForecastResponse {
  region: string;
  stationLabelMm: string;
  fetchedAtIso: string;
  current: {
    temperatureC: number;
    humidityPercent: number;
    windKmh: number;
    precipitationMm: number;
    conditionMm: string;
  };
  days: WeatherDayForecast[];
  alerts: WeatherAlertItem[];
  summaryStats: {
    totalRain3DayMm: number;
    maxTemp3DayC: number;
    minTemp3DayC: number;
    maxWind3DayKmh: number;
  };
}
