import { useState } from "react";
import { AlertCircle, Clock, Layers, Scale } from "lucide-react";
import { ORGANIC_RECIPES } from "../data/farmData";
import { ResilientImage } from "./ResilientImage";

export function OrganicFertilizerView() {
  const [selectedId, setSelectedId] = useState<string>(ORGANIC_RECIPES[0].id);
  const [batchMultiplier, setBatchMultiplier] = useState<number>(1);

  const activeRecipe =
    ORGANIC_RECIPES.find((r) => r.id === selectedId) ?? ORGANIC_RECIPES[0];

  return (
    <div className="space-y-6">
      {/* Header & Recipe Selector */}
      <section className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-[#546358]">
            ကုန်ကျစရိတ်သက်သာပြီး မြေဆီသြဇာ ရေရှည်တည်တံ့စေရန်
          </p>
          <h1 className="text-2xl font-bold text-[#18221D]">
            သဘာဝမြေဩဇာ ကိုယ်တိုင်ပြုလုပ်နည်း လမ်းညွှန်
          </h1>
        </div>

        {/* Interactive Filter Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-[#F3F5F0] rounded-xl">
          {ORGANIC_RECIPES.map((recipe) => {
            const active = recipe.id === activeRecipe.id;
            return (
              <button
                key={recipe.id}
                type="button"
                onClick={() => setSelectedId(recipe.id)}
                className={`min-h-[44px] px-3.5 py-2.5 rounded-lg text-sm font-medium text-left sm:text-center transition-colors ${
                  active
                    ? "bg-white text-[#15623E] shadow-sm font-semibold"
                    : "text-[#445248] hover:text-[#18221D]"
                }`}
              >
                {recipe.titleMm}
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Illustrated Recipe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Illustration & Ingredients Column */}
        <section className="lg:col-span-5 bg-white border border-[#E2E5DC] rounded-2xl overflow-hidden">
          <div className="aspect-[4/3] bg-[#EEF2EA]">
            <ResilientImage
              src={activeRecipe.imageUrl}
              alt={activeRecipe.imageAltMm}
              fallbackTitleMm={activeRecipe.titleMm}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#18221D]">
                {activeRecipe.titleMm}
              </h2>
              <p className="text-sm text-[#445248]">{activeRecipe.subtitleMm}</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#546358] border-y border-[#ECEFE7] py-3">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#15623E]" aria-hidden="true" />
                ကြာချိန် — {activeRecipe.durationMm}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-[#15623E]" aria-hidden="true" />
                ရရှိမှု — {activeRecipe.yieldMm}
              </span>
            </div>

            {/* Batch Multiplier */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-[#18221D]">
                  လိုအပ်သော ကုန်ကြမ်းပမာဏ
                </h3>
                <div className="flex items-center gap-1 p-1 bg-[#F3F5F0] rounded-lg">
                  {[1, 2, 5].map((mult) => (
                    <button
                      key={mult}
                      type="button"
                      onClick={() => setBatchMultiplier(mult)}
                      className={`min-h-[36px] px-2.5 py-1 rounded-md text-xs font-medium tabular-nums transition-colors ${
                        batchMultiplier === mult
                          ? "bg-white text-[#15623E] shadow-sm font-semibold"
                          : "text-[#445248] hover:text-[#18221D]"
                      }`}
                    >
                      {mult} ဆ
                    </button>
                  ))}
                </div>
              </div>

              <ul className="divide-y divide-[#ECEFE7]">
                {activeRecipe.ingredients.map((item, idx) => (
                  <li
                    key={idx}
                    className="py-2.5 flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="text-[#2C3A30]">{item.nameMm}</span>
                    <span className="font-mono font-semibold text-[#15623E] tabular-nums whitespace-nowrap shrink-0">
                      {item.amountBase * batchMultiplier} {item.unitMm}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Step-by-Step Instructions Column */}
        <section className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#15623E]" aria-hidden="true" />
              <h2 className="text-lg font-bold text-[#18221D]">
                အဆင့်ဆင့် ပြုလုပ်ပုံ နည်းလမ်းများ
              </h2>
            </div>

            <div className="divide-y divide-[#ECEFE7]">
              {activeRecipe.stepsMm.map((step) => (
                <div
                  key={step.stepNumber}
                  className="py-4 first:pt-1 last:pb-1 flex items-start gap-4"
                >
                  <span className="w-9 h-9 rounded-xl bg-[#EEF2EA] text-[#15623E] font-mono text-sm font-bold flex items-center justify-center shrink-0">
                    {step.stepNumber}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-[#18221D]">
                      {step.titleMm}
                    </h3>
                    <p className="text-sm text-[#445248] leading-relaxed">
                      {step.detailMm}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage & Caution */}
          <div className="bg-white border border-[#E2E5DC] rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[#18221D]">
                စိုက်ခင်းတွင် အသုံးပြုရန် နှုန်းထား
              </h3>
              <p className="text-sm text-[#2C3A30] leading-relaxed">
                {activeRecipe.applicationRateMm}
              </p>
            </div>

            <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 flex items-start gap-3">
              <AlertCircle
                className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                <span className="font-semibold">သတိပြုရန် — </span>
                {activeRecipe.cautionMm}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
