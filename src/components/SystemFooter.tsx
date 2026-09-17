import React from "react";
import { BzmtLogo } from "./BzmtLogo";

interface SystemFooterProps {
  className?: string;
  isCompact?: boolean;
}

export const SystemFooter: React.FC<SystemFooterProps> = ({ className = "", isCompact = false }) => {
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

        {/* System & Standards Badge */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
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

