import type { ChemicalPesticideGuide } from "../types/farm";

export interface PestArchetype {
  key: string;
  nameMm: string;
  englishName: string;
  scientificName: string;
  severityMm: "သတိထားရန်" | "အထူးသတိပြုရန်";
  imageUrl: string;
  imageAltMm: string;
  defaultPreventionMm: string[];
  naturalControlMm: string;
  bioPesticideMm: string;
  chemicalBase: Omit<ChemicalPesticideGuide, "cropAuthorizationStatusMm" | "phiWarningMm"> & {
    targetCropNotePrefix?: string;
  };
}

export const PRB_VERIFICATION_PPE_STANDARD =
  "ဓာတုကာကွယ်ရေး နှာခေါင်းစည်း (Mask/Respirator)၊ မျက်မှန် (Goggles)၊ ဓာတုခံ လက်အိတ်ရှည်၊ အင်္ကျီလက်ရှည်/ဘောင်းဘီရှည် အကာအကွယ်ဝတ်စုံနှင့် ရာဘာဘွတ်ဖိနပ်များ မဖြစ်မနေ ဝတ်ဆင်ပါ။ ဆေးဖျန်းပြီးလျှင် ဆပ်ပြာဖြင့် စင်ကြယ်စွာ ရေချိုးဆေးကြောပါ။";

