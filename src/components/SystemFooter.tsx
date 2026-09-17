import React from "react";
import { BzmtLogo } from "./BzmtLogo";
import { Scale, ShieldCheck, Lock, RotateCcw, Cookie, FileText } from "lucide-react";

export type LegalDocTab = "TERMS" | "PRIVACY" | "DISCLAIMER" | "REFUND" | "COOKIES";

interface SystemFooterProps {
  className?: string;
  isCompact?: boolean;
  onOpenLegalDocuments?: (tab?: LegalDocTab) => void;
}

export const SystemFooter: React.FC<SystemFooterProps> = ({
  className = "",
  isCompact = false,
  onOpenLegalDocuments,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="system-main-footer"
      className={`w-full border-t border-slate-800/80 bg-slate-950/95 text-slate-400 select-none transition-colors ${
        isCompact ? "py-2 px-4 text-[11px]" : "py-3 px-6 text-xs"
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Brand Copyright with Official BZMT Logo */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center lg:justify-start font-medium">
          <BzmtLogo size="sm" variant="monogram" />
          <span className="text-slate-200 font-bold tracking-wide">
            جميع الحقوق محفوظة ©
          </span>
          <span className="text-amber-300 font-semibold font-sans tracking-wide">
            Bin Ziyad Group & MeDo Tech (BZMT)
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline font-mono">
            SAP/MeDO ERP Suite {currentYear}
          </span>
        </div>

        {/* Legal Documents Direct Links & Standards Badge */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center lg:justify-end text-[11px] text-slate-400 font-medium">
          {onOpenLegalDocuments && (
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <button
                type="button"
                onClick={() => onOpenLegalDocuments("TERMS")}
                className="hover:text-amber-400 text-slate-300 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-900 cursor-pointer"
                title="شروط الاستخدام والخدمة (Terms of Service)"
              >
                الشروط
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={() => onOpenLegalDocuments("PRIVACY")}
                className="hover:text-emerald-400 text-slate-300 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-900 cursor-pointer"
                title="سياسة الخصوصية وسرية البيانات (Privacy Policy)"
              >
                الخصوصية
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={() => onOpenLegalDocuments("DISCLAIMER")}
                className="hover:text-amber-400 text-slate-300 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-900 cursor-pointer"
                title="إخلاء المسؤولية القانونية (Disclaimer)"
              >
                إخلاء المسؤولية
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={() => onOpenLegalDocuments("REFUND")}
                className="hover:text-cyan-400 text-slate-300 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-900 cursor-pointer"
                title="سياسة الاسترداد وإلغاء الاشتراك (Refund Policy)"
              >
                الاسترداد
              </button>
              <span className="text-slate-700">•</span>
              <button
                type="button"
                onClick={() => onOpenLegalDocuments("COOKIES")}
                className="hover:text-amber-300 text-slate-300 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-900 cursor-pointer"
                title="سياسة ملفات تعريف الارتباط (Cookies Policy)"
              >
                ملفات الارتباط
              </button>

              <button
                type="button"
                onClick={() => onOpenLegalDocuments("TERMS")}
                className="flex items-center gap-1 px-2 py-0.5 mr-1 rounded-lg bg-slate-900/90 hover:bg-slate-850 text-amber-300 hover:text-amber-200 border border-amber-500/30 transition-all text-[10px] font-bold cursor-pointer active:scale-95 group shadow-sm"
                title="عرض كافة الوثائق القانونية والسياسات الرسمية v2.0"
              >
                <Scale className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>الوثائق القانونية</span>
                <span className="text-[9px] px-1 py-0.1 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono">v2.0</span>
              </button>
            </div>
          )}

          <span className="text-slate-700 hidden md:inline">|</span>

          <span className="flex items-center gap-1.5 text-emerald-400/90 font-mono text-[10px] sm:text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            معايير IFRS / ZATCA
          </span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="text-slate-500 font-mono text-[10px] hidden sm:inline">
            سحابي مشفر AES-256
          </span>
        </div>
      </div>
    </footer>
  );
};


