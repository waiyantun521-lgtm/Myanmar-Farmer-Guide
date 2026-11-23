import { FORTY_CROPS_CATALOG } from "./cropsCatalog";
import { PEST_ARCHETYPES } from "./pestArchetypes";
import type { CropPestGuideItem } from "../types/farm";

interface CropPestSeed {
  archetypeKey: keyof typeof PEST_ARCHETYPES;
  slug: string;
  nameMm?: string;
  englishName?: string;
  scientificName?: string;
  severityMm?: "သတိထားရန်" | "အထူးသတိပြုရန်";
  imageUrl?: string;
  imageAltMm?: string;
  affectedPartsMm: string;
  symptomsMm: string;
  preventionMm?: string[];
  naturalControlMm?: string;
  bioPesticideMm?: string;
  activeIngredientInfoMm?: string;
  targetPestControlMm?: string;
  sprayTimingAndPrecautionMm?: string;
}

const CROP_NAME_LOOKUP: Record<string, string> = Object.fromEntries(
  FORTY_CROPS_CATALOG.map((c) => [c.id, c.nameMm])
);

function cleanCropLabel(nameMm: string): string {
  return nameMm.replace(/^[၀-၉0-9]+။\s*/, "").trim();
}

function makeCropPest(cropId: string, seed: CropPestSeed): CropPestGuideItem {
  const arch = PEST_ARCHETYPES[seed.archetypeKey];
  const rawCropName = CROP_NAME_LOOKUP[cropId] ?? cropId;
  const cropShort = cleanCropLabel(rawCropName);
  const pestTitle = seed.nameMm ?? arch.nameMm;

  return {
    id: `${cropId}-${seed.slug}`,
    cropId,
    cropNameMm: rawCropName,
    nameMm: pestTitle,
    englishName: seed.englishName ?? arch.englishName,
    scientificName: seed.scientificName ?? arch.scientificName,
    severityMm: seed.severityMm ?? arch.severityMm,
    imageUrl: seed.imageUrl ?? arch.imageUrl,
    imageAltMm: seed.imageAltMm ?? `${cropShort} — ${arch.imageAltMm}`,
    affectedPartsMm: seed.affectedPartsMm,
    symptomsMm: seed.symptomsMm,
    preventionMm: seed.preventionMm ?? arch.defaultPreventionMm,
    naturalControlMm: seed.naturalControlMm ?? arch.naturalControlMm,
    bioPesticideMm: seed.bioPesticideMm ?? arch.bioPesticideMm,
    chemicalGuide: {
      activeIngredientInfoMm:
        seed.activeIngredientInfoMm ?? arch.chemicalBase.activeIngredientInfoMm,
      groupAndModeMm: arch.chemicalBase.groupAndModeMm,
      targetPestControlMm:
        seed.targetPestControlMm ?? arch.chemicalBase.targetPestControlMm,
      cropAuthorizationStatusMm: `အွန်လိုင်း/တိုက်ရိုက် မြန်မာနိုင်ငံ ပိုးသတ်ဆေးမှတ်ပုံတင်အဖွဲ့ (PRB) ဒေတာဘေ့စ်ဖြင့် မစစ်ဆေးနိုင်သဖြင့် မသေချာသေးပါ — ဆေးဝယ်ယူအသုံးမပြုမီ ဆေးဘူးတံဆိပ်ပေါ်တွင် [${cropShort}] နှင့် [${pestTitle}] အတွက် တရားဝင် မှတ်ပုံတင်ခွင့်ပြုချက် ပါ/မပါ မဖြစ်မနေ ကိုယ်တိုင်စစ်ဆေးအတည်ပြုပါ။`,
      labelDosageAndMethodMm: arch.chemicalBase.labelDosageAndMethodMm,
      sprayTimingAndPrecautionMm:
        seed.sprayTimingAndPrecautionMm ?? arch.chemicalBase.sprayTimingAndPrecautionMm,
      phiWarningMm: `တိကျသော PHI ရက်အရေအတွက်ကို မခန့်မှန်းပါ — ဝယ်ယူသော မှတ်ပုံတင်ဆေးဘူးတံဆိပ်တွင် ဖော်ပြထားသည့် [${cropShort}] အတွက် ရိတ်သိမ်းမတိုင်မီ စောင့်ဆိုင်းရမည့်ကာလ (PHI) ရက်ပြည့်မှသာ ရိတ်သိမ်းစားသုံး/ရောင်းချပါ။`,
      ppeRequiredMm: arch.chemicalBase.ppeRequiredMm,
      moaRotationMm: arch.chemicalBase.moaRotationMm,
    },
  };
}