export const PEST_ARCHETYPES: Record<string, PestArchetype> = {
  stem_borer: {
    key: "stem_borer",
    nameMm: "ပင်စည်ထိုးပိုး (ဆစ်ပိုး)",
    englishName: "Stem Borer",
    scientificName: "Scirpophaga / Chilo spp.",
    severityMm: "အထူးသတိပြုရန်",
    imageUrl: "/src/assets/images/pest_stem_borer_1795419242505.jpg",
    imageAltMm: "အပင်ပင်စည်အတွင်း ဖောက်ထွင်းစားသောက်နေသော ပင်စည်ထိုးပိုးလောက်ကောင် ဓာတ်ပုံ",
    defaultPreventionMm: [
      "ရိတ်သိမ်းပြီး ရိုးပြတ်နှင့် ပင်စည်အကြွင်းအကျန်များကို ထယ်ထိုးမြှုပ်နှံ၍ ပိုးရုပ်ဖုံးများ ဖျက်ဆီးပါ။",
      "မျိုးကွဲတစ်မျိုးတည်းကို ဒေသအလိုက် တစ်ပြိုင်တည်း စိုက်ချိန်ညှိ၍ စိုက်ပျိုးပါ။",
      "နိုက်ထရိုဂျင် (ယူရီးယား) မြေဩဇာကို လိုအပ်သည်ထက် ပိုမကျွေးပါနှင့်။",
    ],
    naturalControlMm:
      "စိုက်ခင်းအတွင်းရှိ ဥကပ်ပါးနဂျီ (Trichogramma) နှင့် ပင့်ကူများ မသေစေရန် ဓာတုဆေးမလိုအပ်ဘဲ မဖျန်းပါနှင့်။ ပိုးဖလံဝင်ရောက်မှုကို ဖယ်ရိုမုန်းထောင်ချောက် (Pheromone trap) နှင့် မီးထောင်ချောက်ဖြင့် စောင့်ကြည့်ဖမ်းယူပါ။",
    bioPesticideMm:
      "ဖလံဥများပေါက်စ လောက်ကောင်ငယ် ပင်စည်ထဲ မဝင်ရောက်မီ ဘီတီ (Bt - Bacillus thuringiensis) ဇီဝပိုးသတ်ဆေး သို့မဟုတ် ဥကပ်ပါးနဂျီကတ် (Trichogramma) လွှတ်ပေးခြင်းဖြင့် ထိရောက်စွာ ထိန်းချုပ်နိုင်ပါသည်။",
    chemicalBase: {
      activeIngredientInfoMm:
        "Diamide အုပ်စုဝင် (ဥပမာ- Chlorantraniliprole / Flubendiamide) သို့မဟုတ် Nereistoxin analogue (Cartap) ကဲ့သို့ အာနိသင်များကို စိုက်ပျိုးရေးပညာရှင်များ ညွှန်းဆိုလေ့ရှိသော်လည်း မြန်မာနိုင်ငံ PRB မှတ်ပုံတင်တံဆိပ်အမည်ကို ဝယ်ယူစဉ် စစ်ဆေးရန် လိုအပ်ပါသည်။",
      groupAndModeMm:
        "IRAC Group 28 (Diamide - ကြွက်သားလုပ်ဆောင်မှု ရပ်တန့်စေသော ပင်လုံးပြန့်/ထိသေအာနိသင်) သို့မဟုတ် IRAC Group 14 — ပင်စည်အတွင်းသို့ ဖောက်ဝင်မည့် လောက်ကောင်ငယ်များကို ထိန်းချုပ်ပါသည်။",
      targetPestControlMm:
        "ပင်စည်ထဲ မဝင်ရောက်မီ ဥမှပေါက်ခါစ လောက်ကောင်ငယ် (Early-instar larvae) အဆင့်",
      labelDosageAndMethodMm:
        "တိကျသော ဆေးနှုန်းထားနှင့် ရေဖျော်စပ်ပုံမှာ ဆေးအာနိသင်ရာခိုင်နှုန်း (% SC/WG/G) အလိုက် ကွာခြားသဖြင့် မခန့်မှန်းပါ — မှတ်ပုံတင်ဆေးဘူးတံဆိပ်ပါ ညွှန်ကြားချက်အတိုင်းသာ အတိအကျ အသုံးပြုပါ။",
      sprayTimingAndPrecautionMm:
        "လောက်ကောင် ပင်စည်ထဲ ဝင်ရောက်သွားပြီးနောက် ဆေးထိရောက်မှု နည်းပါးသဖြင့် ပိုးဖလံ/ဥမြုံစတင်တွေ့ပြီး ပေါက်ခါစအချိန် (သို့မဟုတ် စီးပွားရေးထိခိုက်မှုအဆင့်ကျော်မှ) ညနေပိုင်းတွင်သာ ဖျန်းပါ။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "မျိုးဆက်တစ်ခုအတွင်း IRAC အုပ်စုတူဆေးကို ထပ်ခါတလဲလဲ မသုံးပါနှင့်။ နောက်တစ်ကြိမ် လိုအပ်ပါက ဘီတီ (Group 11A) သို့မဟုတ် မတူညီသော IRAC အုပ်စုသို့ လှည့်လည်ပြောင်းသုံးပါ။",
    },
  },
  planthopper: {
    key: "planthopper",
    nameMm: "ဖြုတ်ညိုနှင့် ဖြုတ်စိမ်းပိုး",
    englishName: "Planthopper & Leafhopper",
    scientificName: "Nilaparvata / Nephotettix / Amrasca spp.",
    severityMm: "အထူးသတိပြုရန်",
    imageUrl: "/src/assets/images/pest_planthopper_1795419242527.jpg",
    imageAltMm: "အပင်ပင်စည်အောက်ခြေတွင် စုဝေး၍ ပင်ရည်စုပ်စားနေသော ဖြုတ်ညိုပိုး ဓာတ်ပုံ",
    defaultPreventionMm: [
      "ပင်ကြား၊ တန်းကြား လေဝင်လေထွက်ကောင်းအောင် သတ်မှတ်အကွာအဝေးအတိုင်း စိုက်ပျိုးပါ။",
      "မိတ်ဆွေပိုး (ပင့်ကူ၊ ရေပိုးကောင်၊ လိပ်ခုံးကျိုင်း) များ မသေစေရန် အပင်ငယ်စဉ် ကျယ်ပြန့်အာနိသင်ရှိ ပိုးသတ်ဆေး မဖျန်းပါနှင့်။",
      "နိုက်ထရိုဂျင်မြေဩဇာ လွန်ကဲစွာ ကျွေးခြင်းကို ရှောင်ကြဉ်ပါ။",
    ],
    naturalControlMm:
      "တမာဆီနှင့် ဆပ်ပြာမှုန့်အပျော့စားရောစပ်ရည်ကို ပင်ခြေနှင့် အရွက်အောက်မျက်နှာပြင်သို့ ထိအောင် ဖျန်းပေးပါ။ စပါးခင်းဖြစ်ပါက ရေကို ၃-၄ ရက် ခေတ္တဖောက်ထုတ်၍ ခြောက်သွေ့စေခြင်းဖြင့် ဖြုတ်ညိုပွားနှုန်း လျှော့ချနိုင်ပါသည်။",
    bioPesticideMm:
      "စိုထိုင်းဆရှိသော ရာသီတွင် Beauveria bassiana သို့မဟုတ် Metarhizium anisopliae ဇီဝမှိုပိုးသတ်ဆေးကို အကောင်ငယ် (Nymph) အဆင့်၌ ပင်ခြေသို့ ဖျန်းပေးနိုင်ပါသည်။",
    chemicalBase: {
      activeIngredientInfoMm:
        "ဖြုတ်ပိုးအတွက် Buprofezin (အရေခွံလဲဟန့်တားဆေး)၊ Pymetrozine သို့မဟုတ် Dinotefuran ကဲ့သို့ Active Ingredient အုပ်စုများ ရှိသော်လည်း မြန်မာနိုင်ငံ PRB တရားဝင်မှတ်ပုံတင်စာရင်းတွင် သက်ဆိုင်ရာသီးနှံခွင့်ပြုချက်ကို မဖြစ်မနေ စစ်ဆေးပါ။",
      groupAndModeMm:
        "IRAC Group 16 (Chitin synthesis inhibitor - အကောင်ငယ်အရေခွံမလဲနိုင်အောင် ဟန့်တားခြင်း) သို့မဟုတ် Group 9B (Chordotonal organ TRPV modulator - အစာစုပ်ခြင်း ရပ်တန့်စေခြင်း)",
      targetPestControlMm:
        "ဖြုတ်ညို၊ ဖြုတ်ကျောဖြူနှင့် ဖြုတ်စိမ်းပိုး အကောင်ငယ် (Nymph) နှင့် အကောင်ကြီး",
      labelDosageAndMethodMm:
        "ဆေးနှုန်းထားကို မခန့်မှန်းပါ — တရားဝင်မှတ်ပုံတင် ဆေးဘူးတံဆိပ်ပါ နှုန်းထားအတိုင်းသာ ဖျော်စပ်၍ အရွက်ပေါ်သာမက ပင်ခြေရေစပ်/အရွက်အောက်ဘက်သို့ တိုက်ရိုက်ထိအောင် ဖျန်းပါ။",
      sprayTimingAndPrecautionMm:
        "သီးနှံတစ်ပင်/တစ်ရုံလျှင် စီးပွားရေးထိခိုက်မှုအဆင့် ကျော်လွန်မှသာ ဖျန်းပါ။ ပန်းပွင့်ချိန် ပျားများထိခိုက်နိုင်သော Neonicotinoid အုပ်စုများကို အထူးရှောင်ကြဉ်ပါ။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "Synthetic pyrethroids (Group 3A) များကို ဖြုတ်ညိုအတွက် မသုံးသင့်ပါ (ဖြုတ်ညိုပြန်လည်ပေါက်ဖွားနှုန်း Resurgence ဖြစ်စေတတ်သည်)။ Buprofezin (Group 16) နှင့် Group 9B စသည်ဖြင့် IRAC အုပ်စု အလှည့်ကျ ပြောင်းသုံးပါ။",
    },
  },
  pod_borer: {
    key: "pod_borer",
    nameMm: "သီးလုံးဖောက်ပိုး / အတောင့်ဖောက်ပိုး",
    englishName: "Pod & Fruit Borer",
    scientificName: "Helicoverpa armigera / Maruca vitrata",
    severityMm: "အထူးသတိပြုရန်",
    imageUrl: "/src/assets/images/pest_pod_borer_1795419243110.jpg",
    imageAltMm: "ပဲတောင့်စိမ်းထဲသို့ ဖောက်ဝင်စားသောက်နေသော သီးလုံးဖောက်ပိုးလောက်ကောင် ဓာတ်ပုံ",
    defaultPreventionMm: [
      "ထယ်ရေးနက်နက်ထိုး၍ မြေအောင်းပိုးရုပ်ဖုံးများကို နေရောင်နှင့် ငှက်များထံ ဖော်ထုတ်ဖျက်ဆီးပါ။",
      "စိုက်ခင်းအတွင်း တစ်ဧကလျှင် ငှက်နားတန်း (T-perches) များ စိုက်ထူပေးခြင်းဖြင့် ငှက်များက လောက်ကောင်များကို ဖမ်းစားစေပါ။",
      "ဖယ်ရိုမုန်းထောင်ချောက်ဖြင့် ဖလံဝင်ရောက်မှုကို အဖူးအပွင့်စဝင်ချိန်မှစ၍ စောင့်ကြည့်ပါ။",
    ],
    naturalControlMm:
      "ပန်းစပွင့်ချိန်မှစ၍ တမာဆီ (Azadirachtin) နှင့် ကြက်သွန်ဖြူ-ငရုတ်သီး သဘာဝဖျော်ရည်ကို ၇ ရက်ခြား ကြိုတင်ဖျန်းခြင်းဖြင့် ဖလံဥမချစေရန် ဟန့်တားနိုင်ပါသည်။",
    bioPesticideMm:
      "လောက်ကောင်ငယ် အသီး/အတောင့်ထဲ မဝင်ရောက်မီ HaNPV (Helicoverpa Nucleopolyhedrovirus) ဗိုင်းရပ်စ်ဇီဝဆေး သို့မဟုတ် Bt (Bacillus thuringiensis) ကို ညနေပိုင်း ဖျန်းပေးပါ။",
    chemicalBase: {
      activeIngredientInfoMm:
        "Emamectin benzoate၊ Chlorantraniliprole သို့မဟုတ် Indoxacarb ကဲ့သို့ Active Ingredient အုပ်စုများကို IPM တွင် ညွှန်းဆိုလေ့ရှိသော်လည်း မြန်မာနိုင်ငံ PRB တရားဝင်မှတ်ပုံတင်စာရင်းတွင် သက်ဆိုင်ရာသီးနှံအတွက် ခွင့်ပြုချက် ရှိ/မရှိ စစ်ဆေးပါ။",
      groupAndModeMm:
        "IRAC Group 6 (Glutamate-gated chloride channel allosteric modulator) သို့မဟုတ် Group 28 (Diamide) / Group 22A (Oxadiazine) — အစာစားမှုကို ချက်ချင်းရပ်တန့်စေပါသည်။",
      targetPestControlMm:
        "ဥမှပေါက်ခါစ နှင့် အရွယ်ငယ် လောက်ကောင် (1st–3rd instar larvae)",
      labelDosageAndMethodMm:
        "ဆေးနှုန်းထားကို မခန့်မှန်းပါ — မှတ်ပုံတင်ဆေးဘူးတံဆိပ်ပါ ညွှန်ကြားချက်အတိုင်း ရေဖျော်၍ အဖူးအပွင့်နှင့် အသီး/အတောင့်နုများထိအောင် ဖျန်းပါ။",
      sprayTimingAndPrecautionMm:
        "ပန်းပွင့်ချိန် နေ့ခင်း၌ ပျားများဝတ်မှုန်ကူးနေစဉ် ဆေးမဖျန်းပါနှင့် — ညနေစောင်းတွင်သာ ဆောင်ရွက်ပါ။ လောက်ကောင် အသီးထဲဝင်သွားပါက ဆေးထိရောက်မှု ကျဆင်းပါသည်။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "Pyrethroid (Group 3A) ကို အမြဲမသုံးဘဲ HaNPV/Bt (Group 11A) နှင့် Group 6 / Group 28 တို့ကို မျိုးဆက်အလိုက် အလှည့်ကျ လှည့်လည်သုံးစွဲပါ။",
    },
  },
  aphids: {
    key: "aphids",
    nameMm: "ပျပိုး",
    englishName: "Aphids",
    scientificName: "Aphis / Myzus / Brevicoryne spp.",
    severityMm: "အထူးသတိပြုရန်",
    imageUrl: "/src/assets/images/pest_cabbage_aphids_1795418937219.jpg",
    imageAltMm: "အရွက်အောက်မျက်နှာပြင်တွင် စုဝေးစုပ်စားနေသော ပျပိုးအုပ်စု ဓာတ်ပုံ",
    defaultPreventionMm: [
      "အဝါရောင်ကော်ပြားထောင်ချောက်များ ချိတ်ဆွဲ၍ တောင်ပံပါပျပိုး စတင်ဝင်ရောက်မှုကို စောင့်ကြည့်ပါ။",
      "နိုက်ထရိုဂျင်မြေဩဇာ အလွန်အကျွံကျွေးခြင်းကို ရှောင်ကြဉ်ပါ။",
      "စိုက်ခင်းပတ်လည်ရှိ ပေါင်းမြက်နှင့် ဗိုင်းရပ်စ်ကူးစက်နေသော အပင်ဟောင်းများကို ရှင်းလင်းပါ။",
    ],
    naturalControlMm:
      "စတင်တွေ့ရှိချိန်တွင် ဆပ်ပြာရည်အပျော့စား + တမာဆီရောစပ်ရည်ကို အရွက်အောက်မျက်နှာပြင်ထိအောင် ဖျန်းပေးပါ။ လိပ်ခုံးကျိုင်း (Ladybird beetle) နှင့် Chrysoperla မိတ်ဆွေပိုးများကို ထိန်းသိမ်းပါ။",
    bioPesticideMm:
      "စိုထိုင်းဆသင့်တင့်ချိန်တွင် Lecanicillium lecanii (Verticillium) သို့မဟုတ် Beauveria bassiana ဇီဝမှိုပိုးသတ်ဆေးကို အရွက်အောက်ဘက်သို့ ဖျန်းပေးနိုင်ပါသည်။",
    chemicalBase: {
      activeIngredientInfoMm:
        "Flonicamid၊ Pymetrozine သို့မဟုတ် Acetamiprid/Imidacloprid ကဲ့သို့ စုပ်စားပိုး Active Ingredient အုပ်စုများ ရှိသော်လည်း သက်ဆိုင်ရာသီးနှံအတွက် PRB မှတ်ပုံတင်ခွင့်ပြုချက်ကို ဝယ်ယူစဉ် စစ်ဆေးအတည်ပြုပါ။",
      groupAndModeMm:
        "IRAC Group 29 (Flonicamid) / Group 9B / Group 4A (Neonicotinoid - ပင်လုံးပြန့်နှင့် ထိသေအာနိသင်)",
      targetPestControlMm: "ပျပိုးအကောင်ငယ်နှင့် တောင်ပံပါ/မပါ ပျပိုးအကောင်ကြီး",
      labelDosageAndMethodMm:
        "ဆေးနှုန်းထားကို မခန့်မှန်းပါ — ဆေးဘူးတံဆိပ်ပါ ညွှန်ကြားချက်အတိုင်း ဖျော်စပ်၍ တွန့်လိမ်နေသော အရွက်အောက်ဘက်နှင့် အညွန့်နုများထိအောင် ဖျန်းပါ။",
      sprayTimingAndPrecautionMm:
        "ဗိုင်းရပ်စ်သယ်ဆောင်သည့်ပိုးဖြစ်၍ ကူးစက်မှုမပြန့်ပွားမီ အစောပိုင်းတွင် ထိန်းချုပ်ပါ။ ပန်းပွင့်ချိန် ပျားအန္တရာယ်ရှိသော Group 4A ဆေးများကို ရှောင်ကြဉ်ပါ။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "Group 4A ဆေးတစ်မျိုးတည်း ဆက်တိုက်မဖျန်းဘဲ တမာဆီ/ဆပ်ပြာရည်၊ Group 29 သို့မဟုတ် Group 9B တို့နှင့် အလှည့်ကျ လှည့်လည်အသုံးပြုပါ။",
    },
  },
  thrips_whitefly: {
    key: "thrips_whitefly",
    nameMm: "လှေးပိုးနှင့် ယင်ဖြူ",
    englishName: "Thrips & Whitefly",
    scientificName: "Thrips tabaci / Scirtothrips / Bemisia tabaci",
    severityMm: "အထူးသတိပြုရန်",
    imageUrl: "/src/assets/images/pest_thrips_whitefly_1795419242781.jpg",
    imageAltMm: "အရွက်အောက်မျက်နှာပြင်ရှိ ယင်ဖြူနှင့် လှေးပိုးများ ဓာတ်ပုံ",
    defaultPreventionMm: [
      "ပျိုးခင်းကို ခြင်ထောင်ဇကာ (Insect net) ဖြင့် အုပ်၍ ပျိုးထောင်ခြင်းဖြင့် ဗိုင်းရပ်စ် (ရွက်တွန့်/YMV) ကူးစက်မှု တားဆီးပါ။",
      "အဝါရောင်နှင့် အပြာရောင် ကော်ပြားထောင်ချောက်များ စိုက်ခင်းထဲ ချိတ်ဆွဲပါ။",
      "မြေအစိုဓာတ် ညီညာစွာ ထိန်းသိမ်း၍ ခြောက်သွေ့လွန်းခြင်း မဖြစ်စေရန် ဂရုပြုပါ။",
    ],
    naturalControlMm:
      "တမာဆီ + ဆပ်ပြာရည်အပျော့စား (သို့) ကြက်သွန်ဖြူနှင့် ငရုတ်သီးစပ်ဖျော်ရည်ကို နံနက်စောစော သို့မဟုတ် ညနေစောင်းတွင် အရွက်အောက်ဘက်ထိအောင် ဖျန်းပေးပါ။",
    bioPesticideMm:
      "ယင်ဖြူနှင့် လှေးပိုးအတွက် Beauveria bassiana သို့မဟုတ် Lecanicillium lecanii ဇီဝမှိုပိုးသတ်ဆေးကို စိုထိုင်းဆရှိချိန် (ညနေပိုင်း) ဖျန်းပေးနိုင်ပါသည်။",
    chemicalBase: {
      activeIngredientInfoMm:
        "လှေးပိုးအတွက် Spinetoram/Spinosad၊ ယင်ဖြူအတွက် Pyriproxyfen/Spiromesifen/Diafenthiuron ကဲ့သို့ Active Ingredient များကို ညွှန်းဆိုလေ့ရှိသော်လည်း မြန်မာနိုင်ငံ PRB မှတ်ပုံတင်ခွင့်ပြုချက်ကို ဆေးဘူးတံဆိပ်တွင် မဖြစ်မနေ စစ်ဆေးပါ။",
      groupAndModeMm:
        "IRAC Group 5 (Spinosyns - လှေးပိုးအတွက်) / Group 7C (Juvenile hormone mimic - ယင်ဖြူဥနှင့် အကောင်ငယ်ပေါက်ပွားမှု ဟန့်တားခြင်း) / Group 23 (Lipid synthesis inhibitor)",
      targetPestControlMm: "လှေးပိုးအကောင်ငယ်/ကြီး နှင့် ယင်ဖြူဥ/အကောင်ငယ် (Nymph)/အကောင်ကြီး",
      labelDosageAndMethodMm:
        "ဆေးနှုန်းထားကို မခန့်မှန်းပါ — တရားဝင်မှတ်ပုံတင် ဆေးဘူးတံဆိပ်ပါ နှုန်းထားအတိုင်းသာ ဖျော်စပ်၍ အရွက်အောက်မျက်နှာပြင်နှင့် အညွန့်ဖျားသို့ နှံ့စပ်အောင် ဖျန်းပါ။",
      sprayTimingAndPrecautionMm:
        "လှေးပိုးနှင့် ယင်ဖြူသည် ရာသီပူပြင်းခြောက်သွေ့ချိန်တွင် ၅-၇ ရက်အတွင်း မျိုးဆက်မြန်မြန်ပွားတတ်သဖြင့် အစောပိုင်းတွေ့ရှိချိန်၌ ညနေပိုင်း ဖျန်းပါ။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "ဤပိုး ၂ မျိုးလုံး ဆေးယဉ်ပါးမှု အလွန်မြန်သဖြင့် Group 5၊ Group 7C၊ Group 23 နှင့် တမာဆီ (UN) တို့ကို တစ်လှည့်စီ ပြောင်းလဲသုံးစွဲပါ။",
    },
  },
  fruit_fly: {
    key: "fruit_fly",
    nameMm: "သီးထိုးယင်",
    englishName: "Fruit Fly",
    scientificName: "Bactrocera dorsalis / Zeugodacus cucurbitae",
    severityMm: "အထူးသတိပြုရန်",
    imageUrl: "/src/assets/images/pest_fruit_fly_1795419243036.jpg",
    imageAltMm: "အသီးမျက်နှာပြင်ပေါ် နားနေသော သီးထိုးယင် ဓာတ်ပုံ",
    defaultPreventionMm: [
      "ပိုးထိုးခံရပြီး ကြွေကျနေသော အသီးများကို နေ့စဉ်ကောက်ယူ၍ မြေနက်နက်မြှုပ်ခြင်း (သို့) ပလတ်စတစ်အိတ်ပိတ်၍ နေပူလှန်းဖျက်ဆီးပါ။",
      "အသီးနုချိန်တွင် စက္ကူအိတ်/သတင်းစာအိတ်ဖြင့် အသီးအိတ်စွပ်ခြင်း (Fruit bagging) ပြုလုပ်ပါ။",
      "Methyl eugenol (သရက်/သစ်သီး) သို့မဟုတ် Cue-lure (ဘူး/ဖရုံ/သခွား) အဖိုဖမ်းထောင်ချောက်များ ချိတ်ဆွဲပါ။",
    ],
    naturalControlMm:
      "အသီးခိုင်ပတ်လည်တွင် ပင်စိမ်းရွက်ကြိတ်ရည် + ထန်းလျက်ရည် + သဘာဝအချဉ်ဖောက်အစာထောင်ချောက် (Protein/Molasses bait trap) များ ချိတ်ဆွဲဖမ်းယူခြင်းဖြင့် အမယင်များကို လျှော့ချနိုင်ပါသည်။",
    bioPesticideMm:
      "Spinosad ပါဝင်သော Protein bait ကို အပင်အရွက်အချို့ပေါ်သို့ အစက်ချဖျန်းခြင်း (Spot bait spray) ဖြင့် စိုက်ခင်းတစ်ခုလုံး ဆေးဖျန်းစရာမလိုဘဲ ထိန်းချုပ်နိုင်ပါသည်။",
    chemicalBase: {
      activeIngredientInfoMm:
        "အစာထောင်ချောက် (Bait) တွင် Spinosad (သဘာဝအချဉ်ဖောက်အာနိသင်) သို့မဟုတ် စိုက်ပျိုးရေးဌာန ခွင့်ပြုချက်ရ ဆေးဝါးများကိုသာ သုံးစွဲသင့်ပြီး သီးနှံပေါ်တိုက်ရိုက်ဖျန်းမည့် ဓာတုဆေးအတွက် PRB မှတ်ပုံတင်ခွင့်ပြုချက်ကို မဖြစ်မနေ စစ်ဆေးပါ။",
      groupAndModeMm:
        "IRAC Group 5 (Spinosyn bait) — အစာနှင့်အတူ စားသုံးမိသော ယင်ကောင်များကို အာရုံကြောစနစ်မှတစ်ဆင့် နှိမ်နင်းခြင်း",
      targetPestControlMm: "အသီးပေါ် ဥမချမီ အမနှင့် အဖို သီးထိုးယင်အကောင်ကြီး",
      labelDosageAndMethodMm:
        "ဆေးနှုန်းထားကို မခန့်မှန်းပါ — အသီးအိတ်စွပ်ခြင်းနှင့် ဖယ်ရိုမုန်း/အစာထောင်ချောက်ကို ဦးစားပေးပြီး၊ ဆေးသုံးလိုပါက ဆေးဘူးတံဆိပ်ပါ ညွှန်ကြားချက်အတိုင်းသာ အသုံးပြုပါ။",
      sprayTimingAndPrecautionMm:
        "လောက်ကောင် အသီးထဲဝင်သွားပြီးနောက် ဆေးဖျန်း၍ မထိရောက်တော့ပါ — အသီးစကင်းဝင်ချိန်မှစ၍ ထောင်ချောက်နှင့် အိတ်စွပ်စနစ်ကို ကြိုတင်လုပ်ဆောင်ပါ။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "အဖိုဖမ်းထောင်ချောက် + အသီးအိတ်စွပ်ခြင်း + ကြွေသီးကောက်ဖျက်ဆီးခြင်းတို့ကို ပေါင်းစပ်ကျင့်သုံးပါက ဓာတုဆေးလှည့်လည်ဖျန်းရန် လိုအပ်မှုကို များစွာလျှော့ချနိုင်ပါသည်။",
    },
  },
  mites_mealybug: {
    key: "mites_mealybug",
    nameMm: "မွှားပင့်ကူနီနှင့် ဂွမ်းပိုး (Mealybug)",
    englishName: "Spider Mites & Mealybugs",
    scientificName: "Tetranychus spp. / Paracoccus / Phenacoccus spp.",
    severityMm: "အထူးသတိပြုရန်",
    imageUrl: "/src/assets/images/pest_mites_mealybug_1795419243282.jpg",
    imageAltMm: "အပင်ပင်စည်နှင့် ရွက်ရိုးတံပေါ်တွင် စုဝေးနေသော အဖြူရောင်ဂွမ်းပိုးများ ဓာတ်ပုံ",
    defaultPreventionMm: [
      "ပိုးကပ်နေသော မျိုးပွားကိုင်း/သားတက်/မျိုးဥများကို စိုက်ပျိုးရာတွင် လုံးဝအသုံးမပြုပါနှင့်။",
      "ဂွမ်းပိုးကို သယ်ဆောင်ကာကွယ်ပေးတတ်သော ပုရွက်ဆိတ်များ၏ လမ်းကြောင်းကို ရှင်းလင်းထိန်းချုပ်ပါ။",
      "ခြောက်သွေ့ဖုန်ထူသော ရာသီတွင် အရွက်များပေါ်သို့ ရေသန့်ဖြင့် မကြာခဏ ဆေးကြောဖျန်းပေးပါ။",
    ],
    naturalControlMm:
      "ဂွမ်းပိုး၏ ဖယောင်းအလွှာပျော်ဝင်စေရန် ဆပ်ပြာမှုန့်အပျော့စား + တမာဆီရောစပ်ရည်ကို ဖိအားကောင်းကောင်းဖြင့် ပင်စည်နှင့် အရွက်အောက်သို့ ဖျန်းပေးပါ။ မွှားနီအတွက် Wettable sulfur ဖျော်ရည် (နေအေးချိန်) ကို အသုံးပြုနိုင်ပါသည်။",
    bioPesticideMm:
      "မိတ်ဆွေဂွမ်းပိုးစားကျိုင်း (Cryptolaemus montrouzieri) နှင့် Beauveria bassiana / Lecanicillium ဇီဝမှိုဆေးများကို စိုထိုင်းဆရှိချိန် ဖျန်းပေးနိုင်ပါသည်။",
    chemicalBase: {
      activeIngredientInfoMm:
        "မွှားပင့်ကူနီအတွက် Abamectin သို့မဟုတ် Spiromesifen/Hexythiazox၊ ဂွမ်းပိုးအတွက် Spirotetramat/Buprofezin ကဲ့သို့ Active Ingredient အုပ်စုများ ရှိသော်လည်း သက်ဆိုင်ရာသီးနှံခွင့်ပြုချက်အတွက် PRB မှတ်ပုံတင်တံဆိပ်ကို စစ်ဆေးပါ။",
      groupAndModeMm:
        "IRAC Group 6 (Abamectin - မွှားသတ်အာနိသင်) / Group 23 (Tetronic acid - ဥနှင့်အကောင်ငယ်ကြီးထွားမှု ဟန့်တားဆေး) / Group 16",
      targetPestControlMm: "မွှားပင့်ကူနီ (ဥ/အကောင်ငယ်/ကြီး) နှင့် ဂွမ်းပိုးအကောင်ငယ် (Crawler) အဆင့်",
      labelDosageAndMethodMm:
        "ဆေးနှုန်းထားကို မခန့်မှန်းပါ — ရိုးရိုးပိုးသတ်ဆေးအများစုသည် မွှားနီကို မသေစေဘဲ ပိုမိုပွားစေတတ်သဖြင့် မွှားသတ်ဆေး (Acaricide/Miticide) အဖြစ် မှတ်ပုံတင်ထားသော ဆေးဘူးညွှန်ကြားချက်အတိုင်းသာ သုံးပါ။",
      sprayTimingAndPrecautionMm:
        "မွှားနီသည် အရွက်အောက်တွင်နေသဖြင့် အပေါ်မှဖျန်းရုံဖြင့် မထိရောက်ပါ။ ဆာလ်ဖာနှင့် ဆီအခြေခံဆေးများကို နေပူပြင်းချိန် မဖျန်းပါနှင့် (အရွက်လောင်တတ်သည်)။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "မွှားပင့်ကူနီသည် မျိုးဆက်တိုသဖြင့် Group 6 နှင့် Group 23 သို့မဟုတ် Group 10A တို့ကို ၁ ကြိမ်စီ အလှည့်ကျ လှည့်လည်သုံးစွဲပါ။",
    },
  },
  caterpillar_armyworm: {
    key: "caterpillar_armyworm",
    nameMm: "ရွက်စားခူကောင်နှင့် စစ်ပိုး (ငမြှောင်တောင်)",
    englishName: "Armyworm & Leaf-eating Caterpillars",
    scientificName: "Spodoptera frugiperda / Spodoptera litura",
    severityMm: "အထူးသတိပြုရန်",
    imageUrl: "/src/assets/images/pest_armyworm_1795418937470.jpg",
    imageAltMm: "အပင်ရွက်အပြင်လွှာကို ကိုက်စားနေသော အစင်းကြောင်းပါ စစ်ပိုးလောက်ကောင် ဓာတ်ပုံ",
    defaultPreventionMm: [
      "အရွက်အောက်မျက်နှာပြင်ရှိ အမွှေးနုဖုံး ဥအစုအဝေးများနှင့် စုဝေးနေသော ကောင်ပေါက်လေးများကို လက်ဖြင့် ဖယ်ရှားဖျက်ဆီးပါ။",
      "စိုက်ခင်းဘေးပတ်လည်ရှိ ပေါင်းမြက်ခင်းများကို ရှင်းလင်း၍ ဖယ်ရိုမုန်းထောင်ချောက်များ ထားရှိပါ။",
      "ငှက်နားတန်းများ စိုက်ထူပေးခြင်းဖြင့် သဘာဝငှက်များက ခူကောင်စားသောက်စေပါ။",
    ],
    naturalControlMm:
      "အပင်ဗဟိုအဖူးထဲ (ဥပမာ- ပြောင်းခေါင်/ဂေါ်ဖီခေါင်) မဝင်မီ ဆပ်ပြာရည် + တမာဆီ (သို့) သစ်ပြာမှုန့်/သဲနှင့် ထုံးအနည်းငယ် (ပြောင်းဗဟိုအဖူးထဲ ချပေးခြင်း) ဖြင့် လောက်ကောင်ငယ်များကို ဟန့်တားနိုင်ပါသည်။",
    bioPesticideMm:
      "ဥမှပေါက်ခါစ လောက်ကောင်ငယ်အဆင့်တွင် Bt (Bacillus thuringiensis) သို့မဟုတ် Spodoptera NPV ဗိုင်းရပ်စ်ဇီဝပိုးသတ်ဆေးကို ညနေစောင်းတွင် ဖျန်းပေးပါ။",
    chemicalBase: {
      activeIngredientInfoMm:
        "Spinetoram၊ Emamectin benzoate သို့မဟုတ် Chlorantraniliprole ကဲ့သို့ Active Ingredient အုပ်စုများ ရှိသော်လည်း သက်ဆိုင်ရာသီးနှံအတွက် PRB မှတ်ပုံတင်ခွင့်ပြုချက် ရှိ/မရှိ ဆေးဘူးတံဆိပ်တွင် မဖြစ်မနေ စစ်ဆေးပါ။",
      groupAndModeMm:
        "IRAC Group 5 (Spinosyns) / Group 6 (Avermectins) / Group 28 (Diamides) — ထိသေနှင့် စားသေအာနိသင်",
      targetPestControlMm: "ရွက်စားခူကောင်ငယ်နှင့် စစ်ပိုး (ငမြှောင်တောင်) လောက်ကောင်အဆင့်",
      labelDosageAndMethodMm:
        "ဆေးနှုန်းထားကို မခန့်မှန်းပါ — မှတ်ပုံတင်ဆေးဘူးတံဆိပ်ပါ ညွှန်ကြားချက်အတိုင်း ဖျော်စပ်၍ ညနေစောင်းပိုးထွက်စားချိန်တွင် အပင်အဖူးနှင့် အရွက်အောက်ဘက်ထိအောင် ဖျန်းပါ။",
      sprayTimingAndPrecautionMm:
        "စစ်ပိုးကောင်ကြီးများသည် နေ့ခင်း၌ မြေခဲအောက်တွင် ပုန်းအောင်းပြီး ညအချိန်မှ တက်စားတတ်သဖြင့် နေ့လယ်ပူချိန် ဆေးဖျန်းခြင်းသည် မထိရောက်ပါ — ညနေစောင်းတွင်သာ ဖျန်းပါ။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "လောက်ကောင်မျိုးဆက်တစ်ခုစီတိုင်းတွင် Bt (Group 11A)၊ Group 5၊ Group 6 နှင့် Group 28 တို့ကို အလှည့်ကျ လှည့်လည်သုံးစွဲမှသာ ဆေးယဉ်ပါးမှု မဖြစ်ပေါ်ပါ။",
    },
  },
  cutworm: {
    key: "cutworm",
    nameMm: "ပင်စည်ဖြတ်ပိုး (မြေအောင်းခူကောင်)",
    englishName: "Cutworm",
    scientificName: "Agrotis ipsilon / Agrotis spp.",
    severityMm: "အထူးသတိပြုရန်",
    imageUrl: "/src/assets/images/pest_cutworm_1795418937415.jpg",
    imageAltMm: "အပင်ခြေမြေကြီးထဲတွင် ခွေနေသော ပင်စည်ဖြတ်ပိုး ဓာတ်ပုံ",
    defaultPreventionMm: [
      "မစိုက်ပျိုးမီ ၂-၃ ပတ်အလိုတွင် ထယ်ရေးနက်နက်ထိုး၍ နေလှန်းခြင်းဖြင့် မြေအောင်းပိုးများ ဖျက်ဆီးပါ။",
      "မဆွေးမြေ့သေးသော နွားချေးအစိမ်း မထည့်ဘဲ ကောင်းစွာဆွေးမြေ့သော မြေဆွေးကိုသာ ထည့်ပါ။",
      "ပျိုးပင်ငယ်များ ပင်ခြေတွင် ဝါးဆစ်/ပလတ်စတစ်ဗူးခွံကွင်း စွပ်၍ ကာကွယ်ပါ။",
    ],
    naturalControlMm:
      "နံနက်စောစော ပြတ်ကျနေသော အပင်ခြေမြေအနက် ၁-၂ လက်မကို ဖော်၍ လောက်ကောင်ကို လက်ဖြင့်ကောက်ယူဖျက်ဆီးပါ။ မြေပြင်ချိန် တမာကြိတ်ဖတ် (Neem cake) ထည့်သွင်းပါ။",
    bioPesticideMm:
      "မြေအောင်းပိုးကာကွယ်ရန် Metarhizium anisopliae ဇီဝမှိုဆေး သို့မဟုတ် Entomopathogenic nematodes (EPN) ကို မြေအစိုဓာတ်ရှိချိန် အပင်ခြေမြေသို့ ဖျန်းလောင်းနိုင်ပါသည်။",
    chemicalBase: {
      activeIngredientInfoMm:
        "မြေအောင်းပင်စည်ဖြတ်ပိုးအတွက် စိုက်ပျိုးရေးဌာန ခွင့်ပြုချက်ရ Granular သို့မဟုတ် မြေဖျန်း/အပင်ခြေလောင်းဆေး (PRB တရားဝင်မှတ်ပုံတင်ပြီးသော Active Ingredient) ကိုသာ ရွေးချယ်အသုံးပြုရပါမည်။",
      groupAndModeMm:
        "ထိသေနှင့် အစာအိမ်အာနိသင် — ညအချိန် မြေပေါ်တက်၍ ပင်စည်ကိုက်ဖြတ်ချိန်တွင် ထိတွေ့နှိမ်နင်းခြင်း",
      targetPestControlMm: "မြေအောင်းခိုအောင်းနေသော ပင်စည်ဖြတ်ပိုး လောက်ကောင်",
      labelDosageAndMethodMm:
        "ဆေးနှုန်းထားကို မခန့်မှန်းပါ — အပင်ငယ် ၅-၁၀% ကျော် ပျက်စီးမှသာ မှတ်ပုံတင်ဆေးဘူးညွှန်ကြားချက်အတိုင်း ညနေပိုင်းတွင် အပင်ခြေမြေစပ်သို့ အသုံးပြုပါ။",
      sprayTimingAndPrecautionMm:
        "နေ့ခင်း၌ မြေအောက်တွင် နေသဖြင့် ညနေစောင်း အစာထွက်စားခါနီးအချိန်တွင်သာ ဆောင်ရွက်ပါ။ မြေတွင်းရေသန့်နှင့် ညစ်ညမ်းမှု မဖြစ်စေရန် ဂရုပြုပါ။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "မြေပြင်ချိန် ထယ်ရေးနေလှန်းခြင်းနှင့် တမာကြိတ်ဖတ်သုံးခြင်းတို့ဖြင့် ပေါင်းစပ်၍ အုပ်စုတူဓာတုဆေး ထပ်ခါတလဲလဲ မသုံးပါနှင့်။",
    },
  },
  leaf_beetle_weevil: {
    key: "leaf_beetle_weevil",
    nameMm: "ရွက်ဖောက်ကျိုင်းနှင့် ပင်စည်/ဥထိုးကျိုင်း",
    englishName: "Flea Beetle / Leaf Beetle / Weevil",
    scientificName: "Phyllotreta / Aulacophora / Cylas / Cosmopolites spp.",
    severityMm: "သတိထားရန်",
    imageUrl: "/src/assets/images/pest_flea_beetles_1795418936891.jpg",
    imageAltMm: "အရွက်နုပေါ်တွင် အပေါက်ဝိုင်းသေးသေးများ ဖောက်စားနေသော ကျိုင်းကောင် ဓာတ်ပုံ",
    defaultPreventionMm: [
      "သီးနှံဟောင်းအကြွင်းအကျန်နှင့် ပေါင်းမြက်များကို ရိတ်သိမ်းပြီးချိန် ချက်ချင်းရှင်းလင်း၍ သီးလှည့်စိုက်ပါ။",
      "ပျိုးပင်ငယ်စဉ် ဇကာပါးအုပ်ခြင်း (သို့) မျိုးပွားပစ္စည်း (သားတက်/နွယ်ကိုင်း) ပိုးကင်းစင်အောင် ရွေးချယ်စိုက်ပါ။",
      "မြေအက်ကွဲကြောင်းများ မဖြစ်စေရန် မြေတောင်မြှောက်ဖုံးအုပ်ပေးပါ။",
    ],
    naturalControlMm:
      "အပင်ငယ်အရွက်ပေါ်တွင် သစ်ပြာမှုန့် (Wood ash) ပါးပါးဖြူးခြင်း (သို့) ကြက်သွန်ဖြူ + ငရုတ်သီး + တမာဆီ သဘာဝဖျော်ရည် ဖျန်းပေးခြင်းဖြင့် ကျိုင်းကောင်များ မလာစေရန် ဟန့်တားနိုင်ပါသည်။",
    bioPesticideMm:
      "မြေတွင်း/ပင်ခြေကျိုင်းပိုးများအတွက် Beauveria bassiana သို့မဟုတ် Metarhizium anisopliae ဇီဝမှိုဆေးကို အပင်ခြေနှင့် ဖယ်ရိုမုန်းထောင်ချောက်တို့နှင့် တွဲဖက်အသုံးပြုနိုင်ပါသည်။",
    chemicalBase: {
      activeIngredientInfoMm:
        "ကျိုင်းကောင်အတွက် မှတ်ပုံတင်ခွင့်ပြုချက်ရ Active Ingredient (စိုက်ပျိုးရေးဦးစီးဌာန လမ်းညွှန်ချက်ပါ PRB မှတ်ပုံတင်ဆေး) ကိုသာ သက်ဆိုင်ရာသီးနှံအလိုက် စစ်ဆေးရွေးချယ်ပါ။",
      groupAndModeMm:
        "ထိသေနှင့် စားသေအာနိသင် — အပင်ရွက်နှင့် ပင်ခြေတက်စားသည့် ကျိုင်းကောင်ကြီးများကို ထိန်းချုပ်ခြင်း",
      targetPestControlMm: "ရွက်စားကျိုင်းကောင်ကြီးနှင့် မြေစပ်ပင်ခြေကျိုင်း",
      labelDosageAndMethodMm:
        "ဆေးနှုန်းထားကို မခန့်မှန်းပါ — အပင်ငယ်စဉ် ပျက်စီးမှုများမှသာ ဆေးဘူးတံဆိပ်ပါ ညွှန်ကြားချက်အတိုင်း အတိအကျ အသုံးပြုပါ။",
      sprayTimingAndPrecautionMm:
        "ပန်းပွင့်ချိန် မိတ်ဆွေပျားများ မထိခိုက်စေရန် ညနေပိုင်းတွင်သာ ဖျန်းပါ။ အသီး/ဥ ရိတ်သိမ်းခါနီးတွင် ဆေးသုံးခြင်း ရှောင်ကြဉ်ပါ။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "စိုက်ပျိုးနည်းစနစ် (သီးလှည့်/မြေဖုံး/ထောင်ချောက်) ကို အဓိကထား၍ ဓာတုဆေးလိုအပ်ပါက မတူညီသော IRAC အုပ်စုများကို အလှည့်ကျ ပြောင်းသုံးပါ။",
    },
  },
  rhinoceros_trunk_borer: {
    key: "rhinoceros_trunk_borer",
    nameMm: "ကြံ့ချိုကျိုင်းနှင့် ပင်စည်ထွင်းဖောက်ပိုး",
    englishName: "Rhinoceros Beetle & Trunk Borer",
    scientificName: "Oryctes rhinoceros / Xylotrechus / Batocera spp.",
    severityMm: "အထူးသတိပြုရန်",
    imageUrl: "/src/assets/images/pest_beetle_borer_1795419243142.jpg",
    imageAltMm: "အပင်ပင်စည်/အုန်းလက်ခြေရင်း၌ ဖောက်ထွင်းနေသော ကြံ့ချိုကျိုင်း ဓာတ်ပုံ",
    defaultPreventionMm: [
      "ခြံအတွင်းရှိ ဆွေးမြေ့နေသော ပင်စည်တုံးဟောင်းများနှင့် နွားချေးပုံဟောင်းများ (ကြံ့ချိုကျိုင်းဥချပေါက်ပွားရာ) ကို ရှင်းလင်းပါ။",
      "အပင်ထိပ်ဖူးနှင့် ပင်စည်အောက်ခြေကို လစဉ်ပုံမှန် စစ်ဆေး၍ ပိုးထွင်းပေါက် တွေ့ပါက သံချိတ်ဖြင့် ကလော်ထုတ်ဖယ်ရှားပါ။",
      "ဖယ်ရိုမုန်းထောင်ချောက် (Oryctalure bucket trap) များ ခြံအတွင်း ချိတ်ဆွဲဖမ်းယူပါ။",
    ],
    naturalControlMm:
      "ပင်စည်/အုန်းလက်ကြားတွင် တမာကြိတ်ဖတ် (Neem cake) + သဲနု ဆတူရော၍ ထည့်ပေးခြင်းဖြင့် ကျိုင်းကောင်များ ထိပ်ဖူးထဲ မဖောက်ဝင်အောင် ဟန့်တားနိုင်ပါသည်။",
    bioPesticideMm:
      "မြေဆွေးပုံနှင့် ပင်စည်ဆွေးနေရာများတွင် Metarhizium anisopliae (Green muscardine fungus) ဇီဝမှိုဆေး ဖျန်းပေးခြင်းဖြင့် ကျိုင်းလောက်ကောင်များကို သဘာဝအတိုင်း သေစေနိုင်ပါသည်။",
    chemicalBase: {
      activeIngredientInfoMm:
        "နှစ်ရှည်ပင် ထွင်းဖောက်ကျိုင်းအတွက် စိုက်ပျိုးရေးဦးစီးဌာန ထောက်ခံချက်နှင့် PRB မှတ်ပုံတင်ခွင့်ပြုချက်ရ ပိုးသတ်ဆေးကိုသာ စစ်ဆေးအသုံးပြုရပါမည်။",
      groupAndModeMm:
        "ထိသေ/အငွေ့ပျံအာနိသင် (Spot treatment inside bore holes) — ပင်စည်ထွင်းပေါက်အတွင်း ခိုအောင်းနေသော ပိုးကို ထိန်းချုပ်ခြင်း",
      targetPestControlMm: "ထွင်းဖောက်ကျိုင်းလောက်ကောင်နှင့် အကောင်ကြီး",
      labelDosageAndMethodMm:
        "ဆေးနှုန်းထားကို မခန့်မှန်းပါ — မှတ်ပုံတင်ဆေးဘူးညွှန်ကြားချက်အတိုင်း အသုံးပြု၍ ထွင်းပေါက်အတွင်း ဂွမ်းစဖြင့်ထည့်ပြီး ရွှံ့စေးဖြင့် ပိတ်ပေးရပါသည်။",
      sprayTimingAndPrecautionMm:
        "ပင်စည်တစ်ပင်လုံးကို အပေါ်ယံမှ ဖျန်းရုံဖြင့် အတွင်းရှိပိုးကို မထိရောက်ပါ — အပင်စစ်ဆေး၍ ပိုးပေါက်တွေ့သော အပင်ကိုသာ ကုသပါ။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "ဖယ်ရိုမုန်းထောင်ချောက် + Metarhizium ဇီဝမှိုဆေး + မြေဆွေးပုံရှင်းလင်းရေးတို့ကို ပေါင်းစပ်၍ ဓာတုဆေးအားကိုးမှု လျှော့ချပါ။",
    },
  },
  tea_mosquito_mirid_bug: {
    key: "tea_mosquito_mirid_bug",
    nameMm: "ခြင်ကောင်တူစုပ်စားပိုး (Mirid / Tea Mosquito Bug)",
    englishName: "Tea Mosquito Bug / Mirid Bug",
    scientificName: "Helopeltis theivora / Helopeltis antonii",
    severityMm: "အထူးသတိပြုရန်",
    imageUrl: "/src/assets/images/pest_tea_mosquito_bug_1795419242610.jpg",
    imageAltMm: "အညွန့်နုနှင့် အရွက်နုပေါ် နား၍ စုပ်စားနေသော ခြင်ကောင်တူစုပ်စားပိုး ဓာတ်ပုံ",
    defaultPreventionMm: [
      "အရိပ်ထူထပ်လွန်းပါက စိုထိုင်းဆများ၍ ပိုးပွားလွယ်သဖြင့် အရိပ်ပင်ကိုင်းချိုင် အလင်းရောင်ဝင်အောင် ထိန်းညှိပါ။",
      "ပိုးကျနေသော အညွန့်ခြောက်နှင့် ပေါင်းမြက်များကို ချိုင်ယူရှင်းလင်းပါ။",
      "အညွန့်သစ်ထွက်ချိန်နှင့် အဖူးထွက်ချိန်တွင် ၂ ပတ်တစ်ကြိမ် ခြံအတွင်း စစ်ဆေးပါ။",
    ],
    naturalControlMm:
      "တမာဆီ (Azadirachtin) နှင့် ပဲပုပ်/ဆပ်ပြာရည်အပျော့စားကို နံနက်စောစော ပိုးလှုပ်ရှားမှုနှေးချိန်တွင် အညွန့်နုများထိအောင် ဖျန်းပေးပါ။",
    bioPesticideMm:
      "Beauveria bassiana ဇီဝမှိုပိုးသတ်ဆေးကို မိုးအုံ့ချိန် သို့မဟုတ် ညနေပိုင်း စိုထိုင်းဆရှိချိန်တွင် ဖျန်းပေးနိုင်ပါသည်။",
    chemicalBase: {
      activeIngredientInfoMm:
        "စုပ်စားပိုးများအတွက် Clothianidin/Thiamethoxam သို့မဟုတ် Lambda-cyhalothrin ကဲ့သို့ အာနိသင်များကို ညွှန်းဆိုလေ့ရှိသော်လည်း သီးနှံ (လက်ဖက်/သီဟိုဠ်/ကော်ဖီ) အတွက် PRB မှတ်ပုံတင်ခွင့်ပြုချက် ရှိ/မရှိ မဖြစ်မနေ စစ်ဆေးပါ။",
      groupAndModeMm:
        "IRAC Group 4A (Neonicotinoid) သို့မဟုတ် Group 3A (Pyrethroid) — ထိသေနှင့် ပင်လုံးပြန့်အာနိသင်",
      targetPestControlMm: "အညွန့်နုနှင့် အသီး/အဖူးနု စုပ်စားသော အကောင်ငယ် (Nymph) နှင့် အကောင်ကြီး",
      labelDosageAndMethodMm:
        "ဆေးနှုန်းထားကို မခန့်မှန်းပါ — အထူးသဖြင့် လက်ဖက်ကဲ့သို့ အရွက်ခူးသီးနှံများတွင် ဆေးဘူးတံဆိပ်ပါ နှုန်းထားနှင့် ခူးဆွတ်ချိန်ကန့်သတ်ချက်ကို တိကျစွာ လိုက်နာပါ။",
      sprayTimingAndPrecautionMm:
        "နံနက်စောစော နေမပူမီ (သို့) ညနေစောင်းတွင် ဖျန်းပါ။ ပန်းပွင့်ချိန် ဝတ်မှုန်ကူးပျားများ မထိခိုက်စေရန် ဂရုပြုပါ။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "တမာဆီ၊ ဇီဝမှိုဆေးနှင့် မတူညီသော IRAC အုပ်စုများကို အလှည့်ကျ လှည့်လည်သုံးစွဲပါ။",
    },
  },
  cabbage_worm_looper: {
    key: "cabbage_worm_looper",
    nameMm: "ဂေါ်ဖီလိပ်ပြာလောက်ကောင်နှင့် ရွက်စားလောက်ကောင်",
    englishName: "Cabbage Worm & Leaf Caterpillar",
    scientificName: "Pieris rapae / Trichoplusia ni",
    severityMm: "အထူးသတိပြုရန်",
    imageUrl: "/src/assets/images/pest_cabbage_worm_1795418937812.jpg",
    imageAltMm: "အရွက်စိမ်းကို ကိုက်စားနေသော အစိမ်းရောင်လောက်ကောင် ဓာတ်ပုံ",
    defaultPreventionMm: [
      "ပျိုးခင်းနှင့် စိုက်ခင်းငယ်စဉ်တွင် ပိုးကာဇကာ (Insect net) အုပ်၍ လိပ်ပြာဥမချနိုင်အောင် တားဆီးပါ။",
      "မျိုးနွယ်တူမဟုတ်သော သီးနှံများနှင့် သီးလှည့်စိုက်ပျိုးပါ။",
      "အရွက်အောက်မျက်နှာပြင်ရှိ ဥနှင့် ကောင်ငယ်များကို ပုံမှန်စစ်ဆေးဖယ်ရှားပါ။",
    ],
    naturalControlMm:
      "တမာဆီ (Neem oil) နှင့် ကြက်သွန်ဖြူ-ငရုတ်ဖျော်ရည်ကို ညနေပိုင်းတွင် အရွက်အထက်အောက် နှံ့စပ်အောင် ဖျန်းပေးပါ။",
    bioPesticideMm:
      "ဘီတီ (Bt - Bacillus thuringiensis) ဇီဝပိုးသတ်ဆေးကို လောက်ကောင်ငယ်အဆင့်တွင် ညနေပိုင်း ဖျန်းပေးခြင်းဖြင့် မိတ်ဆွေပိုးများ မထိခိုက်ဘဲ ထိန်းချုပ်နိုင်ပါသည်။",
    chemicalBase: {
      activeIngredientInfoMm:
        "Spinosad သို့မဟုတ် Emamectin benzoate အုပ်စုဝင် Active Ingredient များကို ညွှန်းဆိုလေ့ရှိသော်လည်း သက်ဆိုင်ရာသီးနှံအတွက် PRB တရားဝင်မှတ်ပုံတင်ခွင့်ပြုချက်ကို ဆေးဘူးတံဆိပ်တွင် စစ်ဆေးပါ။",
      groupAndModeMm:
        "IRAC Group 5 (Spinosyns) သို့မဟုတ် Group 6 (Avermectins) — စားသေနှင့် ထိသေအာနိသင်",
      targetPestControlMm: "အရွက်ကိုက်စားသော လောက်ကောင်ငယ် (Early-instar larvae)",
      labelDosageAndMethodMm:
        "ဆေးနှုန်းထားကို မခန့်မှန်းပါ — တရားဝင်မှတ်ပုံတင် ဆေးဘူးတံဆိပ်ပါ ညွှန်ကြားချက်အတိုင်းသာ ဖျော်စပ်အသုံးပြုပါ။",
      sprayTimingAndPrecautionMm:
        "လောက်ကောင်ငယ်အဆင့်တွင် ညနေပိုင်း ဖျန်းပါ။ စားသုံးဟင်းသီးဟင်းရွက်ဖြစ်၍ ရိတ်သိမ်းခါနီး စောင့်ဆိုင်းရက် မပြည့်မီ မသုံးပါနှင့်။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "Bt (Group 11A) နှင့် Group 5 / Group 6 တို့ကို အလှည့်ကျ လှည့်လည်သုံးစွဲပါ။",
    },
  },
  diamondback_moth: {
    key: "diamondback_moth",
    nameMm: "ကျောက်စိမ်းကျောပိုးဖလံ (Diamondback Moth)",
    englishName: "Diamondback Moth",
    scientificName: "Plutella xylostella",
    severityMm: "အထူးသတိပြုရန်",
    imageUrl: "/src/assets/images/pest_diamondback_moth_1795418937593.jpg",
    imageAltMm: "အရွက်ပေါ်တွင် မှန်ပြတင်းပေါက်ပုံစံ စားသောက်နေသော ကျောက်စိမ်းကျောပိုးဖလံ ဓာတ်ပုံ",
    defaultPreventionMm: [
      "မုန်ညင်းဝါကို ထောင်ချောက်သီးနှံ (Trap crop) အဖြစ် စိုက်တန်းကြားတွင် ကြားညှပ်စိုက်ပါ။",
      "ညနေစောင်း ရေပန်းဖြန်းစနစ် (Sprinkler) သုံး၍ ဖလံဥချမှု အနှောင့်အယှက်ဖြစ်စေပါ။",
      "ဖယ်ရိုမုန်းထောင်ချောက်ဖြင့် ဖလံဝင်ရောက်မှု စောင့်ကြည့်ပါ။",
    ],
    naturalControlMm:
      "တမာဆီ (Azadirachtin) နှင့် ဆပ်ပြာရည်အပျော့စားကို အရွက်အောက်မျက်နှာပြင်ထိအောင် ဖျန်းပေးပါ။",
    bioPesticideMm:
      "Bt (Bacillus thuringiensis var. kurstaki / aizawai) ဇီဝပိုးသတ်ဆေးကို လောက်ကောင်ငယ်အဆင့်၌ ညနေပိုင်း ဖျန်းပေးပါ။",
    chemicalBase: {
      activeIngredientInfoMm:
        "Diamondback moth သည် ဆေးယဉ်ပါးမှုမြန်သဖြင့် PRB မှတ်ပုံတင်ခွင့်ပြုချက်ရ မတူညီသော IRAC အုပ်စုဝင် Active Ingredient (ဥပမာ- Chlorfenapyr / Spinetoram / Indoxacarb စသည်ဖြင့် မှတ်ပုံတင်စစ်ဆေးပြီးမှ) ရွေးချယ်ရပါမည်။",
      groupAndModeMm:
        "IRAC Group 13 / Group 5 / Group 22A — အရွက်အတွင်း ဝင်ရောက်စားသောက်သော လောက်ကောင်ငယ်များကို ထိန်းချုပ်ခြင်း",
      targetPestControlMm: "လောက်ကောင်ငယ် (1st–2nd instar) အဆင့်",
      labelDosageAndMethodMm:
        "ဆေးနှုန်းထားကို မခန့်မှန်းပါ — ဆေးဘူးတံဆိပ်ပါ ညွှန်ကြားချက်အတိုင်း အရွက်အောက်ဘက်ထိအောင် ဖျန်းပါ။",
      sprayTimingAndPrecautionMm:
        "တူညီသော ဆေးအုပ်စုကို ၂ ကြိမ်ဆက်တိုက် မဖျန်းပါနှင့်။ ညနေစောင်းတွင်သာ ဆောင်ရွက်ပါ။",
      ppeRequiredMm: PRB_VERIFICATION_PPE_STANDARD,
      moaRotationMm:
        "Bt (Group 11A) နှင့် မတူညီသော IRAC အုပ်စုများကို ရက်သတ္တပတ် ၃ ပတ်ခြား မျိုးဆက်တစ်ခုစီအလိုက် လှည့်လည်အသုံးပြုရန် အရေးကြီးပါသည်။",
    },
  },
};
