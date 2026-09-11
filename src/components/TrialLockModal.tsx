import React, { useState } from "react";
import { Lock, ThumbsUp, ThumbsDown, MessageSquare, Phone, Mail, CheckCircle2, FileText, Fingerprint, Clock } from "lucide-react";
import { LegalPolicyType } from "./LegalPoliciesModal";
import { trialService } from "../services/trialService";

interface TrialLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivateWithLicenseKey?: (key: string) => void;
  onOpenLegalPolicy?: (policy: LegalPolicyType) => void;
}

export const TrialLockModal: React.FC<TrialLockModalProps> = ({
  isOpen,
  onClose,
  onActivateWithLicenseKey,
  onOpenLegalPolicy,
}) => {
  const [liked, setLiked] = useState<boolean | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [licenseInput, setLicenseInput] = useState("");
  const [activated, setActivated] = useState(false);

  const trialState = trialService.getTrialState();
  const fingerprint = trialService.generateBrowserFingerprint();

  if (!isOpen) return null;

  const handleToggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (licenseInput.trim().length > 5) {
      const success = trialService.activateLicense(licenseInput.trim());
      setActivated(true);
      if (onActivateWithLicenseKey) {
        onActivateWithLicenseKey(licenseInput.trim());
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      alert("يرجى إدخال رقم تسلسلي صحيح (مثال: MEDO-PRO-2026-X7K9-4B2M)");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-['Alexandria','Cairo',sans-serif]">
      <div className="bg-gradient-to-b from-[#0B192C] to-[#081220] border border-blue-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp text-right" dir="rtl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-950 text-amber-300 border border-amber-600/50">
            <Clock className="w-3.5 h-3.5" />
            <span>انتهت الفترة التجريبية (48 ساعة - يومان)</span>
          </span>
          <h2 className="text-2xl font-black text-white">منظومة MeDo ERP السحابية</h2>
        </div>

        {activated ? (
          <div className="p-8 text-center space-y-3 bg-emerald-950/60 rounded-2xl border border-emerald-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-300">تم تفعيل المنظومة بنجاح!</h3>
            <p className="text-xs text-slate-300">جاري فتح النسخة المعتمدة بكافة الصلاحيات السحابية...</p>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3 text-xs">
              <p className="text-slate-200 font-medium leading-relaxed">
                فضلاً عميلنا العزيز، لقد استنفدت فترة التجربة المجانية المحددة بـ <span className="text-amber-400 font-bold">48 ساعة بدقة (يومين)</span> لنظام MeDo ERP. لتفعيل النسخة الكاملة واستمرار أعمال منشأتكم، يرجى تفعيل مفتاح الترخيص أو التواصل مع إدارة المبيعات.
              </p>

              {/* Browser Fingerprint Verification Badge */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-blue-400" />
                  <span>معرف الجهاز والمتصفح (Fingerprint):</span>
                </div>
                <span className="text-blue-300 font-bold">{fingerprint.fingerprintHash.slice(0, 16)}</span>
              </div>

              {/* Feedback Survey */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="font-bold text-slate-200 block">هل أعجبك النظام وسرعة عملياته؟</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setLiked(true)}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      liked === true
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-md"
                        : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" /> نعم، ممتاز جداً
                  </button>
                  <button
                    type="button"
                    onClick={() => setLiked(false)}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      liked === false
                        ? "bg-rose-600 text-white border-rose-500 shadow-md"
                        : "bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" /> لدي ملاحظات
                  </button>
                </div>
              </div>

              {/* What you liked most */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="font-bold text-slate-200 block">ما هي الميزة الأبرز بالنسبة لك؟</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "سهولة إدخال القيود والفواتير",
                    "دقة شجرة الحسابات والتقارير",
                    "سرعة المزامنة والعمل أوفلاين",
                    "إشعارات الواتساب والنغمات",
                  ].map((feat) => {
                    const isChecked = selectedFeatures.includes(feat);
                    return (
                      <button
                        key={feat}
                        type="button"
                        onClick={() => handleToggleFeature(feat)}
                        className={`p-2.5 rounded-xl text-right text-[11px] font-medium border flex items-center justify-between transition-all cursor-pointer ${
                          isChecked
                            ? "bg-blue-600/30 border-blue-400 text-blue-200 font-bold shadow"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        <span>{feat}</span>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isChecked ? "bg-blue-600 border-blue-400 text-white text-[10px]" : "border-slate-700"}`}>
                          {isChecked && "✓"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* License Activation Form */}
            <form onSubmit={handleActivate} className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/60 space-y-3">
              <label className="block text-xs font-bold text-blue-200">
                🔑 أدخل الرقم التسلسلي للنسخة الأصلية (License Activation Key):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={licenseInput}
                  onChange={(e) => setLicenseInput(e.target.value)}
                  placeholder="MEDO-PRO-2026-XXXX-XXXX"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white text-center tracking-wider focus:outline-none focus:border-blue-500"
                  dir="ltr"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  تفعيل الآن
                </button>
              </div>
            </form>

            {/* Direct WhatsApp Contact */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/50 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-emerald-300">لشراء وتفعيل الترخيص فوراً:</div>
                <div className="text-[11px] text-slate-400 font-mono dir-ltr">+967 773 586 047</div>
              </div>
              <a
                href="https://wa.me/967773586047?text=%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%AA%D9%81%D8%B9%D9%8A%D9%84%20%D8%AA%D8%B1%D8%AE%D9%8A%D8%B5%20%D9%85%D9%86%D8%B8%D9%88%D9%85%D8%A9%20MeDo%20ERP%20%D8%A7%D9%84%D8%B3%D8%AD%D8%A7%D8%A8%D9%8A%D8%A9"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>مراسلة واتساب</span>
              </a>
            </div>

            {/* Policy Link */}
            {onOpenLegalPolicy && (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => onOpenLegalPolicy("TRIAL_TERMS")}
                  className="text-[11px] text-slate-400 hover:text-white underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>اتفاقية وشروط الفترة التجريبية 48 ساعة (Trial Terms)</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
