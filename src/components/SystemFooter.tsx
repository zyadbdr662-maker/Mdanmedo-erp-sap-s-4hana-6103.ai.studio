import React from "react";
import { BzmtLogo } from "./BzmtLogo";
import { Scale } from "lucide-react";

interface SystemFooterProps {
  className?: string;
  isCompact?: boolean;
  onOpenLegalDocuments?: () => void;
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
        isCompact ? "py-2 px-4 text-[11px]" : "py-3.5 px-6 text-xs"
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand Copyright with Official BZMT Logo */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start font-medium">
          <BzmtLogo size="sm" variant="monogram" />
          <span className="text-slate-200 font-bold tracking-wide">
            جميع الحقوق محفوظة ©
          </span>
          <span className="text-amber-300 font-semibold font-sans tracking-wide">
            Bin Ziyad Group & MeDo Tech (BZMT)
          </span>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 text-[11px] hidden md:inline font-mono">
            SAP/MeDO ERP Suite {currentYear}
          </span>
        </div>

        {/* Legal Documents Direct Link & Standards Badge */}
        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end text-[11px] text-slate-400 font-medium">
          {onOpenLegalDocuments && (
            <button
              type="button"
              onClick={onOpenLegalDocuments}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-400 border border-slate-800 hover:border-amber-500/30 transition-all text-[11px] font-medium cursor-pointer active:scale-95 group"
              title="عرض الوثائق القانونية وشروط استخدام منصة MeDo ERP (الإصدار 2.0)"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>شروط الاستخدام والوثائق القانونية</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 font-mono font-bold">v2.0</span>
            </button>
          )}

          <span className="text-slate-700 hidden sm:inline">•</span>

          <span className="flex items-center gap-1.5 text-emerald-400/90 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            معايير IFRS / ZATCA
          </span>
          <span className="text-slate-700">•</span>
          <span className="text-slate-400 font-mono">
            نظام محاسبي وإداري سحابي
          </span>
        </div>
      </div>
    </footer>
  );
};

