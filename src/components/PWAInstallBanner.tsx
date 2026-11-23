import { useState } from "react";
import { Download, Share, Smartphone, WifiOff, X } from "lucide-react";
import { useOnlineStatus, usePWAInstall } from "../hooks/usePWAInstall";

export function PWAInstallBanner() {
  const { isInstallable, isInstalled, isIOS, isInIframe, install } =
    usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Automatically suppress install UI when running as an installed standalone App
  if (isInstalled || dismissed) {
    return null;
  }

  const handlePrimaryInstallClick = async () => {
    if (isInstallable) {
      await install();
      return;
    }
    setShowGuideModal(true);
  };

  return (
    <>
      <div className="mb-5 rounded-2xl border border-[#CFE0D4] bg-white px-4 py-3.5 sm:px-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/pwa-192x192.png"
            alt="မြေယာမိတ်ဆွေ App အိုင်ကွန်"
            className="w-10 h-10 rounded-xl shrink-0 border border-[#E2E5DC]"
          />
          <div className="space-y-0.5 min-w-0">
            <p className="text-sm font-bold text-[#18221D] truncate">
              မြေယာမိတ်ဆွေ ကို ဖုန်း/ကွန်ပျူတာ App အဖြစ် ထည့်သွင်းသုံးစွဲပါ
            </p>
            <p className="text-xs text-[#546358]">
              Home Screen တွင် Icon ဖြင့် တိုက်ရိုက်ဖွင့်နိုင်ပြီး Offline တွင်လည်း သီးနှံ/မြေဩဇာ/ပိုးမွှားလမ်းညွှန်များ ကြည့်နိုင်ပါသည်
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrimaryInstallClick}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-[#15623E] hover:bg-[#114F32] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors"
          >
            {isInstallable ? (
              <>
                <Download className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>App ထည့်သွင်းမည်</span>
              </>
            ) : isIOS ? (
              <>
                <Share className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>iPhone / iPad တွင် ထည့်သွင်းနည်း</span>
              </>
            ) : (
              <>
                <Smartphone className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>App အဖြစ် ထည့်သွင်းနည်း</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="App ထည့်သွင်းရန် အကြံပြုချက် ပိတ်ရန်"
            className="min-h-[44px] min-w-[44px] rounded-xl text-[#546358] hover:bg-[#F3F5F0] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Platform-Specific Install Instructions Modal (iOS Safari, Android Chrome, Desktop, Iframe Preview) */}
      {showGuideModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-install-guide-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-white border border-[#E2E5DC] p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-xs font-medium text-[#15623E]">
                  မြေယာမိတ်ဆွေ (PWA Mobile &amp; Desktop App)
                </p>
                <h3
                  id="pwa-install-guide-title"
                  className="text-lg font-bold text-[#18221D]"
                >
                  ဖုန်း / ကွန်ပျူတာတွင် App အဖြစ် ထည့်သွင်းနည်း
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                aria-label="ပိတ်ရန်"
                className="min-h-[44px] min-w-[44px] rounded-xl text-[#546358] hover:bg-[#F3F5F0] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isInIframe && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs sm:text-sm text-amber-950 leading-relaxed">
                <span className="font-bold">သတိပြုရန် — </span>
                လက်ရှိ AI Studio Preview Frame အတွင်း၌ ရှိနေသဖြင့် Browser ၏ တိုက်ရိုက် Install ခလုတ် ပိတ်ထားတတ်ပါသည်။ ဤ App URL ကို ဖုန်း Chrome သို့မဟုတ် Safari Browser Tab အသစ်ဖြင့် ဖွင့်ပြီး အောက်ပါအတိုင်း ထည့်သွင်းပါ။
              </div>
            )}

            <div className="space-y-3 text-sm text-[#35443A]">
              {isIOS ? (
                <div className="rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] p-4 space-y-2">
                  <p className="font-bold text-[#18221D]">
                    iPhone / iPad (Safari Browser) အတွက်
                  </p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm leading-relaxed">
                    <li>
                      Safari အောက်ခြေ (သို့မဟုတ် အပေါ်) ရှိ <strong>Share</strong> (မြှားတံထွက်နေသော လေးထောင့်ပုံ) ခလုတ်ကို နှိပ်ပါ။
                    </li>
                    <li>
                      အောက်သို့ဆွဲချ၍ <strong>Add to Home Screen</strong> ကို နှိပ်ပါ။
                    </li>
                    <li>
                      ညာဘက်အပေါ်ထောင့်ရှိ <strong>Add</strong> ကို နှိပ်လိုက်ပါက Home Screen တွင် App Icon ပေါ်လာပါမည်။
                    </li>
                  </ol>
                </div>
              ) : (
                <>
                  <div className="rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] p-4 space-y-2">
                    <p className="font-bold text-[#18221D]">
                      Android ဖုန်း (Google Chrome) အတွက်
                    </p>
                    <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm leading-relaxed">
                      <li>
                        Chrome ညာဘက်အပေါ်ထောင့်ရှိ အစက် ၃ စက် <strong>(⋮)</strong> မီနူးကို နှိပ်ပါ။
                      </li>
                      <li>
                        <strong>Install app</strong> (သို့မဟုတ် <strong>Add to Home screen</strong>) ကို နှိပ်၍ <strong>Install</strong> အတည်ပြုပါ။
                      </li>
                    </ol>
                  </div>

                  <div className="rounded-xl bg-[#FAF9F6] border border-[#E5E8DF] p-4 space-y-2">
                    <p className="font-bold text-[#18221D]">
                      ကွန်ပျူတာ (Chrome / Edge) အတွက်
                    </p>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      Address bar ညာဘက်အစွန်းရှိ <strong>Install App</strong> အိုင်ကွန်ကို နှိပ်၍ Desktop App အဖြစ် ထည့်သွင်းနိုင်ပါသည်။
                    </p>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full min-h-[44px] rounded-xl bg-[#15623E] hover:bg-[#114F32] text-white text-sm font-semibold transition-colors"
            >
              နားလည်ပါပြီ
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs sm:text-sm text-amber-950 flex items-center gap-2.5"
    >
      <WifiOff className="w-4 h-4 text-amber-800 shrink-0" aria-hidden="true" />
      <span>
        အင်တာနက် ပြတ်တောက်နေပါသည် — သိမ်းဆည်းထားသော သီးနှံ ၄၂ မျိုး၊ သဘာဝမြေဩဇာ၊ တွက်စက်နှင့် ပိုးမွှားလမ်းညွှန်များကို Offline ဖြင့် ဆက်လက်အသုံးပြုနိုင်ပါသည်။
      </span>
    </div>
  );
}