const CROP_PEST_SEEDS: Record<string, CropPestSeed[]> = {
  rice: [
    {
      archetypeKey: "stem_borer",
      slug: "rice-stem-borer",
      nameMm: "စပါးဆစ်ပိုး (အဝါရောင်ဆစ်ပိုး / အဖြူရောင်ဆစ်ပိုး)",
      englishName: "Rice Yellow Stem Borer",
      scientificName: "Scirpophaga incertulas",
      affectedPartsMm: "စပါးပင်စည် အူတိုင်နှင့် အနှံထွက်ပင်စည်",
      symptomsMm:
        "ပင်ပွားချိန်တွင် အလယ်အူတိုင်ညှိုးခြောက်၍ အလွယ်တကူဆွဲနုတ်ရသော (Dead heart) လက္ခဏာဖြစ်ပြီး အနှံထွက်ချိန်တွင် စပါးနှံတစ်ခုလုံး ဖြူဆွတ်အဖျင်းဖြစ်သွားသော (White head) လက္ခဏာ တွေ့ရပါသည်။",
    },
    {
      archetypeKey: "planthopper",
      slug: "rice-brown-planthopper",
      nameMm: "စပါးဖြုတ်ညိုပိုးနှင့် ဖြုတ်ကျောဖြူပိုး",
      englishName: "Rice Brown Planthopper (BPH)",
      scientificName: "Nilaparvata lugens",
      affectedPartsMm: "ရေစပ်အထက် စပါးပင်စည်အောက်ခြေ",
      symptomsMm:
        "ပင်ခြေတွင် ပိုးအစုလိုက်စုပ်စားသဖြင့် စပါးပင်များ အဝိုင်းလိုက် ညိုခြောက်လဲကျသွားသည့် ဖြုတ်လောင်ခြင်း (Hopperburn) ဖြစ်ပေါ်ပြီး ဗိုင်းရပ်စ်ရောဂါလည်း ကူးစက်တတ်ပါသည်။",
    },
    {
      archetypeKey: "caterpillar_armyworm",
      slug: "rice-armyworm",
      nameMm: "စပါးငမြှောင်တောင်ပိုးနှင့် ရွက်လိပ်ပိုး",
      englishName: "Rice Armyworm & Leaf Folder",
      scientificName: "Spodoptera mauritia / Cnaphalocrocis medinalis",
      affectedPartsMm: "စပါးပျိုးပင်နှင့် အရွက်စိမ်းများ",
      symptomsMm:
        "ပျိုးခင်းနှင့် စိုက်ခင်းစပါးရွက်များကို ညအချိန် အုပ်စုလိုက် ကိုက်ဖြတ်စားသောက်ခြင်း သို့မဟုတ် အရွက်ကို လိပ်၍ အစိမ်းရောင်အသားခြစ်စားခြင်း တွေ့ရပါသည်။",
    },
  ],
  maize: [
    {
      archetypeKey: "caterpillar_armyworm",
      slug: "maize-fall-armyworm",
      nameMm: "ပြောင်းဖူးစစ်ပိုး (Fall Armyworm)",
      englishName: "Fall Armyworm",
      scientificName: "Spodoptera frugiperda",
      affectedPartsMm: "ပြောင်းခေါင်ဗဟိုအဖူး၊ အရွက်နုနှင့် ပြောင်းဖူးစေ့",
      symptomsMm:
        "ပြောင်းခေါင်ဗဟိုအဖူးထဲသို့ လောက်ကောင်ဝင်စားသဖြင့် အပေါက်တန်းကြီးများနှင့် လွှစာမှုန့်တူ ပိုးချေးများ စုပုံနေပြီး ဖူးအိမ်ထဲထိ ဖောက်ဝင်ဖျက်ဆီးတတ်ပါသည်။",
    },
    {
      archetypeKey: "stem_borer",
      slug: "maize-stem-borer",
      nameMm: "ပြောင်းပင်စည်ထိုးပိုး",
      englishName: "Maize Stem Borer",
      scientificName: "Chilo partellus / Ostrinia furnacalis",
      affectedPartsMm: "ပြောင်းပင်စည် အတွင်းသားနှင့် အရွက်ရိုးတံ",
      symptomsMm:
        "အရွက်နုတွင် အပေါက်စီတန်း (Shot-hole) များဖြစ်ပေါ်ပြီး ပင်စည်အတွင်း ဖောက်ဝင်စားသဖြင့် လေတိုက်ပါက ပင်စည်ကျိုးကျလွယ်ပါသည်။",
    },
    {
      archetypeKey: "aphids",
      slug: "maize-aphids",
      nameMm: "ပြောင်းအနှံပျပိုး",
      englishName: "Corn Leaf Aphid",
      scientificName: "Rhopalosiphum maidis",
      affectedPartsMm: "ပြောင်းဖူးအနှံဖျား (Tassel) နှင့် အပေါ်ရွက်အိမ်",
      symptomsMm:
        "အနှံဖျားနှင့် ရွက်အိမ်ကြားတွင် စိမ်းပြာရောင်ပျပိုးများ စုပြုံစုပ်စား၍ ဝတ်မှုန်ကူးမှု နှောင့်နှေးစေကာ မှိုမဲစွဲစေပါသည်။",
    },
  ],
  wheat: [
    {
      archetypeKey: "aphids",
      slug: "wheat-aphids",
      nameMm: "ဂျုံအနှံပျပိုး",
      englishName: "Wheat Aphids",
      scientificName: "Sitobion avenae / Rhopalosiphum padi",
      affectedPartsMm: "ဂျုံရွက်နုနှင့် နို့ရည်တည်ဂျုံနှံ",
      symptomsMm:
        "ဂျုံနှံစထွက်ချိန်နှင့် နို့ရည်တည်ချိန်တွင် အနှံပေါ်၌ စုဝေးစုပ်စားသဖြင့် အစေ့ပိန်လှီ၍ အထွက်နှုန်း ကျဆင်းစေပါသည်။",
    },
    {
      archetypeKey: "cutworm",
      slug: "wheat-cutworm",
      nameMm: "ဂျုံပင်ခြေဖြတ်ပိုးနှင့် ခြပိုး",
      englishName: "Wheat Cutworm",
      scientificName: "Agrotis spp.",
      affectedPartsMm: "ပင်ပေါက်ငယ် ပင်စည်အခြေနှင့် အမြစ်",
      symptomsMm:
        "စိုက်ပြီး ၂-၃ ပတ်အတွင်း ဂျုံပင်ငယ်များ မြေစပ်မှ ပြတ်ကျညှိုးသေ၍ စိုက်တန်းကွက်လပ်များ ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "caterpillar_armyworm",
      slug: "wheat-armyworm",
      nameMm: "ဂျုံရွက်စားစစ်ပိုး",
      englishName: "Wheat Armyworm",
      scientificName: "Mythimna separata",
      affectedPartsMm: "ဂျုံအရွက်နှင့် အနှံရိုးတံ",
      symptomsMm:
        "ရင့်မှည့်ခါနီး ဂျုံခင်းတွင် ညအချိန်၌ အရွက်နှင့် အနှံရိုးတံများကို ကိုက်ဖြတ်ချပစ်တတ်ပါသည်။",
    },
  ],
  sunflower: [
    {
      archetypeKey: "pod_borer",
      slug: "sunflower-head-borer",
      nameMm: "နေကြာပွင့်ခေါင်းဖောက်ပိုး",
      englishName: "Sunflower Head Borer",
      scientificName: "Helicoverpa armigera",
      affectedPartsMm: "နေကြာပွင့်ဖူး၊ ပွင့်ခေါင်းနှင့် နို့ရည်တည်အစေ့",
      symptomsMm:
        "နေကြာပွင့်ခေါင်းအတွင်း လောက်ကောင်များ ဝင်ရောက်စားသောက်၍ ပွင့်ခေါင်းပုပ်ရိခြင်းနှင့် အစေ့အဆန် ပျက်စီးခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "caterpillar_armyworm",
      slug: "sunflower-hairy-caterpillar",
      nameMm: "နေကြာရွက်စားခူကောင် (ခူမွေးစုတ်)",
      englishName: "Sunflower Hairy Caterpillar",
      scientificName: "Spilarctia obliqua / Spodoptera litura",
      affectedPartsMm: "နေကြာအရွက်မျက်နှာပြင်",
      symptomsMm:
        "ကောင်ပေါက်လေးများ အရွက်အောက်တွင် စုပေါင်းစား၍ အရွက်ဇကာပေါက်ဖြစ်စေပြီး ကြီးလာပါက အရွက်တစ်ရွက်လုံး ကိုက်စားပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "sunflower-whitefly-jassid",
      nameMm: "နေကြာယင်ဖြူနှင့် ဖြုတ်စိမ်း",
      englishName: "Sunflower Whitefly & Jassid",
      scientificName: "Bemisia tabaci / Amrasca biguttula",
      affectedPartsMm: "နေကြာအရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "အရွက်အောက်မှ ပင်ရည်စုပ်စားသဖြင့် အရွက်နှုတ်ခမ်းများ အပေါ်/အောက် တွန့်လိမ်ဝါလာကာ နေကြာခေါင်းသေးငယ်သွားပါသည်။",
    },
  ],
  cotton: [
    {
      archetypeKey: "pod_borer",
      slug: "cotton-bollworm",
      nameMm: "ဝါသီးလုံးဖောက်ပိုး (အမေရိကန်/ပန်းရောင်သီးလုံးဖောက်ပိုး)",
      englishName: "Cotton Bollworm",
      scientificName: "Helicoverpa armigera / Pectinophora gossypiella",
      affectedPartsMm: "ဝါဖူး၊ ပန်းပွင့်နှင့် ဝါသီးအတွင်းသား",
      symptomsMm:
        "ဝါဖူးနှင့် အသီးများတွင် အပေါက်ဝိုင်းဖောက်စား၍ ဝါဖူးကြွေကျခြင်းနှင့် ဝါသီးအတွင်း ဝါဂွမ်းအရည်အသွေး ပျက်စီးခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "planthopper",
      slug: "cotton-jassid",
      nameMm: "ဝါဖြုတ်စိမ်းပိုး (Jassid)",
      englishName: "Cotton Jassid / Leafhopper",
      scientificName: "Amrasca biguttula biguttula",
      affectedPartsMm: "ဝါရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "အရွက်အနားသတ်များ ဝါရာမှ နီညိုရောင်ပြောင်း၍ အောက်သို့ ခွက်ဝင်တွန့်လိမ်သွားသည့် Hopperburn လက္ခဏာ ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "cotton-whitefly",
      nameMm: "ဝါယင်ဖြူနှင့် လှေးပိုး",
      englishName: "Cotton Whitefly & Thrips",
      scientificName: "Bemisia tabaci / Thrips tabaci",
      affectedPartsMm: "ဝါရွက်အောက်ဘက်နှင့် အညွန့်နု",
      symptomsMm:
        "အရွက်တွန့်ကာ ဗိုင်းရပ်စ်ကူးစက်ခြင်းနှင့် အချိုရည်ကြောင့် ဝါဂွမ်းပေါ်တွင် မှိုမဲစွဲ၍ ဂွမ်းအရောင်ညစ်စေပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "cotton-mealybug",
      nameMm: "ဝါဂွမ်းပိုး (Mealybug)",
      englishName: "Cotton Mealybug",
      scientificName: "Phenacoccus solenopsis",
      affectedPartsMm: "ဝါပင်စည်ဖျား၊ အညွန့်နှင့် ဝါသီးအခြေ",
      symptomsMm:
        "အညွန့်နှင့် ဝါသီးကြားတွင် ဂွမ်းစတူ အဖြူရောင်ပိုးအစုများ ဖုံးအုပ်စုပ်စား၍ အပင်ပုကျုံ့ကာ သေဆုံးတတ်ပါသည်။",
    },
  ],
  sugarcane: [
    {
      archetypeKey: "stem_borer",
      slug: "sugarcane-borer",
      nameMm: "ကြံပင်စည်ထိုးပိုး (အညွန့်/အဆစ်ထိုးပိုး)",
      englishName: "Sugarcane Shoot & Internode Borer",
      scientificName: "Chilo infuscatellus / Chilo sacchariphagus",
      affectedPartsMm: "ကြံအညွန့်နုနှင့် ကြံချောင်းအဆစ်အတွင်းသား",
      symptomsMm:
        "ကြံပင်ငယ်စဉ် ဗဟိုအညွန့်ခြောက်သေ (Dead heart) ဖြစ်ပြီး ကြံချောင်းကြီးချိန်တွင် အဆစ်အတွင်း အပေါက်ဖောက်စား၍ သကြားဓာတ် ကျဆင်းစေပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "sugarcane-mealybug",
      nameMm: "ကြံဆစ်ဂွမ်းပိုး (Mealybug) နှင့် အကြေးပိုး",
      englishName: "Sugarcane Pink Mealybug & Scale",
      scientificName: "Saccharicoccus sacchari",
      affectedPartsMm: "ကြံရွက်ဖတ်အောက်ရှိ ကြံဆစ်ပတ်လည်",
      symptomsMm:
        "ရွက်ဖတ်အောက် ကြံဆစ်တွင် ပန်းရောင်ဂွမ်းပိုးများ စုဝေးစုပ်စား၍ ကြံရည်ချိုနှုန်း ကျဆင်းကာ ပုရွက်ဆိတ်များ ဝိုင်းအုံနေတတ်ပါသည်။",
    },
    {
      archetypeKey: "planthopper",
      slug: "sugarcane-pyrilla",
      nameMm: "ကြံရွက်စုပ်ပိုး (Pyrilla) နှင့် ယင်ဖြူ",
      englishName: "Sugarcane Leafhopper (Pyrilla)",
      scientificName: "Pyrilla perpusilla",
      affectedPartsMm: "ကြံရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "ကြံရွက်မှ အရည်စုပ်စားသဖြင့် အရွက်ဝါခြောက်ပြီး အချိုရည်ပေါ် မှိုမဲစွဲ၍ အစာချက်လုပ်မှု လျော့နည်းစေပါသည်။",
    },
  ],
  groundnut: [
    {
      archetypeKey: "caterpillar_armyworm",
      slug: "groundnut-leafminer-caterpillar",
      nameMm: "မြေပဲရွက်စားခူကောင်နှင့် ရွက်ထွင်းပိုး",
      englishName: "Groundnut Leaf Miner & Tobacco Caterpillar",
      scientificName: "Aproaerema modicella / Spodoptera litura",
      affectedPartsMm: "မြေပဲအရွက်စိမ်းနှင့် အညွန့်",
      symptomsMm:
        "အရွက်တွင်း ထွင်းစား၍ မီးလောင်သကဲ့သို့ အညိုကွက်ဖြစ်ခြင်း သို့မဟုတ် စစ်ပိုးက အရွက်များကို ဇကာပေါက် ကိုက်စားခြင်း တွေ့ရပါသည်။",
    },
    {
      archetypeKey: "aphids",
      slug: "groundnut-aphids",
      nameMm: "မြေပဲပျပိုး",
      englishName: "Groundnut Aphid",
      scientificName: "Aphis craccivora",
      affectedPartsMm: "မြေပဲအညွန့်နု၊ ပန်းရိုးတံနှင့် ဆင်းတောင့်အဖျား",
      symptomsMm:
        "အမည်းရောင်ပျပိုးများ အညွန့်နုတွင် စုဝေးစုပ်စား၍ အပင်ပုကျုံ့စေပြီး Rosette ဗိုင်းရပ်စ် ကူးစက်တတ်ပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "groundnut-thrips",
      nameMm: "မြေပဲလှေးပိုး",
      englishName: "Groundnut Thrips",
      scientificName: "Scirtothrips dorsalis / Frankliniella schultzei",
      affectedPartsMm: "မြေပဲအရွက်နုအတွင်းသားနှင့် ပန်းပွင့်",
      symptomsMm:
        "အရွက်နုမျက်နှာပြင်တွင် ငွေရောင်အစင်းကွက်များဖြစ်၍ အရွက်တွန့်ကာ Bud necrosis ဗိုင်းရပ်စ် သယ်ဆောင်တတ်ပါသည်။",
    },
    {
      archetypeKey: "cutworm",
      slug: "groundnut-white-grub-cutworm",
      nameMm: "မြေပဲမြေအောင်းပိုး (ငါးမျှားချိတ်ပိုး / ပင်ခြေဖြတ်ပိုး)",
      englishName: "White Grub & Cutworm",
      scientificName: "Holotrichia / Agrotis spp.",
      affectedPartsMm: "မြေတွင်းရှိ မြေပဲအမြစ်နှင့် မြေပဲတောင့်",
      symptomsMm:
        "မြေတွင်း၌ အမြစ်နှင့် မြေပဲတောင့်နုများကို ကိုက်ဖြတ်စားသဖြင့် အပင်တစ်ပင်ချင်း ညှိုးသေခြင်း တွေ့ရပါသည်။",
    },
  ],
  sesame: [
    {
      archetypeKey: "pod_borer",
      slug: "sesame-leaf-webber-capsule-borer",
      nameMm: "နှမ်းရွက်လိပ်နှင့် သီးတောင့်ဖောက်ပိုး",
      englishName: "Sesame Leaf Webber & Capsule Borer",
      scientificName: "Antigastra catalaunalis",
      affectedPartsMm: "နှမ်းအညွန့်ထိပ်ဖျား၊ အပွင့်နှင့် နှမ်းသီးတောင့်",
      symptomsMm:
        "ထိပ်ဖျားအရွက်နုများကို ပိုးချည်မျှင်ဖြင့် ရစ်ပတ်လိပ်စားပြီး နှမ်းတောင့်ထဲ ဖောက်ဝင်၍ အစေ့များ စားသောက်ဖျက်ဆီးပါသည်။",
    },
    {
      archetypeKey: "planthopper",
      slug: "sesame-jassid",
      nameMm: "နှမ်းဖြုတ်စိမ်းပိုး (Phyllody သယ်ဆောင်ပိုး)",
      englishName: "Sesame Leafhopper / Jassid",
      scientificName: "Orosius albicinctus",
      affectedPartsMm: "နှမ်းအရွက်နှင့် အညွန့်နု",
      symptomsMm:
        "အရွက်မှ ပင်ရည်စုပ်စားရုံသာမက နှမ်းပန်းစိမ်းရောဂါ (Sesame Phyllody) ဖြစ်စေသော Phytoplasma ပိုးကို ကူးစက်စေပါသည်။",
    },
    {
      archetypeKey: "caterpillar_armyworm",
      slug: "sesame-hawk-moth-caterpillar",
      nameMm: "နှမ်းခူကောင်ကြီး (ချိုပါခူကောင်)",
      englishName: "Sesame Hawk Moth Caterpillar",
      scientificName: "Acherontia styx",
      affectedPartsMm: "နှမ်းအရွက်စိမ်းများ",
      symptomsMm:
        "အမြီးပိုင်းတွင် ချိုပါသော အစိမ်းရောင်ခူကောင်ကြီးများသည် နှမ်းရွက်များကို အလျင်အမြန် ကိုက်ဖြတ်စားသောက်ကြပါသည်။",
    },
  ],
  black_gram: [
    {
      archetypeKey: "pod_borer",
      slug: "black-gram-pod-borer",
      nameMm: "မတ်ပဲသီးလုံးဖောက်ပိုး",
      englishName: "Black Gram Pod Borer",
      scientificName: "Helicoverpa armigera / Maruca vitrata",
      affectedPartsMm: "မတ်ပဲပန်းပွင့်နှင့် ပဲတောင့်နု",
      symptomsMm:
        "ပန်းပွင့်နှင့် အတောင့်နုများကို ချည်မျှင်ဖြင့် ပူးကပ်စားသောက်ခြင်း သို့မဟုတ် အတောင့်တွင် အပေါက်ဝိုင်းဖောက်၍ ပဲစေ့စားခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "black-gram-whitefly-ymv",
      nameMm: "မတ်ပဲယင်ဖြူ (အဝါရောင်မိုစေ့ဗိုင်းရပ်စ် သယ်ဆောင်ပိုး)",
      englishName: "Whitefly (YMV Vector)",
      scientificName: "Bemisia tabaci",
      affectedPartsMm: "မတ်ပဲအရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "အရွက်အောက်မှ စုပ်စား၍ အရွက်ဝါအကွက်ဖြစ်စေသော Yellow Mosaic Virus (YMV) ကို လျင်မြန်စွာ ကူးစက်ပျံ့နှံ့စေပါသည်။",
    },
    {
      archetypeKey: "stem_borer",
      slug: "black-gram-bean-stem-fly",
      nameMm: "မတ်ပဲပင်စည်ထိုးယင်",
      englishName: "Bean Stem Fly",
      scientificName: "Ophiomyia phaseoli",
      affectedPartsMm: "ပဲပင်ငယ် ပင်စည်အောက်ခြေနှင့် ရွက်ရိုးတံ",
      symptomsMm:
        "ပင်ပေါက် ၂-၃ ပတ်သားတွင် ပင်စည်အခြေဖောင်းကွဲ၍ အပင်ဝါညှိုးသေဆုံးတတ်ပါသည်။",
    },
  ],
  green_gram: [
    {
      archetypeKey: "pod_borer",
      slug: "green-gram-maruca-pod-borer",
      nameMm: "ပဲတီစိမ်းပွင့်ထွင်းနှင့် အတောင့်ဖောက်ပိုး",
      englishName: "Spotted Pod Borer (Maruca)",
      scientificName: "Maruca vitrata",
      affectedPartsMm: "ပန်းပွင့်အစု၊ အဖူးနှင့် ပဲတီစိမ်းတောင့်",
      symptomsMm:
        "ပန်းပွင့်နှင့် အတောင့်များကို ပိုးချည်မျှင်ဖြင့် စုစည်းကပ်၍ အတောင့်အတွင်း ဖောက်ဝင်စားသောက်ပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "green-gram-thrips-whitefly",
      nameMm: "ပဲတီစိမ်းလှေးပိုးနှင့် ယင်ဖြူ",
      englishName: "Thrips & Whitefly",
      scientificName: "Megalurothrips distalis / Bemisia tabaci",
      affectedPartsMm: "ပဲပွင့်အတွင်းသားနှင့် အရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "လှေးပိုးကြောင့် ပန်းပွင့်များ အသီးမတင်ဘဲ ကြွေကျခြင်းနှင့် ယင်ဖြူကြောင့် အဝါရောင်မိုစေ့ဗိုင်းရပ်စ် (YMV) ဖြစ်ပေါ်ခြင်း တွေ့ရပါသည်။",
    },
    {
      archetypeKey: "aphids",
      slug: "green-gram-aphids",
      nameMm: "ပဲတီစိမ်းပျပိုး",
      englishName: "Cowpea / Mungbean Aphid",
      scientificName: "Aphis craccivora",
      affectedPartsMm: "အညွန့်နုနှင့် ပဲတောင့်ရိုးတံ",
      symptomsMm:
        "အညွန့်နုနှင့် အတောင့်နုပေါ် အနက်ရောင်ပျပိုးအစုများ ကပ်စုပ်၍ အရွက်တွန့်ပုကျုံ့စေပါသည်။",
    },
  ],
  pigeon_pea: [
    {
      archetypeKey: "pod_borer",
      slug: "pigeon-pea-pod-borer",
      nameMm: "ပဲစင်းငုံသီးလုံးဖောက်ပိုးနှင့် အတောင့်ထိုးယင်",
      englishName: "Gram Pod Borer & Pod Fly",
      scientificName: "Helicoverpa armigera / Melanagromyza obtusa",
      affectedPartsMm: "ပဲစင်းငုံပန်းပွင့်၊ အတောင့်ခွံနှင့် အစေ့",
      symptomsMm:
        "လောက်ကောင်ကြီးက အတောင့်အပြင်မှ ဖောက်စားခြင်းနှင့် အတောင့်ထိုးယင်က အတောင့်အတွင်း ပဲစေ့ပိန်ပုပ်စေခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "pigeon-pea-sterility-mite",
      nameMm: "ပဲစင်းငုံမြုံရောဂါသယ်ဆောင်မွှား (Eriophyid Mite)",
      englishName: "Pigeon Pea Sterility Mite",
      scientificName: "Aceria cajani",
      affectedPartsMm: "ပဲစင်းငုံအရွက်နုအောက်ဘက်",
      symptomsMm:
        "မျက်စိဖြင့် မမြင်သာသော မွှားပိုးကြောင့် အရွက်သေးငယ်ဖျော့တော့၍ အပွင့်အသီး လုံးဝမတင်သော Sterility Mosaic ဖြစ်ပေါ်စေပါသည်။",
    },
    {
      archetypeKey: "leaf_beetle_weevil",
      slug: "pigeon-pea-blister-beetle",
      nameMm: "ပဲစင်းငုံပွင့်စားကျိုင်း (Blister Beetle)",
      englishName: "Blister Beetle",
      scientificName: "Mylabris pustulata",
      affectedPartsMm: "ပဲစင်းငုံပန်းပွင့်နှင့် အဖူး",
      symptomsMm:
        "အနီ/အဝါနှင့် အနက်စင်းပါ ကျိုင်းကောင်ကြီးများသည် ပဲစင်းငုံပန်းပွင့်များကို တိုက်ရိုက်ကိုက်စား ဖျက်ဆီးကြပါသည်။",
    },
  ],
  chickpea: [
    {
      archetypeKey: "pod_borer",
      slug: "chickpea-pod-borer",
      nameMm: "ကုလားပဲသီးလုံးဖောက်ပိုး",
      englishName: "Chickpea Pod Borer",
      scientificName: "Helicoverpa armigera",
      affectedPartsMm: "ကုလားပဲအရွက်နု၊ ပန်းပွင့်နှင့် ကုလားပဲသီးတောင့်",
      symptomsMm:
        "အရွက်စားပြီးနောက် ပဲသီးတောင့်ထဲသို့ ဦးခေါင်းတစ်ဝက်သွင်း၍ အစေ့များကို အကုန်စားသောက်ပစ်ပါသည်။",
    },
    {
      archetypeKey: "cutworm",
      slug: "chickpea-cutworm",
      nameMm: "ကုလားပဲပင်စည်ဖြတ်ပိုး",
      englishName: "Chickpea Cutworm",
      scientificName: "Agrotis ipsilon",
      affectedPartsMm: "မြေစပ်ပင်စည်အခြေ",
      symptomsMm:
        "ဆောင်းစိုက်ကုလားပဲခင်းတွင် ညအချိန် မြေပေါ်တက်၍ အပင်ငယ်များကို မြေစပ်မှ ကိုက်ဖြတ်ချပစ်ပါသည်။",
    },
    {
      archetypeKey: "aphids",
      slug: "chickpea-aphids",
      nameMm: "ကုလားပဲပျပိုး",
      englishName: "Chickpea Aphid",
      scientificName: "Aphis craccivora",
      affectedPartsMm: "အညွန့်နုနှင့် ပန်းရိုးတံ",
      symptomsMm:
        "အညွန့်နုတွင် စုဝေးစုပ်စား၍ အရွက်ဝါတွန့်ကာ Stunt ဗိုင်းရပ်စ် ကူးစက်တတ်ပါသည်။",
    },
  ],
  soybean: [
    {
      archetypeKey: "stem_borer",
      slug: "soybean-stem-fly",
      nameMm: "ပဲပုပ်ပင်စည်ထိုးယင်နှင့် ခါးထိုးပိုး",
      englishName: "Soybean Stem Fly & Girdle Beetle",
      scientificName: "Melanagromyza sojae / Obereopsis brevis",
      affectedPartsMm: "ပဲပုပ်ပင်စည်အတွင်းအူတိုင်နှင့် ရွက်ရိုးတံ",
      symptomsMm:
        "ပင်စည်အတွင်း အနီ/အညိုရောင်လမ်းကြောင်းဖောက်စား၍ အပေါ်ပိုင်းအညွန့် ညှိုးသေကျိုးကျတတ်ပါသည်။",
    },
    {
      archetypeKey: "caterpillar_armyworm",
      slug: "soybean-caterpillar",
      nameMm: "ပဲပုပ်ရွက်စားခူကောင်နှင့် စစ်ပိုး",
      englishName: "Soybean Leaf-eating Caterpillar",
      scientificName: "Spodoptera litura / Chrysodeixis chalcites",
      affectedPartsMm: "ပဲပုပ်အရွက်နှင့် အတောင့်နု",
      symptomsMm:
        "အရွက်ကြောများသာ ကျန်အောင် စားသောက်၍ အစေ့တည်ချိန်၌ အသီးအတောင့်တင်မှု လျော့နည်းစေပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "soybean-whitefly",
      nameMm: "ပဲပုပ်ယင်ဖြူနှင့် စုပ်စားပိုး",
      englishName: "Soybean Whitefly",
      scientificName: "Bemisia tabaci",
      affectedPartsMm: "အရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "အရွက်မှ အရည်စုပ်စား၍ မိုစေ့ဗိုင်းရပ်စ်ကူးစက်ခြင်းနှင့် မှိုမဲစွဲခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
  ],
  cowpea: [
    {
      archetypeKey: "aphids",
      slug: "cowpea-aphids",
      nameMm: "ပဲလွန်းပျပိုး",
      englishName: "Cowpea Aphid",
      scientificName: "Aphis craccivora",
      affectedPartsMm: "ပဲလွန်းအညွန့်နု၊ ပန်းခိုင်နှင့် ပဲတောင့်",
      symptomsMm:
        "အနက်ရောင်ပျပိုးများ အတောင့်နှင့် အညွန့်ပေါ် ဖုံးအုပ်စုပ်စား၍ အပင်ကြီးထွားမှု ရပ်တန့်စေပါသည်။",
    },
    {
      archetypeKey: "pod_borer",
      slug: "cowpea-pod-borer",
      nameMm: "ပဲလွန်းအတောင့်ဖောက်ပိုး (Maruca)",
      englishName: "Cowpea Pod Borer",
      scientificName: "Maruca vitrata",
      affectedPartsMm: "ပန်းပွင့်နှင့် ပဲလွန်းတောင့်",
      symptomsMm:
        "အတောင့်များကို ဖောက်စား၍ ပိုးချေးအမှုန်များ အပေါက်ဝတွင် ထွက်နေသည်ကို တွေ့ရပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "cowpea-flower-thrips",
      nameMm: "ပဲလွန်းပွင့်လှေးပိုး",
      englishName: "Cowpea Flower Thrips",
      scientificName: "Megalurothrips sjostedti",
      affectedPartsMm: "ပန်းဖူးနှင့် ပန်းပွင့်အတွင်းသား",
      symptomsMm:
        "ပန်းဖူးများ မပွင့်မီ ညိုခြောက်ကြွေကျ၍ အသီးတောင့်တင်နှုန်း ကျဆင်းစေပါသည်။",
    },
  ],
  chili: [
    {
      archetypeKey: "thrips_whitefly",
      slug: "chili-thrips-whitefly",
      nameMm: "ငရုတ်လှေးပိုးနှင့် ယင်ဖြူ",
      englishName: "Chili Thrips & Whitefly",
      scientificName: "Scirtothrips dorsalis / Bemisia tabaci",
      affectedPartsMm: "ငရုတ်အညွန့်နုနှင့် အရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "လှေးပိုးကြောင့် အရွက်အနားများ အပေါ်သို့ လှေပုံစံလိပ်တက်လာခြင်း (Upward leaf curl) နှင့် ယင်ဖြူကြောင့် ရွက်တွန့်ဗိုင်းရပ်စ် ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "chili-yellow-mite",
      nameMm: "ငရုတ်မွှားပင့်ကူဝါ (Broad / Yellow Mite)",
      englishName: "Chili Yellow / Broad Mite",
      scientificName: "Polyphagotarsonemus latus",
      affectedPartsMm: "ငရုတ်အညွန့်နုအရွက်အောက်ဘက်",
      symptomsMm:
        "အရွက်အောက်ဘက် ပြောင်လက်ကြေးနီရောင်သန်း၍ အရွက်အနားများ အောက်သို့ ကုပ်တွန့်ကျသွားခြင်း (Downward curl / Murda) ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "fruit_fly",
      slug: "chili-fruit-fly-borer",
      nameMm: "ငရုတ်သီးထိုးယင်နှင့် သီးလုံးဖောက်ပိုး",
      englishName: "Chili Fruit Fly & Fruit Borer",
      scientificName: "Bactrocera dorsalis / Spodoptera litura",
      affectedPartsMm: "ငရုတ်သီးစိမ်းနှင့် ငရုတ်သီးမှည့်",
      symptomsMm:
        "ငရုတ်သီးအတွင်း ပိုးလောက်ကောင်ဝင်၍ အသီးပုပ်ရိကြွေကျခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
  ],
  onion: [
    {
      archetypeKey: "thrips_whitefly",
      slug: "onion-thrips",
      nameMm: "ကြက်သွန်နီလှေးပိုး",
      englishName: "Onion Thrips",
      scientificName: "Thrips tabaci",
      affectedPartsMm: "ကြက်သွန်မြိတ်ရွက်အလယ်ခွကြား",
      symptomsMm:
        "ကြက်သွန်ရွက်ပေါ်တွင် ငွေရောင်အဖြူစင်းကွက်များ (Silvery patches) ဖြစ်ပေါ်ပြီး အဖျားခြောက်တွန့်ကာ ကြက်သွန်ဥသေးငယ်သွားစေပါသည်။",
    },
    {
      archetypeKey: "caterpillar_armyworm",
      slug: "onion-armyworm",
      nameMm: "ကြက်သွန်ရွက်စားစစ်ပိုး (Spodoptera)",
      englishName: "Beet Armyworm",
      scientificName: "Spodoptera exigua",
      affectedPartsMm: "ကြက်သွန်မြိတ်ခေါင်းပေါက်အတွင်းပိုင်း",
      symptomsMm:
        "ကြက်သွန်မြိတ်အခေါင်းပေါက်အတွင်း ဝင်ရောက်စားသောက်၍ အရွက်ကျိုးကျခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "cutworm",
      slug: "onion-cutworm-maggot",
      nameMm: "ကြက်သွန်ဥခြေဖြတ်ပိုးနှင့် ဥထိုးလောက်ကောင်",
      englishName: "Onion Cutworm",
      scientificName: "Agrotis spp.",
      affectedPartsMm: "ပျိုးပင်ခြေနှင့် ကြက်သွန်ဥ",
      symptomsMm:
        "ပျိုးပင်ငယ်များ မြေစပ်မှ ပြတ်ကျသေဆုံးခြင်းနှင့် မြေစပ်ဥကို ကိုက်ဖောက်ခြင်း တွေ့ရပါသည်။",
    },
  ],
  garlic: [
    {
      archetypeKey: "thrips_whitefly",
      slug: "garlic-thrips",
      nameMm: "ကြက်သွန်ဖြူလှေးပိုး",
      englishName: "Garlic Thrips",
      scientificName: "Thrips tabaci",
      affectedPartsMm: "ကြက်သွန်ဖြူအရွက်ကြားနှင့် အညွန့်ဖူး",
      symptomsMm:
        "ခြောက်သွေ့ရာသီတွင် အရွက်ကြားခိုအောင်း၍ အစက်အပြောက်ဖြူများ ဖြစ်စေပြီး ဥမွှာဖွံ့ဖြိုးမှု ထိခိုက်စေပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "garlic-dry-bulb-mite",
      nameMm: "ကြက်သွန်ဖြူမွှားပိုး (Eriophyid / Bulb Mite)",
      englishName: "Garlic Dry Bulb Mite",
      scientificName: "Aceria tulipae / Rhizoglyphus spp.",
      affectedPartsMm: "ကြက်သွန်ဖြူအရွက်တွန့်ကြားနှင့် သိုလှောင်ဥမွှာ",
      symptomsMm:
        "အရွက်သစ်များ မဖြန့်ဘဲ လိမ်တွန့်ဝါသွားခြင်းနှင့် သိုလှောင်စဉ် ဥမွှာများ ခြောက်သွေ့ပိန်လှီခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "caterpillar_armyworm",
      slug: "garlic-armyworm",
      nameMm: "ကြက်သွန်ဖြူရွက်စားပိုး",
      englishName: "Armyworm",
      scientificName: "Spodoptera exigua",
      affectedPartsMm: "ကြက်သွန်ဖြူအရွက်",
      symptomsMm:
        "အရွက်စိမ်းများကို ဖောက်စား၍ ကိုက်ဖြတ်ဖျက်ဆီးပါသည်။",
    },
  ],
  tomato: [
    {
      archetypeKey: "pod_borer",
      slug: "tomato-fruit-borer-tuta",
      nameMm: "ခရမ်းချဉ်သီးလုံးဖောက်ပိုးနှင့် ရွက်ထွင်းဖလံ (Tuta absoluta)",
      englishName: "Tomato Fruit Borer & Pinworm",
      scientificName: "Helicoverpa armigera / Tuta absoluta",
      affectedPartsMm: "ခရမ်းချဉ်သီး၊ အရွက်တွင်းသားနှင့် အညွန့်",
      symptomsMm:
        "ခရမ်းချဉ်သီးတွင် အပေါက်ဝိုင်းဖောက်စားခြင်း သို့မဟုတ် Tuta absoluta ကြောင့် အရွက်နှင့် အသီးအတွင်း အကွက်လိုက် ထွင်းစားပုပ်ရိခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "tomato-whitefly",
      nameMm: "ခရမ်းချဉ်ယင်ဖြူ (TYLCV ရွက်တွန့်ဗိုင်းရပ်စ် သယ်ဆောင်ပိုး)",
      englishName: "Tomato Whitefly",
      scientificName: "Bemisia tabaci",
      affectedPartsMm: "အရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "အဝါရောင်ရွက်တွန့်ဗိုင်းရပ်စ် (TYLCV) ကူးစက်၍ အပင်ထိပ်ဖျားအရွက်များ သေးငယ်ဝါတွန့်သွားကာ အသီးမတင်တော့ပါ။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "tomato-red-spider-mite",
      nameMm: "ခရမ်းချဉ်မွှားပင့်ကူနီ",
      englishName: "Red Spider Mite",
      scientificName: "Tetranychus urticae",
      affectedPartsMm: "အရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "အရွက်ပေါ် ဝါညိုအစက်သေးများဖြစ်၍ ပင့်ကူမျှင်ပါးများ ဖုံးအုပ်ကာ အရွက်ခြောက်ကြွေကျပါသည်။",
    },
  ],
  eggplant: [
    {
      archetypeKey: "pod_borer",
      slug: "eggplant-shoot-fruit-borer",
      nameMm: "ခရမ်းညွန့်နှင့် သီးလုံးဖောက်ပိုး",
      englishName: "Brinjal Shoot & Fruit Borer",
      scientificName: "Leucinodes orbonalis",
      affectedPartsMm: "ခရမ်းအညွန့်ဖျားနှင့် ခရမ်းသီးအတွင်းသား",
      symptomsMm:
        "အညွန့်နုများ ညှိုးငိုက်ကျသွားခြင်းနှင့် ခရမ်းသီးအတွင်း ပိုးလောက်ကောင်ဝင်စား၍ ပိုးချေးအပြည့်ဖြစ်နေခြင်း တွေ့ရပါသည်။",
    },
    {
      archetypeKey: "planthopper",
      slug: "eggplant-jassid",
      nameMm: "ခရမ်းဖြုတ်စိမ်းပိုး (Little Leaf သယ်ဆောင်ပိုး)",
      englishName: "Eggplant Leafhopper / Jassid",
      scientificName: "Amrasca biguttula",
      affectedPartsMm: "ခရမ်းရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "အရွက်အနားဝါခြောက်ခြင်းနှင့် Little leaf ရောဂါကူးစက်၍ အရွက်သေးသေးများ အစုလိုက်ထွက်လာခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "eggplant-mites-mealybug",
      nameMm: "ခရမ်းမွှားနီနှင့် ဂွမ်းပိုး",
      englishName: "Spider Mite & Mealybug",
      scientificName: "Tetranychus spp. / Coccidohystrix insolita",
      affectedPartsMm: "အရွက်အောက်နှင့် ပင်စည်ကိုင်းကြား",
      symptomsMm:
        "အရွက်ဝါကြေးနီရောင်ဖြစ်ခြင်းနှင့် ကိုင်းကြားတွင် ဂွမ်းပိုးဖြူများ ဖုံးအုပ်စုပ်စားခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
  ],
  potato: [
    {
      archetypeKey: "pod_borer",
      slug: "potato-tuber-moth",
      nameMm: "အာလူးဥဖောက်ပိုးဖလံ (Potato Tuber Moth)",
      englishName: "Potato Tuber Moth",
      scientificName: "Phthorimaea operculella",
      affectedPartsMm: "အာလူးအရွက်၊ ပင်စည်နှင့် မြေပေါ်/သိုလှောင်အာလူးဥ",
      symptomsMm:
        "အာလူးဥမျက်စိမှ ဖောက်ဝင်၍ ဥအတွင်း အမည်းရောင်ဥမင်လမ်းကြောင်းများနှင့် ပိုးချေးများဖြစ်ကာ ပုပ်ရိစေပါသည်။",
      preventionMm: [
        "အာလူးဥများ မပေါ်စေရန် မြေတောင်မြှောက်၍ မြေဖုံးထူထူဖုံးပေးပါ။",
        "ပိုးကင်းစင်သော မျိုးဥကိုသာ စိုက်ပျိုး၍ ရိတ်သိမ်းပြီးဥများကို ချက်ချင်းဖုံးအုပ်သိမ်းဆည်းပါ။",
        "သိုလှောင်ရုံတွင် ခြင်ထောင်ဇကာကာကွယ်ခြင်းနှင့် ဖယ်ရိုမုန်းထောင်ချောက် ချိတ်ဆွဲပါ။",
      ],
    },
    {
      archetypeKey: "aphids",
      slug: "potato-aphids",
      nameMm: "အာလူးပျပိုး",
      englishName: "Green Peach / Potato Aphid",
      scientificName: "Myzus persicae",
      affectedPartsMm: "အာလူးအရွက်အောက်ဘက်နှင့် အညွန့်",
      symptomsMm:
        "အရွက်လိပ်ဗိုင်းရပ်စ် (PLRV) နှင့် PVY ဗိုင်းရပ်စ်ရောဂါများ ကူးစက်စေသော အဓိကပိုးဖြစ်ပါသည်။",
    },
    {
      archetypeKey: "cutworm",
      slug: "potato-cutworm",
      nameMm: "အာလူးပင်ခြေဖြတ်ပိုးနှင့် ဥကိုက်ပိုး",
      englishName: "Potato Cutworm",
      scientificName: "Agrotis segetum / Agrotis ipsilon",
      affectedPartsMm: "ပင်စည်အခြေနှင့် မြေတွင်းအာလူးဥ",
      symptomsMm:
        "အပင်ငယ် ပင်စည်ကိုက်ဖြတ်ခြင်းနှင့် အာလူးဥတွင် အပေါက်ဝိုင်းကြီးများ ကိုက်ဖောက်စားသောက်ပါသည်။",
    },
  ],
  sweet_potato: [
    {
      archetypeKey: "leaf_beetle_weevil",
      slug: "sweet-potato-weevil",
      nameMm: "ကန်စွန်းဥထိုးကျိုင်း (Sweet Potato Weevil)",
      englishName: "Sweet Potato Weevil",
      scientificName: "Cylas formicarius",
      affectedPartsMm: "ကန်စွန်းနွယ်ပင်စည်အခြေနှင့် ကန်စွန်းဥ",
      symptomsMm:
        "ဥအတွင်း ကျိုင်းလောက်ကောင် ဖောက်ဝင်စားသဖြင့် ဥအနံ့ဆိုးထွက်ကာ ခါးသက်ပြီး စားသုံး၍ မရတော့ပါ။",
      preventionMm: [
        "ကန်စွန်းဥမဟုတ်ဘဲ ရောဂါ/ပိုးကင်းသော ထိပ်ဖျားနွယ်ကိုင်း (30 cm) ကိုသာ ဖြတ်စိုက်ပါ။",
        "မြေအက်ကွဲကြောင်းမှ ကျိုင်းမဝင်နိုင်စေရန် မြေတောင်မြှောက်၍ အစိုဓာတ်ထိန်းပါ။",
        "ဆက်တိုက်မစိုက်ဘဲ စပါး/ပဲမျိုးစုံနှင့် သီးလှည့်စိုက်ပျိုးပါ။",
      ],
    },
    {
      archetypeKey: "caterpillar_armyworm",
      slug: "sweet-potato-caterpillar",
      nameMm: "ကန်စွန်းရွက်စားခူကောင်နှင့် ရွက်လိပ်ပိုး",
      englishName: "Sweet Potato Hornworm & Leaf Folder",
      scientificName: "Agrius convolvuli / Brachmia triannulella",
      affectedPartsMm: "ကန်စွန်းရွက်စိမ်းများ",
      symptomsMm:
        "အရွက်များကို အလျင်အမြန် ကိုက်စားခြင်း သို့မဟုတ် အရွက်ကိုခေါက်လိပ်၍ ခြစ်စားခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "sweet-potato-whitefly",
      nameMm: "ကန်စွန်းယင်ဖြူ",
      englishName: "Sweet Potato Whitefly",
      scientificName: "Bemisia tabaci",
      affectedPartsMm: "ကန်စွန်းရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "အရွက်အောက်မှ စုပ်စား၍ ကန်စွန်းဗိုင်းရပ်စ်ရောဂါ (SPVD) ကူးစက်ပြန့်ပွားစေပါသည်။",
    },
  ],
  cassava: [
    {
      archetypeKey: "mites_mealybug",
      slug: "cassava-mealybug-green-mite",
      nameMm: "ပီလောပီနံဂွမ်းပိုး (Mealybug) နှင့် မွှားစိမ်း",
      englishName: "Cassava Mealybug & Green Mite",
      scientificName: "Phenacoccus manihoti / Mononychellus tanajoa",
      affectedPartsMm: "ပီလောပီနံထိပ်ဖျားအညွန့်နှင့် အရွက်နု",
      symptomsMm:
        "ထိပ်ဖျားအညွန့်များ အစုလိုက်ကျုံ့ခွေ၍ Bunchy top ပုံစံဖြစ်ကာ အမြစ်ဥကြီးထွားမှု ရပ်တန့်စေပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "cassava-whitefly",
      nameMm: "ပီလောပီနံယင်ဖြူ (CMD သယ်ဆောင်ပိုး)",
      englishName: "Cassava Whitefly",
      scientificName: "Bemisia tabaci",
      affectedPartsMm: "ပီလောပီနံအရွက်နုအောက်ဘက်",
      symptomsMm:
        "အရွက်တွန့်အဝါကွက်ဖြစ်စေသော Cassava Mosaic Disease (CMD) ဗိုင်းရပ်စ်ကို ကူးစက်စေပါသည်။",
    },
    {
      archetypeKey: "leaf_beetle_weevil",
      slug: "cassava-scale-beetle",
      nameMm: "ပီလောပီနံအကြေးပိုးနှင့် မြေအောင်းကျိုင်း",
      englishName: "Cassava Scale & White Grub",
      scientificName: "Aonidomytilus albus",
      affectedPartsMm: "မျိုးကိုင်းပင်စည်နှင့် မြေတွင်းအမြစ်",
      symptomsMm:
        "ပင်စည်ပေါ် အဖြူ/မီးခိုးရောင်အကြေးလွှာများ ဖုံးအုပ်စုပ်စား၍ မျိုးကိုင်းခြောက်သေစေပါသည်။",
    },
  ],
  pumpkin: [
    {
      archetypeKey: "fruit_fly",
      slug: "pumpkin-fruit-fly",
      nameMm: "ဖရုံသီးထိုးယင် (Melon Fly)",
      englishName: "Melon Fruit Fly",
      scientificName: "Zeugodacus cucurbitae",
      affectedPartsMm: "ဖရုံသီးနုနှင့် ရင့်စအသီး",
      symptomsMm:
        "သီးထိုးယင်အမက အသီးနုခွံထဲ ဥချ၍ အစေးထွက်ကာ ပိုးလောက်ကောင်ဝင်စားပြီး အသီးပုပ်ကြွေကျပါသည်။",
    },
    {
      archetypeKey: "leaf_beetle_weevil",
      slug: "pumpkin-red-beetle",
      nameMm: "ဖရုံကျိုင်းနီ (Red Pumpkin Beetle)",
      englishName: "Red Pumpkin Beetle",
      scientificName: "Aulacophora foveicollis",
      affectedPartsMm: "ပင်ပေါက်ရွက်နု၊ ပန်းပွင့်နှင့် အမြစ်",
      symptomsMm:
        "လိမ္မော်နီရောင်ကျိုင်းကောင်များက အရွက်နုများကို ဝိုင်းပတ်ကိုက်စား၍ အပင်ငယ်ချိန်တွင် သေဆုံးစေနိုင်ပါသည်။",
    },
    {
      archetypeKey: "aphids",
      slug: "pumpkin-aphids-whitefly",
      nameMm: "ဖရုံပျပိုးနှင့် ယင်ဖြူ",
      englishName: "Melon Aphid & Whitefly",
      scientificName: "Aphis gossypii / Bemisia tabaci",
      affectedPartsMm: "အရွက်အောက်မျက်နှာပြင်နှင့် နွယ်ဖျား",
      symptomsMm:
        "အရွက်အောက်မှ စုပ်စား၍ အရွက်တွန့်ကာ ဖရုံမိုစေ့ဗိုင်းရပ်စ် ကူးစက်တတ်ပါသည်။",
    },
  ],
  cucumber: [
    {
      archetypeKey: "fruit_fly",
      slug: "cucumber-fruit-fly",
      nameMm: "သခွားသီးထိုးယင်",
      englishName: "Cucurbit / Melon Fruit Fly",
      scientificName: "Zeugodacus cucurbitae",
      affectedPartsMm: "သခွားသီးနုနှင့် အဖူး",
      symptomsMm:
        "သခွားသီးကောက်ကွေးပုံပျက်၍ အသီးအတွင်း ပိုးလောက်ကောင်ဝင်ပုပ်ရိစေပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "cucumber-thrips-whitefly",
      nameMm: "သခွားလှေးပိုးနှင့် ယင်ဖြူ",
      englishName: "Melon Thrips & Whitefly",
      scientificName: "Thrips palmi / Bemisia tabaci",
      affectedPartsMm: "သခွားအရွက်အောက်၊ အပွင့်နှင့် အသီးခွံ",
      symptomsMm:
        "သခွားသီးခွံပေါ်တွင် ကြမ်းတမ်းသော အဖြူ/အညိုစင်းရာများဖြစ်ခြင်းနှင့် အရွက်ဝါတွန့်ခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "leaf_beetle_weevil",
      slug: "cucumber-beetle",
      nameMm: "သခွားရွက်စားကျိုင်းနီနှင့် ခူကောင်",
      englishName: "Red Pumpkin Beetle & Cucumber Moth",
      scientificName: "Aulacophora spp. / Diaphania indica",
      affectedPartsMm: "အရွက်နုနှင့် အသီးခွံ",
      symptomsMm:
        "အရွက်အပြင်လွှာကို ဇကာပေါက်ခြစ်စားခြင်းနှင့် အသီးခွံပေါ် ကိုက်ဖောက်စားသောက်ခြင်း တွေ့ရပါသည်။",
    },
  ],
  watermelon: [
    {
      archetypeKey: "thrips_whitefly",
      slug: "watermelon-thrips-whitefly",
      nameMm: "ဖရဲလှေးပိုးနှင့် ယင်ဖြူ",
      englishName: "Watermelon Thrips & Whitefly",
      scientificName: "Thrips palmi / Bemisia tabaci",
      affectedPartsMm: "ဖရဲနွယ်ဖျားအညွန့်၊ ပန်းပွင့်နှင့် အသီးနု",
      symptomsMm:
        "ဖရဲနွယ်ထိပ်ဖျား မထွက်နိုင်ဘဲ တွန့်လိမ်ခြောက်သွားခြင်း (Thrips damage) နှင့် ဗိုင်းရပ်စ်ကူးစက်ခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "aphids",
      slug: "watermelon-aphids",
      nameMm: "ဖရဲပျပိုး (Melon Aphid)",
      englishName: "Melon / Cotton Aphid",
      scientificName: "Aphis gossypii",
      affectedPartsMm: "ဖရဲအရွက်အောက်ဘက်နှင့် နွယ်ဖျား",
      symptomsMm:
        "အရွက်အောက်တွင် စုဝေးစုပ်စား၍ အရွက်ခွက်ဝင်တွန့်လိမ်ကာ မှိုမဲစွဲ၍ ဖရဲသီးအချိုနှုန်း ကျဆင်းစေပါသည်။",
    },
    {
      archetypeKey: "fruit_fly",
      slug: "watermelon-fruit-fly",
      nameMm: "ဖရဲသီးထိုးယင်",
      englishName: "Melon Fruit Fly",
      scientificName: "Zeugodacus cucurbitae",
      affectedPartsMm: "ဖရဲသီးနု",
      symptomsMm:
        "အသီးနုခွံထဲ ဥချ၍ အစေးထွက်ကာ အသီးပုပ်ရိကြွေကျစေပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "watermelon-red-spider-mite",
      nameMm: "ဖရဲမွှားပင့်ကူနီ",
      englishName: "Red Spider Mite",
      scientificName: "Tetranychus urticae",
      affectedPartsMm: "အရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "ခြောက်သွေ့ရာသီတွင် အရွက်ဝါညိုခြောက်၍ နွယ်ခြောက်သေစေပါသည်။",
    },
  ],
  muskmelon: [
    {
      archetypeKey: "fruit_fly",
      slug: "muskmelon-fruit-fly",
      nameMm: "သခွားမွှေးသီးထိုးယင်",
      englishName: "Melon Fruit Fly",
      scientificName: "Zeugodacus cucurbitae",
      affectedPartsMm: "သခွားမွှေးသီးနုနှင့် အသီးမှည့်စ",
      symptomsMm:
        "အသီးမျက်နှာပြင်တွင် ယင်ထိုးအပေါက်ငယ်မှ အစေးထွက်၍ အတွင်းသားပုပ်ရိသွားပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "muskmelon-thrips-whitefly",
      nameMm: "သခွားမွှေးလှေးပိုးနှင့် ယင်ဖြူ",
      englishName: "Thrips & Whitefly",
      scientificName: "Thrips palmi / Bemisia tabaci",
      affectedPartsMm: "နွယ်ဖျားနှင့် အရွက်အောက်ဘက်",
      symptomsMm:
        "နွယ်ဖျားတွန့်ပုခြင်းနှင့် မှိုမဲ/ဗိုင်းရပ်စ်ကူးစက်၍ အသီးအချိုဓာတ် (Brix) ကျဆင်းစေပါသည်။",
    },
    {
      archetypeKey: "aphids",
      slug: "muskmelon-aphids",
      nameMm: "သခွားမွှေးပျပိုး",
      englishName: "Melon Aphid",
      scientificName: "Aphis gossypii",
      affectedPartsMm: "အရွက်အောက်နှင့် အညွန့်",
      symptomsMm:
        "အရွက်တွန့်လိမ်၍ အပင်အားနည်းစေပါသည်။",
    },
  ],
  ginger: [
    {
      archetypeKey: "stem_borer",
      slug: "ginger-shoot-borer",
      nameMm: "ဂျင်းပင်စည်ထိုးပိုး (Shoot Borer)",
      englishName: "Ginger Shoot Borer",
      scientificName: "Conogethes punctiferalis",
      affectedPartsMm: "ဂျင်းပင်စည်အတွင်းအူတိုင်",
      symptomsMm:
        "ဂျင်းပင်စည်အလယ်အူတိုင်ကို ဖောက်စား၍ အလယ်ရွက်ဝါညှိုးသေ (Dead heart) ဖြစ်ကာ ပင်စည်ပေါက်မှ ပိုးချေးထွက်နေတတ်ပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "ginger-rhizome-scale-mealybug",
      nameMm: "ဂျင်းဥအကြေးပိုးနှင့် မွှားပိုး",
      englishName: "Rhizome Scale & Mite",
      scientificName: "Aspidiella hartii",
      affectedPartsMm: "မြေတွင်းနှင့် သိုလှောင်ဂျင်းဥတက်",
      symptomsMm:
        "ဂျင်းတက်မျက်နှာပြင်ပေါ်တွင် အဖြူ/အညိုရောင်အကြေးပြားလေးများ ကပ်၍ ဂျင်းတက်ခြောက်ရှုံ့စေပါသည်။",
    },
    {
      archetypeKey: "cutworm",
      slug: "ginger-rhizome-maggot",
      nameMm: "ဂျင်းဥထိုးယင်လောက်ကောင်နှင့် မြေအောင်းပိုး",
      englishName: "Rhizome Fly / White Grub",
      scientificName: "Mimegralla coeruleifrons / Calobata spp.",
      affectedPartsMm: "မြေတွင်းဂျင်းဥတက်နှင့် ပင်ခြေ",
      symptomsMm:
        "ဥပုပ်ရောဂါဖြစ်နေသော ဂျင်းဥထဲသို့ လောက်ကောင်များ ဝင်ရောက်စားသောက်၍ ပုပ်ရိမှု ပိုမိုဆိုးရွားစေပါသည်။",
    },
  ],
  turmeric: [
    {
      archetypeKey: "stem_borer",
      slug: "turmeric-shoot-borer",
      nameMm: "နနွင်းပင်စည်ထိုးပိုး",
      englishName: "Turmeric Shoot Borer",
      scientificName: "Conogethes punctiferalis",
      affectedPartsMm: "နနွင်းပင်စည်အူတိုင်",
      symptomsMm:
        "နနွင်းပင်စည်အလယ်အူတိုင် ဖောက်စားခံရသဖြင့် အလယ်ရွက်ဝါခြောက်သေ (Dead heart) ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "turmeric-thrips",
      nameMm: "နနွင်းလှေးပိုး",
      englishName: "Turmeric Thrips",
      scientificName: "Panchaetothrips indicus",
      affectedPartsMm: "နနွင်းအရွက်မျက်နှာပြင်",
      symptomsMm:
        "နနွင်းအရွက်များ ငွေဖြူရောင်ပြောင်း၍ အပေါ်သို့ လိပ်တက်ဝါခြောက်သွားစေပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "turmeric-rhizome-scale",
      nameMm: "နနွင်းဥအကြေးပိုး",
      englishName: "Turmeric Rhizome Scale",
      scientificName: "Aspidiella hartii",
      affectedPartsMm: "နနွင်းဥတက်",
      symptomsMm:
        "သိုလှောင်နနွင်းဥနှင့် မြေတွင်းနနွင်းတက်ပေါ် ကပ်စုပ်၍ ဥအစိုဓာတ်ခန်းခြောက် ရှုံ့တွစေပါသည်။",
    },
  ],
  banana: [
    {
      archetypeKey: "leaf_beetle_weevil",
      slug: "banana-rhizome-weevil",
      nameMm: "ငှက်ပျောဥထိုးကျိုင်းနှင့် ပင်စည်ထွင်းကျိုင်း",
      englishName: "Banana Corm / Pseudostem Weevil",
      scientificName: "Cosmopolites sordidus / Odoiporus longicollis",
      affectedPartsMm: "ငှက်ပျောမြေအောက်ဥနှင့် ပင်စည်အဖတ်",
      symptomsMm:
        "မြေအောက်ဥနှင့် ပင်စည်ထဲ ဥမင်လမ်းကြောင်းဖောက်စားသဖြင့် အပင်ဝါ၍ လေတိုက်ပါက အရင်းမှ ပြိုလဲကျတတ်ပါသည်။",
      preventionMm: [
        "ပိုးကင်းစင်သော တစ်ရှူးမျိုးပင် သို့မဟုတ် အခွံသန့်စင်ပြီး ရေနွေးစိမ်သန့်စင်ထားသော သားတက်ကိုသာ စိုက်ပါ။",
        "အသီးခုတ်ပြီးသော ငှက်ပျောပင်စည်ဟောင်းများကို ခုတ်ဖြတ်ရှင်းလင်း၍ ထောင်ချောက်အဖြစ် အသုံးပြုပါ။",
        "ပင်ခြေတွင် ပေါင်းမြက်နှင့် အရွက်ခြောက်များ မပုံထားဘဲ သန့်ရှင်းထားပါ။",
      ],
    },
    {
      archetypeKey: "aphids",
      slug: "banana-aphids",
      nameMm: "ငှက်ပျောပျပိုး (Bunchy Top ဗိုင်းရပ်စ် သယ်ဆောင်ပိုး)",
      englishName: "Banana Aphid",
      scientificName: "Pentalonia nigronervosa",
      affectedPartsMm: "ငှက်ပျောပင်စည်ရွက်ဖတ်ကြားနှင့် သားတက်နု",
      symptomsMm:
        "အမည်းရောင်ပျပိုးကြောင့် ငှက်ပျောထိပ်ဖျားအရွက်များ တိုကျုံ့ထောင်မတ်လာသော Banana Bunchy Top ရောဂါ ကူးစက်စေပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "banana-fruit-rust-thrips",
      nameMm: "ငှက်ပျောသီးခွံလှေးပိုး (Rust / Scarring Beetle)",
      englishName: "Banana Rust Thrips & Scarring Beetle",
      scientificName: "Chaetanaphothrips signipennis / Basilepta subcostatum",
      affectedPartsMm: "ငှက်ပျောဖီးနု အသီးခွံ",
      symptomsMm:
        "ငှက်ပျောသီးခွံပေါ်တွင် နီညိုရောင်သံချေးကွက် သို့မဟုတ် အမာရွတ်ကွက်များ ဖြစ်စေ၍ ဈေးကွက်အရည်အသွေး ကျဆင်းစေပါသည်။",
    },
  ],
  mango: [
    {
      archetypeKey: "planthopper",
      slug: "mango-hopper",
      nameMm: "သရက်ဖူးစုပ်ပိုး (သရက်ပုရစ်/ဖြုတ်)",
      englishName: "Mango Hopper",
      scientificName: "Idioscopus nitidulus / Amritodus atkinsoni",
      affectedPartsMm: "သရက်ပန်းခိုင်၊ အဖူးနုနှင့် အရွက်နု",
      symptomsMm:
        "သရက်ပန်းခိုင်မှ အရည်စုပ်စားသဖြင့် ပန်းပွင့်ခြောက်ကြွေကျခြင်းနှင့် အချိုရည်ကြောင့် အရွက်/အသီးပေါ် မှိုမဲစွဲခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "fruit_fly",
      slug: "mango-fruit-fly",
      nameMm: "သရက်သီးထိုးယင်",
      englishName: "Oriental Fruit Fly",
      scientificName: "Bactrocera dorsalis",
      affectedPartsMm: "ရင့်မှည့်စ သရက်သီး",
      symptomsMm:
        "သရက်သီးအခွံအောက် ဥချ၍ ပိုးလောက်ကောင်ဖြူများ အသားထဲစားသောက်ကာ အသီးပုပ်ကြွေကျစေပါသည်။",
    },
    {
      archetypeKey: "rhinoceros_trunk_borer",
      slug: "mango-stem-borer",
      nameMm: "သရက်ပင်စည်ထွင်းပိုး (Longhorn Borer)",
      englishName: "Mango Stem / Trunk Borer",
      scientificName: "Batocera rufomaculata",
      affectedPartsMm: "သရက်ပင်စည်မကြီးနှင့် ကိုင်းမကြီး",
      symptomsMm:
        "ပင်စည်အခေါက်အတွင်း ဖောက်ဝင်စားသဖြင့် သစ်စေးနှင့် လွှစာမှုန့်များ ထွက်နေပြီး ကိုင်းခြောက်သေဆုံးတတ်ပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "mango-mealybug",
      nameMm: "သရက်ဂွမ်းပိုး (Mango Mealybug)",
      englishName: "Mango Mealybug",
      scientificName: "Drosicha mangiferae",
      affectedPartsMm: "အညွန့်၊ ပန်းခိုင်နှင့် သရက်သီးရိုးတံ",
      symptomsMm:
        "မတ်လ-ဧပြီလများတွင် ပင်စည်မှတက်၍ ပန်းခိုင်နှင့် သီးညှာများတွင် စုဝေးစုပ်စားကာ အသီးနုကြွေကျစေပါသည်။",
    },
  ],
  papaya: [
    {
      archetypeKey: "mites_mealybug",
      slug: "papaya-mealybug",
      nameMm: "သင်္ဘောဂွမ်းပိုး (Papaya Mealybug)",
      englishName: "Papaya Mealybug",
      scientificName: "Paracoccus marginatus",
      affectedPartsMm: "အရွက်အောက်၊ အညွန့်ထိပ်ဖျားနှင့် သင်္ဘောသီးမျက်နှာပြင်",
      symptomsMm:
        "အဖြူရောင်ဂွမ်းပိုးအစုအဝေးများ ဖုံးအုပ်စုပ်စား၍ အရွက်ဝါတွန့်ကာ အပင်ထိပ်ဖူးခြောက်သေသည်အထိ ဖျက်ဆီးတတ်ပါသည်။",
    },
    {
      archetypeKey: "aphids",
      slug: "papaya-aphids-ringspot",
      nameMm: "သင်္ဘောပျပိုး (Ringspot ဗိုင်းရပ်စ် သယ်ဆောင်ပိုး)",
      englishName: "Aphids (PRSV Vector)",
      scientificName: "Myzus persicae / Aphis gossypii",
      affectedPartsMm: "သင်္ဘောအရွက်နုနှင့် အညွန့်",
      symptomsMm:
        "သင်္ဘောကွင်းကွက်ဗိုင်းရပ်စ် (Papaya Ringspot Virus) ကူးစက်စေ၍ အသီးခွံပေါ် ကွင်းဝိုင်းကွက်များနှင့် အရွက်ကြိုးမျှင်သေးကျုံ့ခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "papaya-spider-mite",
      nameMm: "သင်္ဘောမွှားပင့်ကူနီ",
      englishName: "Papaya Red Spider Mite",
      scientificName: "Tetranychus spp.",
      affectedPartsMm: "သင်္ဘောရွက်အောက်နှင့် အသီးခွံ",
      symptomsMm:
        "နွေရာသီတွင် အရွက်ဝါညိုခြောက်၍ အသီးခွံပေါ် ကြမ်းတမ်းသော အညိုကွက်များ ဖြစ်ပေါ်စေပါသည်။",
    },
  ],
  orange: [
    {
      archetypeKey: "planthopper",
      slug: "orange-citrus-psyllid",
      nameMm: "လိမ္မော်ခုန်ပိုး (Citrus Psyllid - Greening သယ်ဆောင်ပိုး)",
      englishName: "Asian Citrus Psyllid",
      scientificName: "Diaphorina citri",
      affectedPartsMm: "လိမ္မော်အညွန့်နုနှင့် ရွက်နု",
      symptomsMm:
        "အညွန့်နုစုပ်စား၍ အရွက်တွန့်စေရုံသာမက ကုသမရနိုင်သော Huanglongbing (Citrus Greening) ရောဂါကို ကူးစက်စေပါသည်။",
    },
    {
      archetypeKey: "caterpillar_armyworm",
      slug: "orange-leafminer-citrus-butterfly",
      nameMm: "လိမ္မော်ရွက်ထွင်းပိုးနှင့် လိပ်ပြာခူကောင်",
      englishName: "Citrus Leafminer & Lemon Butterfly",
      scientificName: "Phyllocnistis citrella / Papilio demoleus",
      affectedPartsMm: "လိမ္မော်အညွန့်သစ်နှင့် အရွက်နု",
      symptomsMm:
        "အရွက်နုအတွင်း မြွေလိမ်လမ်းကြောင်း (Serpentine mines) ထွင်းစားခြင်းနှင့် Canker ဘက်တီးရီးယား ဝင်ရောက်လွယ်စေခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "fruit_fly",
      slug: "orange-fruit-fly",
      nameMm: "လိမ္မော်သီးထိုးယင်",
      englishName: "Citrus Fruit Fly",
      scientificName: "Bactrocera dorsalis / Bactrocera minax",
      affectedPartsMm: "ရင့်စနှင့် မှည့်စ လိမ္မော်သီး",
      symptomsMm:
        "လိမ္မော်သီးအခွံဝါကွက်ဖြစ်၍ အတွင်းပိုးလောက်ကောင်ဝင်ကာ အချိန်မတိုင်မီ အသီးကြွေကျပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "orange-scale-mites",
      nameMm: "လိမ္မော်မွှားနီနှင့် အကြေးပိုး",
      englishName: "Citrus Rust Mite & Scale Insects",
      scientificName: "Phyllocoptruta oleivora / Aonidiella spp.",
      affectedPartsMm: "လိမ္မော်အသီးခွံ၊ အရွက်နှင့် ကိုင်း",
      symptomsMm:
        "အသီးခွံမည်းညစ်ကြမ်းတမ်းခြင်းနှင့် အကိုင်းပေါ်အကြေးပိုးကပ်၍ ကိုင်းခြောက်သေခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
  ],
  coconut: [
    {
      archetypeKey: "rhinoceros_trunk_borer",
      slug: "coconut-rhinoceros-beetle",
      nameMm: "အုန်းကြံ့ချိုကျိုင်း (Rhinoceros Beetle)",
      englishName: "Coconut Rhinoceros Beetle",
      scientificName: "Oryctes rhinoceros",
      affectedPartsMm: "အုန်းပင်ထိပ်ဖူးအလယ်အူတိုင်",
      symptomsMm:
        "ထိပ်ဖူးအတွင်း ဖောက်ဝင်စားသဖြင့် အုန်းလက်အသစ်ထွက်လာသောအခါ ယပ်တောင်/V-ပုံစံ အကွဲအပြတ်များ ဖြစ်နေသည်ကို တွေ့ရပါသည်။",
    },
    {
      archetypeKey: "leaf_beetle_weevil",
      slug: "coconut-red-palm-weevil",
      nameMm: "အုန်းပင်စည်ထိုးကျိုင်းနီ (Red Palm Weevil)",
      englishName: "Red Palm Weevil",
      scientificName: "Rhynchophorus ferrugineus",
      affectedPartsMm: "အုန်းပင်စည်အတွင်းသားနှင့် ထိပ်ဖူး",
      symptomsMm:
        "ပင်စည်အတွင်း လောက်ကောင်ကြီးများ ဖောက်စား၍ ပင်စည်ပေါက်မှ အညိုရောင်အရည်နှင့် အမျှင်များထွက်ကာ အပင်ထိပ်ဖူးလဲကျသေဆုံးတတ်ပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "coconut-eriophyid-mite",
      nameMm: "အုန်းသီးမွှားပိုးနှင့် အုန်းလက်ကပ်အကြေးပိုး",
      englishName: "Coconut Eriophyid Mite & Scale",
      scientificName: "Aceria guerreronis / Aspidiotus destructor",
      affectedPartsMm: "အုန်းသီးနုညှာအောက်နှင့် အုန်းရွက်အောက်",
      symptomsMm:
        "အုန်းသီးခွံတွင် အညိုအက်ကွဲကြောင်းဖြစ်၍ အသီးသေးပုံပျက်ခြင်းနှင့် အုန်းရွက်ဝါခြောက်ခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
  ],
  cashew: [
    {
      archetypeKey: "tea_mosquito_mirid_bug",
      slug: "cashew-tea-mosquito-bug",
      nameMm: "သီဟိုဠ်ခြင်ကောင်တူစုပ်စားပိုး (Tea Mosquito Bug)",
      englishName: "Tea Mosquito Bug",
      scientificName: "Helopeltis antonii",
      affectedPartsMm: "သီဟိုဠ်အညွန့်နု၊ ပန်းခိုင်နှင့် သီးနု",
      symptomsMm:
        "အညွန့်နုနှင့် ပန်းခိုင်ကို စုပ်စား၍ အစေးထွက်ကာ မည်းနက်ခြောက်သွားသည့် Die-back လက္ခဏာဖြစ်ပြီး အသီးတင်မှု များစွာကျဆင်းစေပါသည်။",
    },
    {
      archetypeKey: "rhinoceros_trunk_borer",
      slug: "cashew-stem-root-borer",
      nameMm: "သီဟိုဠ်ပင်စည်နှင့် အမြစ်ထွင်းပိုး",
      englishName: "Cashew Stem & Root Borer",
      scientificName: "Plocaederus ferrugineus",
      affectedPartsMm: "ပင်စည်အောက်ခြေအခေါက်နှင့် အမြစ်ခွ",
      symptomsMm:
        "ပင်ခြေအခေါက်တွင်း ဖောက်စား၍ သစ်စေးနှင့် ဝါးစာမှုန့်များ ထွက်ကျကာ အပင်ဝါခြောက်သေဆုံးတတ်ပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "cashew-thrips-leafminer",
      nameMm: "သီဟိုဠ်လှေးပိုးနှင့် ပန်းခိုင်စုပ်စားပိုး",
      englishName: "Cashew Thrips",
      scientificName: "Selenothrips rubrocinctus / Rhipiphorothrips cruentatus",
      affectedPartsMm: "အရွက်အောက်နှင့် အသီးနုခွံ",
      symptomsMm:
        "အရွက်အောက်ဘက် ငွေဖြူ/သံချေးရောင်ဖြစ်၍ ရွက်ကြွေခြင်းနှင့် သီဟိုဠ်စေ့ခွံ အကွက်ဖြစ်ခြင်း တွေ့ရပါသည်။",
    },
  ],
  coffee: [
    {
      archetypeKey: "leaf_beetle_weevil",
      slug: "coffee-berry-borer",
      nameMm: "ကော်ဖီသီးထိုးကျိုင်း (Coffee Berry Borer)",
      englishName: "Coffee Berry Borer (CBB)",
      scientificName: "Hypothenemus hampei",
      affectedPartsMm: "ကော်ဖီသီးစိမ်းနှင့် ကော်ဖီသီးမှည့်အစေ့",
      symptomsMm:
        "ကော်ဖီသီးထိပ်ဝတွင် ပင်အပ်ပေါက်ခန့် အပေါက်သေးဖောက်၍ အတွင်းကော်ဖီစေ့ကို ဖောက်စားဖျက်ဆီးပါသည်။",
      preventionMm: [
        "ရိတ်သိမ်းချိန်တွင် အပင်ပေါ်နှင့် မြေပေါ်ကျန်နေသော ကော်ဖီသီးခြောက်အားလုံးကို မကျန်အောင် ကောက်သိမ်းဖျက်ဆီးပါ။",
        "အရိပ်ပင်များကို သင့်တင့်အောင် ကိုင်းချိုင်၍ လေဝင်လေထွက်ကောင်းစေပါ။",
        "Brocap / Ethanol-Methanol ထောင်ချောက်များ ခြံအတွင်း ချိတ်ဆွဲဖမ်းယူပါ။",
      ],
    },
    {
      archetypeKey: "rhinoceros_trunk_borer",
      slug: "coffee-white-stem-borer",
      nameMm: "ကော်ဖီပင်စည်ထိုးပိုးဖြူ (White Stem Borer)",
      englishName: "Coffee White Stem Borer",
      scientificName: "Xylotrechus quadripes",
      affectedPartsMm: "အာရေဗီကာ ကော်ဖီပင်စည်မကြီး",
      symptomsMm:
        "ပင်စည်အခေါက်ပေါ် အမြှောင်းတန်းများ ဖောင်းတက်လာပြီး အပင်ဝါညှိုး၍ ပင်စည်ကျိုးသေဆုံးတတ်ပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "coffee-mealybug-green-scale",
      nameMm: "ကော်ဖီဂွမ်းပိုးနှင့် အကြေးစိမ်းပိုး",
      englishName: "Coffee Mealybug & Green Scale",
      scientificName: "Planococcus spp. / Coccus viridis",
      affectedPartsMm: "ကော်ဖီသီးခိုင်ကြား၊ အညွန့်နှင့် အရွက်ကြော",
      symptomsMm:
        "အသီးခိုင်ကြားတွင် ဂွမ်းပိုး/အကြေးပိုးကပ်၍ ပုရွက်ဆိတ်တက်ကာ မှိုမဲစွဲပြီး အသီးကြွေကျစေပါသည်။",
    },
  ],
  tea: [
    {
      archetypeKey: "tea_mosquito_mirid_bug",
      slug: "tea-mosquito-bug",
      nameMm: "လက်ဖက်ခြင်ကောင်တူစုပ်စားပိုး (Tea Mosquito Bug)",
      englishName: "Tea Mosquito Bug",
      scientificName: "Helopeltis theivora",
      affectedPartsMm: "လက်ဖက်ညွန့်နုနှင့် အရွက်နု",
      symptomsMm:
        "လက်ဖက်ညွန့်နုတွင် အညိုအမည်းရောင် စုပ်ရာအကွက်များဖြစ်၍ အညွန့်ခြောက်တွန့်သွားသဖြင့် လက်ဖက်ခြောက်/လက်ဖက်စို အထွက်နှုန်းကျဆင်းပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "tea-red-spider-mite",
      nameMm: "လက်ဖက်မွှားပင့်ကူနီ (Red Spider Mite)",
      englishName: "Tea Red Spider Mite",
      scientificName: "Oligonychus coffeae",
      affectedPartsMm: "လက်ဖက်ရွက်အပေါ်မျက်နှာပြင်",
      symptomsMm:
        "ခြောက်သွေ့ရာသီတွင် လက်ဖက်ရွက်များ ကြေးနီရောင်ပြောင်း၍ ခြောက်ကြွေကျပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "tea-thrips-jassid",
      nameMm: "လက်ဖက်လှေးပိုးနှင့် ဖြုတ်စိမ်း",
      englishName: "Tea Thrips & Green Leafhopper",
      scientificName: "Scirtothrips dorsalis / Empoasca flavescens",
      affectedPartsMm: "လက်ဖက်ညွန့်ဖူးနှင့် ရွက်နုအောက်ဘက်",
      symptomsMm:
        "ရွက်နုအနားများ အပေါ်သို့ ကုပ်တွန့်ခြောက်၍ အဖူးကြီးထွားမှု နှေးကွေးစေပါသည်။",
    },
  ],
  rubber: [
    {
      archetypeKey: "mites_mealybug",
      slug: "rubber-scale-mealybug",
      nameMm: "ရော်ဘာအကြေးပိုး၊ ဂွမ်းပိုးနှင့် မွှားဝါ",
      englishName: "Rubber Scale, Mealybug & Yellow Mite",
      scientificName: "Saissetia nigra / Ferrisiana virgata / Polyphagotarsonemus latus",
      affectedPartsMm: "ရော်ဘာပျိုးပင်ညွန့်နုနှင့် ကိုင်းနု",
      symptomsMm:
        "အညွန့်နုအရွက်တွန့်ကြွေခြင်းနှင့် ပင်စည်နုပေါ် အကြေးပိုးဖုံး၍ အစေးထုတ်လုပ်မှု/ပျိုးပင်ကြီးထွားမှု နှေးစေပါသည်။",
    },
    {
      archetypeKey: "cutworm",
      slug: "rubber-white-grub-termite",
      nameMm: "ရော်ဘာမြေအောင်းလောက်ကောင် (Cockchafer Grub) နှင့် ခြပိုး",
      englishName: "Cockchafer Grub & Termite",
      scientificName: "Holotrichia / Coptotermes curvignathus",
      affectedPartsMm: "ရော်ဘာပင်အမြစ်နှင့် ပင်စည်အောက်ပိုင်း",
      symptomsMm:
        "အပင်ငယ်အမြစ်များ ကိုက်ဖြတ်ခံရခြင်းနှင့် ပင်စည်အောက်ပိုင်းတွင် ခြအိမ်တက်၍ ပင်စည်ဆွေးခြောက်သေဆုံးတတ်ပါသည်။",
    },
    {
      archetypeKey: "rhinoceros_trunk_borer",
      slug: "rubber-bark-borer",
      nameMm: "ရော်ဘာအခေါက်ထွင်းပိုး (Bark-eating Caterpillar / Borer)",
      englishName: "Rubber Bark Borer",
      scientificName: "Indarbela spp. / Xyleborus spp.",
      affectedPartsMm: "အစေးခြစ်မျက်နှာပြင်နှင့် ပင်စည်အခေါက်",
      symptomsMm:
        "အစေးခြစ်မျက်နှာပြင်နှင့် အခေါက်ကြား၌ ပိုးချည်အိမ်/အပေါက်ငယ်များဖောက်၍ အခေါက်ပုပ်ရိစေပါသည်။",
    },
  ],
  betel_nut: [
    {
      archetypeKey: "tea_mosquito_mirid_bug",
      slug: "betel-nut-spindle-bug",
      nameMm: "ကွမ်းသီးပင်အညွန့်စုပ်စားပိုး (Spindle Bug)",
      englishName: "Arecanut Spindle Bug",
      scientificName: "Carvalhoia arecae",
      affectedPartsMm: "ကွမ်းသီးပင်ထိပ်ဖူးအညွန့်နု",
      symptomsMm:
        "အညွန့်နုပွင့်မထွက်မီ စုပ်စားသဖြင့် အရွက်နုများ အမည်းစက်ဖြစ်၍ စုတ်ပြဲမလှပဘဲ အပင်အားနည်းစေပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "betel-nut-mites-scale",
      nameMm: "ကွမ်းသီးမွှားနီနှင့် အကြေးပိုး",
      englishName: "Arecanut Red Mite & Scale",
      scientificName: "Raoiella indica / Pinnaspis spp.",
      affectedPartsMm: "ကွမ်းသီးရွက်အောက်နှင့် အသီးနုခိုင်",
      symptomsMm:
        "အရွက်အောက်မျက်နှာပြင် ဝါကြေးနီရောင်သန်း၍ ခြောက်သွေ့ခြင်းနှင့် အသီးနုခိုင်ကပ်၍ ကြွေကျခြင်း ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "cutworm",
      slug: "betel-nut-root-grub",
      nameMm: "ကွမ်းသီးအမြစ်စားလောက်ကောင် (Root Grub)",
      englishName: "Arecanut Root Grub",
      scientificName: "Leucopholis coneophora",
      affectedPartsMm: "ကွမ်းသီးပင်အမြစ်စု",
      symptomsMm:
        "မြေအောက်အမြစ်များ ကိုက်ဖြတ်ခံရသဖြင့် ကွမ်းသီးပင်အောက်ရွက်များ ဝါခြောက်၍ အပင်ပိန်လှီကျုံ့သွားပါသည်။",
    },
  ],
  lablab_bean: [
    {
      archetypeKey: "aphids",
      slug: "lablab-aphids",
      nameMm: "ပဲကြီးပျပိုး",
      englishName: "Lablab / Bean Aphid",
      scientificName: "Aphis craccivora",
      affectedPartsMm: "ပဲကြီးနွယ်ဖျား၊ ပန်းခိုင်နှင့် ပဲကြီးတောင့်",
      symptomsMm:
        "အမည်းရောင်ပျပိုးအစုများ ပန်းခိုင်နှင့် အတောင့်ပေါ် အပြည့်ကပ်စုပ်စား၍ အသီးမတင်ဘဲ ညှိုးခြောက်စေပါသည်။",
    },
    {
      archetypeKey: "pod_borer",
      slug: "lablab-pod-borer",
      nameMm: "ပဲကြီးသီးလုံးဖောက်ပိုး",
      englishName: "Lablab Pod Borer",
      scientificName: "Helicoverpa armigera / Adisura atkinsoni",
      affectedPartsMm: "ပန်းပွင့်နှင့် ပဲကြီးတောင့်",
      symptomsMm:
        "အတောင့်ခွံဖောက်၍ ပဲကြီးစေ့များကို ကိုက်စားပစ်ပါသည်။",
    },
    {
      archetypeKey: "leaf_beetle_weevil",
      slug: "lablab-leaf-beetle-bug",
      nameMm: "ပဲကြီးရွက်စားကျိုင်းနှင့် စုပ်စားပိုးကောင်",
      englishName: "Pod Sucking Bug & Leaf Beetle",
      scientificName: "Riptortus / Clavigralla spp.",
      affectedPartsMm: "ပဲကြီးတောင့်နုနှင့် အရွက်",
      symptomsMm:
        "အတောင့်စုပ်စားပိုးကြောင့် ပဲကြီးစေ့ပိန်လှီတွန့်၍ အပင်ပေါက်နှုန်း ကျဆင်းစေပါသည်။",
    },
  ],
  okra: [
    {
      archetypeKey: "pod_borer",
      slug: "okra-shoot-fruit-borer",
      nameMm: "ရုံးပတီအညွန့်နှင့် အသီးဖောက်ပိုး",
      englishName: "Okra Shoot & Fruit Borer",
      scientificName: "Earias vittella / Earias insulana",
      affectedPartsMm: "ရုံးပတီအညွန့်ဖျားနှင့် ရုံးပတီသီး",
      symptomsMm:
        "အညွန့်နု ညှိုးငိုက်ခြောက်သွားခြင်းနှင့် ရုံးပတီသီးတွင် အပေါက်ဝိုင်းဖောက်စား၍ ပိုးချေးထွက်နေခြင်း တွေ့ရပါသည်။",
    },
    {
      archetypeKey: "planthopper",
      slug: "okra-jassid",
      nameMm: "ရုံးပတီဖြုတ်စိမ်းပိုး",
      englishName: "Okra Leafhopper / Jassid",
      scientificName: "Amrasca biguttula",
      affectedPartsMm: "ရုံးပတီရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "အရွက်အနားဝါနီခြောက်၍ အပေါ်သို့ ခွက်လိမ်တက်သွားသော Hopperburn ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "thrips_whitefly",
      slug: "okra-whitefly-yvmv",
      nameMm: "ရုံးပတီယင်ဖြူ (YVMV သယ်ဆောင်ပိုး)",
      englishName: "Okra Whitefly",
      scientificName: "Bemisia tabaci",
      affectedPartsMm: "အရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "ရုံးပတီရွက်ကြောဝါဗိုင်းရပ်စ် (Yellow Vein Mosaic Virus) ကူးစက်၍ အရွက်တစ်ရွက်လုံး အဝါရောင်အကြောကွန်ရက်ဖြစ်ပြီး အသီးဖြူသေးသွားစေပါသည်။",
    },
    {
      archetypeKey: "mites_mealybug",
      slug: "okra-red-spider-mite",
      nameMm: "ရုံးပတီမွှားပင့်ကူနီ",
      englishName: "Red Spider Mite",
      scientificName: "Tetranychus urticae",
      affectedPartsMm: "အရွက်အောက်မျက်နှာပြင်",
      symptomsMm:
        "ခြောက်သွေ့ရာသီတွင် အရွက်ဝါညိုကြွေကျ၍ အသီးခူးကာလ တိုတောင်းသွားစေပါသည်။",
    },
  ],
  cabbage: [
    {
      archetypeKey: "cabbage_worm_looper",
      slug: "cabbage-worm",
      affectedPartsMm: "ဂေါ်ဖီထုပ်အပြင်ရွက်နှင့် အထုပ်အပေါ်ပိုင်း",
      symptomsMm:
        "အရွက်စိမ်းများတွင် အပေါက်ဝိုင်းကြီးများ ကိုက်စား၍ အစိမ်းညိုရောင် ပိုးချေးများ အရွက်ကြားတွင် ပေကျံနေပါသည်။",
    },
    {
      archetypeKey: "diamondback_moth",
      slug: "cabbage-diamondback-moth",
      affectedPartsMm: "ဂေါ်ဖီထုပ်အရွက်အောက်မျက်နှာပြင်နှင့် ဗဟိုအဖူး",
      symptomsMm:
        "အရွက်အောက်ဘက်မှ ခြစ်စားသဖြင့် အပေါ်အမြှေးပါးသာ ကျန်သော မှန်ပြတင်းပေါက်ကွက် (Windowpane) များ ဖြစ်ပေါ်ပါသည်။",
    },
    {
      archetypeKey: "aphids",
      slug: "cabbage-aphid",
      nameMm: "ဂေါ်ဖီပျပိုး (Mealy Cabbage Aphid)",
      englishName: "Cabbage Aphid",
      scientificName: "Brevicoryne brassicae",
      affectedPartsMm: "ဂေါ်ဖီရွက်အောက်ဘက်နှင့် ဂေါ်ဖီထုပ်အလွှာကြား",
      symptomsMm:
        "မီးခိုးစိမ်းရောင်ပျပိုးများ စုပြုံစုပ်စား၍ အရွက်တွန့်လိမ်ကာ ဂေါ်ဖီထုပ်မဖြစ်ဘဲ မှိုမဲစွဲစေပါသည်။",
    },
    {
      archetypeKey: "leaf_beetle_weevil",
      slug: "cabbage-flea-beetle",
      nameMm: "ဂေါ်ဖီခုန်ပေါက်ကျိုင်း (Flea Beetle)",
      englishName: "Crucifer Flea Beetle",
      scientificName: "Phyllotreta striolata",
      affectedPartsMm: "ဂေါ်ဖီပျိုးပင်နှင့် အရွက်နု",
      symptomsMm:
        "အရွက်ပေါ်တွင် အပ်ပေါက်ခန့် အပေါက်သေးလေးများ (Shot-hole) ပြည့်နှက်နေ၍ ပျိုးပင်သေဆုံးတတ်ပါသည်။",
    },
    {
      archetypeKey: "cutworm",
      slug: "cabbage-cutworm",
      affectedPartsMm: "ဂေါ်ဖီပျိုးပင်ခြေ မြေစပ်ပင်စည်",
      symptomsMm:
        "ရွှေ့စိုက်ပြီး ၁-၂ ပတ်အတွင်း ညအချိန်၌ ပျိုးပင်ခြေမှ ကိုက်ဖြတ်ချပစ်ပါသည်။",
    },
    {
      archetypeKey: "caterpillar_armyworm",
      slug: "cabbage-armyworm",
      affectedPartsMm: "ဂေါ်ဖီထုပ်အရွက်နှင့် အထုပ်အတွင်းပိုင်း",
      symptomsMm:
        "ညအချိန်၌ အုပ်စုလိုက် အရွက်ကိုက်စား၍ ဂေါ်ဖီထုပ်အတွင်းထိ ဖောက်ဝင်ဖျက်ဆီးတတ်ပါသည်။",
    },
  ],
  cauliflower: [
    {
      archetypeKey: "diamondback_moth",
      slug: "cauliflower-diamondback-moth",
      affectedPartsMm: "ပန်းဂေါ်ဖီအရွက်နုနှင့် ပန်းပွင့်ခေါင်း (Curd) ဘေးရွက်",
      symptomsMm:
        "အရွက်အောက်ဘက်တွင် မှန်ပြတင်းပေါက်ပုံစံ ဖောက်စား၍ ပန်းပွင့်ခေါင်းအတွင်းထိ ဝင်ရောက်စားသောက်တတ်ပါသည်။",
    },
    {
      archetypeKey: "cabbage_worm_looper",
      slug: "cauliflower-cabbage-worm",
      affectedPartsMm: "ပန်းဂေါ်ဖီအရွက်နှင့် ပန်းပွင့်ခေါင်း",
      symptomsMm:
        "အရွက်များ ကိုက်စားခံရ၍ အစိမ်းရောင်ပိုးချေးများ ပန်းဂေါ်ဖီပွင့်ပေါ် စွန်းထင်းကာ ဈေးကွက်ပျက်စေပါသည်။",
    },
    {
      archetypeKey: "aphids",
      slug: "cauliflower-aphid",
      nameMm: "ပန်းဂေါ်ဖီပျပိုး",
      englishName: "Cabbage / Cauliflower Aphid",
      scientificName: "Brevicoryne brassicae / Myzus persicae",
      affectedPartsMm: "အရွက်အောက်နှင့် ပန်းပွင့်ခေါင်းကြား",
      symptomsMm:
        "ပန်းပွင့်ခေါင်းကြားထဲ ပျပိုးဝင်ကပ်၍ ပန်းပွင့်မည်းညစ်ပုပ်ရိစေပါသည်။",
    },
    {
      archetypeKey: "leaf_beetle_weevil",
      slug: "cauliflower-flea-beetle",
      nameMm: "ပန်းဂေါ်ဖီခုန်ပေါက်ကျိုင်း",
      englishName: "Flea Beetle",
      scientificName: "Phyllotreta spp.",
      affectedPartsMm: "ပန်းဂေါ်ဖီပျိုးခင်းနှင့် ရွှေ့စိုက်စအရွက်",
      symptomsMm:
        "အရွက်နုတွင် အပေါက်သေးများပြည့်၍ ပျိုးပင်ကြီးထွားမှု ရပ်တန့်စေပါသည်။",
    },
    {
      archetypeKey: "cutworm",
      slug: "cauliflower-cutworm",
      affectedPartsMm: "ရွှေ့စိုက်စ ပန်းဂေါ်ဖီပျိုးပင်ခြေ",
      symptomsMm:
        "ညအချိန် မြေစပ်ပင်စည် ကိုက်ဖြတ်ခံရ၍ အပင်ငယ်များ လဲကျသေဆုံးပါသည်။",
    },
    {
      archetypeKey: "caterpillar_armyworm",
      slug: "cauliflower-armyworm",
      affectedPartsMm: "ပန်းဂေါ်ဖီအရွက်နှင့် ပန်းပွင့်ခေါင်းအတွင်း",
      symptomsMm:
        "ညအချိန် အရွက်ကိုက်ဖြတ်၍ ပန်းပွင့်ခေါင်း (Curd) ကိုပါ ကိုက်ဖောက်စားသောက်တတ်ပါသည်။",
    },
  ],
};

export const ALL_CROPS_PESTS: CropPestGuideItem[] = FORTY_CROPS_CATALOG.flatMap(
  (crop) => {
    const seeds = CROP_PEST_SEEDS[crop.id] ?? [];
    return seeds.map((seed) => makeCropPest(crop.id, seed));
  }
);

export function getPestsForCrop(cropId: string): CropPestGuideItem[] {
  return ALL_CROPS_PESTS.filter((p) => p.cropId === cropId);
}
