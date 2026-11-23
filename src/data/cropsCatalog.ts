import type { CropFertilizerProfile, CropGuideProfile } from "../types/farm";
import { CROPS_PART_1 } from "./crops40Part1";
import { CROPS_PART_2 } from "./crops40Part2";
import { CRUCIFER_CROPS } from "./cruciferCropsAndPests";

export const EXTENDED_CROP_FERTILIZER_PROFILES: CropFertilizerProfile[] = [
  {
    key: "sunflower",
    nameMm: "နေကြာ (ဆီထွက်နေကြာ)",
    shortDescMm: "အစေ့အဆန်နှင့် ဆီထွက်နှုန်းကောင်းရန် ဖော့စဖိတ်နှင့် ဘိုရွန်/ပိုတက်ရှ် အရေးကြီးသည်",
    basePerAcreKg: { urea: 30, tSuper: 25, potash: 15, compostCarts: 3 },
    scheduleMm: [
      {
        stageMm: "၁။ မြေခံ",
        timingMm: "မြေပြုပြင်ချိန်",
        ratioNoteMm: "တီစူပါ ၁၀၀% + ပိုတက်ရှ် ၁၀၀% + ယူရီးယား ၅၀% + သဘာဝမြေဆွေး",
      },
      {
        stageMm: "၂။ အပွင့်ခေါင်းဖွဲ့ချိန်",
        timingMm: "စိုက်ပြီး ၂၅ - ၃၀ ရက်သား",
        ratioNoteMm: "ကျန်ယူရီးယား ၅၀% ကို အပင်ခြေမြေဖုံး၍ ထည့်ပါ",
      },
    ],
  },
  {
    key: "cotton",
    nameMm: "ဝါ (ချည်မျှင်ရှည်ဝါ / မိုးဝါ)",
    shortDescMm: "အသီးကင်းတင်မှုနှင့် ဂွမ်းအရည်အသွေးကောင်းရန် မြေခံနှင့် ပန်းပွင့်ချိန် ခွဲကျွေးရသည်",
    basePerAcreKg: { urea: 40, tSuper: 25, potash: 25, compostCarts: 4 },
    scheduleMm: [
      {
        stageMm: "၁။ မြေခံ",
        timingMm: "စိုက်ကြောင်းဆွဲချိန်",
        ratioNoteMm: "တီစူပါ ၁၀၀% + ပိုတက်ရှ် ၅၀% + ယူရီးယား ၃၅% + မြေဆွေး",
      },
      {
        stageMm: "၂။ အဖူးအပွင့်စဝင်ချိန်",
        timingMm: "စိုက်ပြီး ၃၅ - ၄၀ ရက်သား",
        ratioNoteMm: "ယူရီးယား ၃၅% + ပိုတက်ရှ် ၅၀%",
      },
      {
        stageMm: "၃။ ဝါသီးဖွံ့ဖြိုးချိန်",
        timingMm: "စိုက်ပြီး ၆၀ - ၆၅ ရက်သား",
        ratioNoteMm: "ကျန်ယူရီးယား ၃၀% (လိုအပ်ပါက)",
      },
    ],
  },
  {
    key: "black_gram",
    nameMm: "မတ်ပဲ",
    shortDescMm: "မြစ်ဖုမှ နိုက်ထရိုဂျင်ဖမ်းယူနိုင်သဖြင့် မြေခံဖော့စဖိတ်နှင့် ပိုတက်ရှ် အဓိကလိုအပ်သည်",
    basePerAcreKg: { urea: 12.5, tSuper: 25, potash: 12.5, compostCarts: 3 },
    scheduleMm: [
      {
        stageMm: "၁။ မြေခံ",
        timingMm: "မျိုးစေ့မချမီ ထယ်ရေးပြင်ချိန်",
        ratioNoteMm: "ယူရီးယား ၁၀၀% + တီစူပါ ၁၀၀% + ပိုတက်ရှ် ၁၀၀% + မြေဆွေး",
      },
      {
        stageMm: "၂။ ပန်းပွင့်စချိန်",
        timingMm: "စိုက်ပြီး ၃၀ ရက်သား",
        ratioNoteMm: "သဘာဝမြေဩဇာရည် / အားဆေး ရွက်ဖျန်းပံ့ပိုးပါ",
      },
    ],
  },
  {
    key: "green_gram",
    nameMm: "ပဲတီစိမ်း",
    shortDescMm: "သက်တမ်းတိုပဲမျိုးဖြစ်၍ အစပိုင်းအပင်ပေါက်အားကောင်းရန် မြေခံပြည့်စုံရန် လိုသည်",
    basePerAcreKg: { urea: 12.5, tSuper: 25, potash: 12.5, compostCarts: 3 },
    scheduleMm: [
      {
        stageMm: "၁။ မြေခံ",
        timingMm: "စိုက်ပျိုးမည့်မြေပြင်ချိန်",
        ratioNoteMm: "ယူရီးယား + တီစူပါ + ပိုတက်ရှ် အားလုံးကို မြေခံထည့်ပါ",
      },
      {
        stageMm: "၂။ အပွင့်အသီးတင်ချိန်",
        timingMm: "စိုက်ပြီး ၂၅ - ၃၀ ရက်သား",
        ratioNoteMm: "EM / ငါးအမိုင်နို သဘာဝရွက်ဖျန်းရည် ဖျန်းပေးပါ",
      },
    ],
  },
  {
    key: "chickpea",
    nameMm: "ကုလားပဲ (ဆောင်းသီးနှံ)",
    shortDescMm: "မြေအစိုဓာတ်ကျန်ချိန် စိုက်ရသဖြင့် မြေခံတီစူပါနှင့် မြေဆွေး အရေးပါသည်",
    basePerAcreKg: { urea: 10, tSuper: 25, potash: 12.5, compostCarts: 3 },
    scheduleMm: [
      {
        stageMm: "၁။ မြေခံ",
        timingMm: "စပါးရိတ်ပြီး ထယ်ရေးပြင်ချိန်",
        ratioNoteMm: "ယူရီးယား ၁၀၀% + တီစူပါ ၁၀၀% + ပိုတက်ရှ် ၁၀၀% + မြေဆွေး",
      },
    ],
  },
  {
    key: "chili",
    nameMm: "ငရုတ် (မိုးငရုတ် / ဆောင်းငရုတ်)",
    shortDescMm: "အသီးခူးကာလရှည်သဖြင့် အကြိမ်ခွဲကျွေးခြင်းနှင့် ပိုတက်ရှ်လုံလောက်မှု အရေးကြီးသည်",
    basePerAcreKg: { urea: 50, tSuper: 35, potash: 35, compostCarts: 6 },
    scheduleMm: [
      {
        stageMm: "၁။ မြေခံ",
        timingMm: "စိုက်ဘောင်ပြင်ချိန်",
        ratioNoteMm: "တီစူပါ ၁၀၀% + ပိုတက်ရှ် ၅၀% + ယူရီးယား ၃၀% + မြေဆွေး ၁၀၀%",
      },
      {
        stageMm: "၂။ ပန်းပွင့်စချိန်",
        timingMm: "ရွှေ့စိုက်ပြီး ၂၅ - ၃၀ ရက်သား",
        ratioNoteMm: "ယူရီးယား ၃၅% + ပိုတက်ရှ် ၂၅%",
      },
      {
        stageMm: "၃။ အသီးစခူးချိန်",
        timingMm: "ရွှေ့စိုက်ပြီး ၅၅ - ၆၀ ရက်သား",
        ratioNoteMm: "ကျန်ယူရီးယား ၃၅% + ပိုတက်ရှ် ၂၅%",
      },
    ],
  },
  {
    key: "tomato",
    nameMm: "ခရမ်းချဉ်",
    shortDescMm: "အသီးအရည်အသွေးကောင်းပြီး ပုပ်ရိမှုနည်းစေရန် ပိုတက်ရှ်နှင့် ကယ်လ်စီယမ် လိုအပ်သည်",
    basePerAcreKg: { urea: 50, tSuper: 40, potash: 40, compostCarts: 6 },
    scheduleMm: [
      {
        stageMm: "၁။ မြေခံ",
        timingMm: "ဘောင်တင်ချိန်",
        ratioNoteMm: "တီစူပါ ၁၀၀% + ပိုတက်ရှ် ၄၀% + ယူရီးယား ၃၀% + မြေဆွေး",
      },
      {
        stageMm: "၂။ ပထမအကြိမ် ပန်းပွင့်ချိန်",
        timingMm: "ရွှေ့စိုက်ပြီး ၂၀ - ၂၅ ရက်သား",
        ratioNoteMm: "ယူရီးယား ၃၅% + ပိုတက်ရှ် ၃၀%",
      },
      {
        stageMm: "၃။ အသီးကြီးထွားချိန်",
        timingMm: "ရွှေ့စိုက်ပြီး ၄၅ - ၅၀ ရက်သား",
        ratioNoteMm: "ယူရီးယား ၃၅% + ပိုတက်ရှ် ၃၀%",
      },
    ],
  },
  {
    key: "eggplant",
    nameMm: "ခရမ်း (ခရမ်းသီး)",
    shortDescMm: "အပင်သက်တမ်းရှည်ပြီး ဆက်တိုက်အသီးခူးရသဖြင့် သဘာဝမြေဆွေး များများလိုအပ်သည်",
    basePerAcreKg: { urea: 45, tSuper: 30, potash: 30, compostCarts: 6 },
    scheduleMm: [
      {
        stageMm: "၁။ မြေခံ",
        timingMm: "စိုက်ဘောင်ပြင်ချိန်",
        ratioNoteMm: "တီစူပါ ၁၀၀% + ပိုတက်ရှ် ၅၀% + ယူရီးယား ၃၅% + မြေဆွေး",
      },
      {
        stageMm: "၂။ အပွင့်အသီးစတင်ချိန်",
        timingMm: "ရွှေ့စိုက်ပြီး ၃၀ ရက်သား",
        ratioNoteMm: "ယူရီးယား ၃၅% + ပိုတက်ရှ် ၅၀%",
      },
      {
        stageMm: "၃။ အသီးခူးကာလအတွင်း",
        timingMm: "ရွှေ့စိုက်ပြီး ၆၀ ရက်သား",
        ratioNoteMm: "ကျန်ယူရီးယား ၃၀% + သဘာဝမြေဩဇာရည်",
      },
    ],
  },
  {
    key: "onion",
    nameMm: "ကြက်သွန်နီ",
    shortDescMm: "ဥကြီးထွားမှုနှင့် အထားခံမှုကောင်းစေရန် ပိုတက်ရှ်နှင့် ဆာလ်ဖာဓာတ် လိုအပ်သည်",
    basePerAcreKg: { urea: 45, tSuper: 35, potash: 35, compostCarts: 5 },
    scheduleMm: [
      {
        stageMm: "၁။ မြေခံ",
        timingMm: "ပျိုးပင်ရွှေ့မစိုက်မီ",
        ratioNoteMm: "တီစူပါ ၁၀၀% + ပိုတက်ရှ် ၅၀% + ယူရီးယား ၃၅% + မြေဆွေး",
      },
      {
        stageMm: "၂။ အပင်ကြီးထွားချိန်",
        timingMm: "ရွှေ့စိုက်ပြီး ၂၅ - ၃၀ ရက်သား",
        ratioNoteMm: "ယူရီးယား ၄၀% ကို ရေသွင်းပြီးချိန် ကျွေးပါ",
      },
      {
        stageMm: "၃။ ဥစတင်ကြီးထွားချိန်",
        timingMm: "ရွှေ့စိုက်ပြီး ၄၅ - ၅၀ ရက်သား",
        ratioNoteMm: "ယူရီးယား ၂၅% + ပိုတက်ရှ် ၅၀% (နောက်ပိုင်း နိုက်ထရိုဂျင်လျှော့ပါ)",
      },
    ],
  },
  {
    key: "garlic",
    nameMm: "ကြက်သွန်ဖြူ",
    shortDescMm: "ဥတက်ကြီးထွားရန် မြေပွပြီး အော်ဂဲနစ်မြေဆွေးနှင့် ပိုတက်ရှ် မျှတရန်လိုသည်",
    basePerAcreKg: { urea: 40, tSuper: 35, potash: 35, compostCarts: 5 },
    scheduleMm: [
      {
        stageMm: "၁။ မြေခံ",
        timingMm: "အမွှာစိုက်ဘောင်ပြင်ချိန်",
        ratioNoteMm: "တီစူပါ ၁၀၀% + ပိုတက်ရှ် ၅၀% + ယူရီးယား ၄၀% + မြေဆွေး",
      },
      {
        stageMm: "၂။ ဥမတက်မီ အပင်ကြီးထွားချိန်",
        timingMm: "စိုက်ပြီး ၃၀ - ၃၅ ရက်သား",
        ratioNoteMm: "ယူရီးယား ၆၀% + ပိုတက်ရှ် ၅၀%",
      },
    ],
  },
  {
    key: "banana",
    nameMm: "ငှက်ပျော (တစ်ဧက ပျမ်းမျှ ၄၅၀-၅၀၀ ပင်ခန့်)",
    shortDescMm: "ငှက်ပျောသည် ပိုတက်ရှ်စားသုံးမှု အလွန်မြင့်မားသော သီးနှံဖြစ်သည်",
    basePerAcreKg: { urea: 80, tSuper: 45, potash: 100, compostCarts: 8 },
    scheduleMm: [
      {
        stageMm: "၁။ စိုက်ကျင်းမြေခံ",
        timingMm: "သားတက်မစိုက်မီ",
        ratioNoteMm: "တီစူပါ ၁၀၀% + သဘာဝမြေဆွေး ၁၀၀%",
      },
      {
        stageMm: "၂။ အပင်ကြီးထွားချိန်",
        timingMm: "စိုက်ပြီး ၂ လ နှင့် ၄ လသား",
        ratioNoteMm: "ယူရီးယား ၆၀% + ပိုတက်ရှ် ၄၀% ခွဲကျွေးပါ",
      },
      {
        stageMm: "၃။ အဖူးစထွက်ချိန်",
        timingMm: "စိုက်ပြီး ၆ - ၇ လသား",
        ratioNoteMm: "ယူရီးယား ၄၀% + ပိုတက်ရှ် ၆၀%",
      },
    ],
  },
  {
    key: "papaya",
    nameMm: "သင်္ဘော (တစ်ဧက ပျမ်းမျှ ၆၀၀-၇၀၀ ပင်ခန့်)",
    shortDescMm: "အသီးမပြတ်သီးစေရန် ၂ လတစ်ကြိမ်ခန့် အပင်ခြေပတ်လည် ခွဲကျွေးသင့်သည်",
    basePerAcreKg: { urea: 70, tSuper: 50, potash: 70, compostCarts: 7 },
    scheduleMm: [
      {
        stageMm: "၁။ စိုက်ကျင်းမြေခံ",
        timingMm: "ပျိုးပင်မချမီ",
        ratioNoteMm: "တီစူပါ ၅၀% + သဘာဝမြေဆွေး ၁၀၀%",
      },
      {
        stageMm: "၂။ ပန်းပွင့်အသီးတင်ကာလ",
        timingMm: "၂ လတစ်ကြိမ် အကြိမ်ခွဲ၍",
        ratioNoteMm: "ယူရီးယား + တီစူပါ ၅၀% + ပိုတက်ရှ်တို့ကို အပင်အရိပ်အောက် ဖြူးကျွေးပါ",
      },
    ],
  },
  {
    key: "mango",
    nameMm: "သရက် (တစ်ဧက အပင်အရွယ်အစား/ပင်ရေအလိုက် ခန့်မှန်း)",
    shortDescMm: "နှစ်ရှည်ပင်ဖြစ်၍ အပင်သက်တမ်း (ငယ်ပင် / အသီးသီးပင်ကြီး) အလိုက် ပမာဏကွာခြားနိုင်သည်",
    basePerAcreKg: { urea: 45, tSuper: 35, potash: 55, compostCarts: 6 },
    scheduleMm: [
      {
        stageMm: "၁။ အသီးခူးပြီး အပင်အားဖြည့်ချိန်",
        timingMm: "မိုးဦး (ဇွန် - ဇူလိုင်)",
        ratioNoteMm: "သဘာဝမြေဆွေး + ယူရီးယား ၆၀% + တီစူပါ ၅၀%",
      },
      {
        stageMm: "၂။ ပန်းမပွင့်မီနှင့် အသီးတင်ချိန်",
        timingMm: "ဆောင်းဦး / မိုးနှောင်း (စက်တင်ဘာ - အောက်တိုဘာ)",
        ratioNoteMm: "ယူရီးယား ၄၀% + တီစူပါ ၅၀% + ပိုတက်ရှ် ၁၀၀%",
      },
    ],
  },
  {
    key: "orange",
    nameMm: "လိမ္မော် (တစ်ဧက အပင်သက်တမ်းအလိုက် ခန့်မှန်း)",
    shortDescMm: "တောင်ပေါ်/အေးမြဒေသ နှစ်ရှည်ပင်ဖြစ်၍ အပင်သက်တမ်းနှင့် မြေချဉ်ငန်ဓာတ်အလိုက် ချိန်ဆရသည်",
    basePerAcreKg: { urea: 50, tSuper: 35, potash: 55, compostCarts: 6 },
    scheduleMm: [
      {
        stageMm: "၁။ မိုးဦး အရွက်သစ်ထွက်ချိန်",
        timingMm: "မေ - ဇွန်",
        ratioNoteMm: "သဘာဝမြေဆွေး + ယူရီးယား ၅၀% + တီစူပါ ၅၀%",
      },
      {
        stageMm: "၂။ အသီးကြီးထွားချိန်",
        timingMm: "ဩဂုတ် - စက်တင်ဘာ",
        ratioNoteMm: "ယူရီးယား ၅၀% + တီစူပါ ၅၀% + ပိုတက်ရှ် ၁၀၀%",
      },
    ],
  },
];

export const FORTY_CROPS_CATALOG: CropGuideProfile[] = [
  ...CROPS_PART_1,
  ...CROPS_PART_2,
  ...CRUCIFER_CROPS,
];
