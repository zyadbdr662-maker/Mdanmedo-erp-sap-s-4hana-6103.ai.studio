import React, { useState, useEffect } from "react";
import {
  Scale,
  ShieldCheck,
  Building2,
  FileText,
  Search,
  Printer,
  Copy,
  Check,
  Download,
  ArrowRight,
  ChevronUp,
  ExternalLink,
  BookOpen,
  Layers,
  Lock,
  Zap,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Info
} from "lucide-react";
import { TermsOfServiceDocument } from "./TermsOfServiceDocument";

interface LegalDocumentsPageProps {
  onBack?: () => void;
}

export const LegalDocumentsPage: React.FC<LegalDocumentsPageProps> = ({ onBack }) => {
  const [activeArticleId, setActiveArticleId] = useState<string>("art-1");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Monitor scroll for back-to-top and active article tracking
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToArticle = (id: string) => {
    setActiveArticleId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90; // offset for fixed headers
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Article groupings for intuitive navigation
  const articleCategories = [
    {
      category: "الأحكام العامة والتعريفات",
      items: [
        { id: "art-1", num: 1, title: "التعريفات والمصطلحات" },
        { id: "art-2", num: 2, title: "قبول الشروط والأهلية" },
      ],
    },
    {
      category: "الحسابات والباقات والاشتراك",
      items: [
        { id: "art-3", num: 3, title: "التسجيل وتأكيد الحساب" },
        { id: "art-4", num: 4, title: "الاشتراك والأسعار والدفع" },
      ],
    },
    {
      category: "ضوابط الاستخدام والبيانات",
      items: [
        { id: "art-5", num: 5, title: "الاستخدام المسموح والمحظور" },
        { id: "art-6", num: 6, title: "ملكية المحتوى والبيانات" },
        { id: "art-7", num: 7, title: "الخصوصية وحماية البيانات" },
        { id: "art-8", num: 8, title: "حقوق الملكية الفكرية" },
      ],
    },
    {
      category: "الخدمة والذكاء الاصطناعي",
      items: [
        { id: "art-9", num: 9, title: "الدعم الفني والصيانة" },
        { id: "art-10", num: 10, title: "مستويات الخدمة (SLA)" },
        { id: "art-11", num: 11, title: "سياسات الذكاء الاصطناعي" },
        { id: "art-12", num: 12, title: "النسخ الاحتياطي والاستعادة" },
        { id: "art-13", num: 13, title: "الأمان والحماية المتقدمة" },
      ],
    },
    {
      category: "المسؤوليات وإنهاء الخدمة والنزاعات",
      items: [
        { id: "art-14", num: 14, title: "حدود المسؤولية المالية" },
        { id: "art-15", num: 15, title: "التعويض والمساءلة" },
        { id: "art-16", num: 16, title: "إنهاء الخدمة وحذف الحساب" },
        { id: "art-17", num: 17, title: "القوة القاهرة والظروف الطارئة" },
        { id: "art-18", num: 18, title: "حل النزاعات والقانون المعمول به" },
        { id: "art-19", num: 19, title: "أحكام عامة وإخطارات" },
        { id: "art-20", num: 20, title: "التواصل والقنوات المعتمدة" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 select-text" dir="rtl">
      {/* Top Header & Breadcrumb Bar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="الرجوع إلى الشاشة السابقة"
              >
                <ArrowRight className="w-4 h-4" />
                <span className="hidden sm:inline">رجوع</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-black text-white leading-tight flex items-center gap-2">
                  <span>الوثائق القانونية وشروط الاستخدام</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700/60 font-mono font-bold">
                    الإصدار 2.0
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  ميدو تك للحلول البرمجية — سارية المفعول ومعتمدة رسمياً
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:border-slate-600"
              title="طباعة الوثيقة الرسمية"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">طباعة</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:border-slate-600"
              title="نسخ الرابط"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span className="hidden md:inline">{copied ? "تم النسخ" : "مشاركة"}</span>
            </button>

            <a
              href="mailto:legal@medo-erp.com"
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
              title="التواصل مع الإدارة القانونية"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">الإدارة القانونية</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container with Sticky TOC Sidebar + Document */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Table of Contents Navigation Sidebar (Sticky on Large Screens) */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-4 lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1 pl-1 scrollbar-thin">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-black text-amber-400">
                  <Layers className="w-4 h-4" />
                  <span>فهرس مواد الاتفاقية (20 مادة)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                  روابط سريعة
                </span>
              </div>

              {/* Grouped Article Links */}
              <div className="space-y-4 text-xs">
                {articleCategories.map((group, groupIdx) => (
                  <div key={groupIdx} className="space-y-1.5">
                    <h3 className="text-[11px] font-bold text-slate-400 pr-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      {group.category}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((art) => (
                        <button
                          key={art.id}
                          onClick={() => scrollToArticle(art.id)}
                          className={`w-full text-right px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between group cursor-pointer ${
                            activeArticleId === art.id
                              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold"
                              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="text-amber-400 font-mono text-[11px]">م.{art.num}</span>
                            <span className="truncate">{art.title}</span>
                          </span>
                          <span className="text-[10px] opacity-0 group-hover:opacity-100 text-amber-400 transition-opacity">
                            ←
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Legal Help Box */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
                  <div className="font-bold text-slate-200 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-400" />
                    <span>ملاحظة قانونية</span>
                  </div>
                  <p className="leading-relaxed">
                    هذه الوثيقة ملزمة لكافة المستأجرين والمستخدمين، وتخضع للاختصاص القضائي للمحاكم التجارية بصنعاء.
                  </p>
                  <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                    <Phone className="w-3 h-3" />
                    <span dir="ltr">+0967773586047</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Full Updated Document Content Column */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <TermsOfServiceDocument />
          </div>

        </div>
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 p-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-2xl transition-all active:scale-95 flex items-center gap-1.5 text-xs cursor-pointer border border-amber-300"
          title="العودة إلى أعلى الصفحة"
        >
          <ChevronUp className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">أعلى الوثيقة</span>
        </button>
      )}
    </div>
  );
};
