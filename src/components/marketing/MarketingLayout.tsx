import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { AnalyticsTracker } from './AnalyticsTracker';
import { Phone, Mail, MessageSquare, MapPin, Building2 } from 'lucide-react';
import { BzmtLogo } from '../BzmtLogo';

export const MarketingLayout = () => {
  const { lang, toggleLang } = useLanguage();
  return (
    <div className="min-h-screen bg-[#f4f7fc] flex flex-col font-['Alexandria','Cairo',sans-serif] selection:bg-[#0066CC] selection:text-white">
      <AnalyticsTracker />
      <header className="bg-gradient-to-r from-[#0a2540] via-[#0066CC] to-[#04101d] text-white p-4 sm:p-5 shadow-[0_10px_35px_rgba(0,102,204,0.35)] border-b border-[#00D4FF]/45 sticky top-0 z-50 backdrop-blur-xl">
        <nav className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <Link to="/" className="text-2xl font-black text-white flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF]/30 to-[#0066CC]/50 border border-[#00D4FF]/60 flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <Building2 className="w-5 h-5 text-[#00D4FF]" />
            </div>
            <div className="flex flex-col text-right">
              <div className="flex items-center gap-2">
                <span className="tracking-tight text-white font-black text-xl">MeDo ERP</span>
                <span className="text-[10px] bg-[#00D4FF]/20 text-[#00D4FF] font-bold px-2.5 py-0.5 rounded-full border border-[#00D4FF]/50 shadow-sm">v4.5 2050</span>
              </div>
              <span className="text-[10px] text-slate-200 font-medium -mt-0.5">ميدو تك للحلول البرمجية السحابية</span>
            </div>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap text-sm font-bold">
            <Link to="/" className="text-slate-100 hover:text-[#00D4FF] transition py-1">{lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
            <Link to="/about" className="text-slate-100 hover:text-[#00D4FF] transition py-1">{lang === 'ar' ? 'عن الشركة' : 'About'}</Link>
            <Link to="/system" className="text-slate-100 hover:text-[#00D4FF] transition py-1">{lang === 'ar' ? 'النظام' : 'System'}</Link>
            <Link to="/pricing" className="text-slate-100 hover:text-[#00D4FF] transition py-1">{lang === 'ar' ? 'الأسعار' : 'Pricing'}</Link>
            <Link to="/blog" className="text-slate-100 hover:text-[#00D4FF] transition py-1">{lang === 'ar' ? 'المدونة' : 'Blog'}</Link>
            <Link to="/contact" className="text-slate-100 hover:text-[#00D4FF] transition py-1">{lang === 'ar' ? 'اتصل بنا' : 'Contact'}</Link>
            <button onClick={toggleLang} className="text-[#00D4FF] font-bold border border-[#00D4FF]/40 px-3 py-1 rounded-lg text-xs hover:bg-[#00D4FF] hover:text-[#0a2540] transition">
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <Link to="/erp" className="bg-gradient-to-r from-[#d4af37] via-[#f1c40f] to-[#d4af37] hover:brightness-110 text-[#0a2540] px-6 py-2.5 rounded-xl font-black transition text-sm shadow-[0_5px_20px_rgba(212,175,55,0.4)] border border-[#b8860b] transform hover:scale-[1.03]">
              {lang === 'ar' ? 'الدخول للنظام' : 'Login'}
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-[#0a2540] text-white pt-16 pb-10 border-t border-[#d4af37]/30 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-[#d4af37]/5 blur-[150px] pointer-events-none rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-[#d4af37]/10 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2.5 mb-4 justify-center">
                <BzmtLogo size="md" variant="monogram" />
                <h4 className="text-white font-black text-lg">ميدو تك للحلول البرمجية</h4>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4 font-medium text-[15px]">
                أنظمة ERP سحابية ومكتبية متطورة بمعايير 2050 المستقبلية لتحويل العمليات التشغيلية والمالية إلى أصول ذكية وموثوقة.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-300 justify-center">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                <span>اليمن - صنعاء / عدن</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="text-white font-black text-lg mb-4 text-[#d4af37]">التواصل السريع والدعم الفني</h4>
              <ul className="space-y-3 text-slate-200 font-medium text-[15px] flex flex-col items-center">
                <li>
                  <a href="tel:+967773586047" dir="ltr" className="hover:text-[#d4af37] transition flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#d4af37]" />
                    <span>+967 773 586 047</span>
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/967773586047" target="_blank" rel="noopener noreferrer" className="text-[#d4af37] hover:text-amber-400 transition flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>واتساب: +967 773 586 047</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:bdr.zyad@yandex.com" className="hover:text-[#d4af37] transition flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#d4af37]" />
                    <span>bdr.zyad@yandex.com</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center">
              <h4 className="text-white font-black text-lg mb-4 text-[#d4af37]">روابط سريعة برؤية 2050</h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2.5 text-slate-200 font-medium text-[15px]">
                <Link to="/about" className="hover:text-[#d4af37] transition">عن الشركة</Link>
                <Link to="/system" className="hover:text-[#d4af37] transition">وحدات النظام</Link>
                <Link to="/pricing" className="hover:text-[#d4af37] transition">الأسعار والباقات</Link>
                <Link to="/blog" className="hover:text-[#d4af37] transition">المدونة</Link>
                <Link to="/privacy" className="hover:text-[#d4af37] transition">سياسة الخصوصية</Link>
                <Link to="/terms" className="hover:text-[#d4af37] transition">الشروط والأحكام</Link>
              </div>
            </div>
          </div>

          <div className="pt-8 text-center text-xs text-slate-400 font-medium flex flex-col items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <span className="font-bold text-slate-200 text-sm tracking-wide">
                جميع الحقوق محفوظة © {new Date().getFullYear()}
              </span>
              <span className="font-bold text-[#d4af37] text-base tracking-wide font-sans">
                Bin Ziyad Group & MeDo Tech (BZMT)
              </span>
            </div>
            <p className="text-[12px] text-slate-400 mt-0.5 font-mono text-center max-w-lg">
              {lang === 'ar'
                ? 'منظومة SAP/MeDO ERP السحابية المؤسسية المتكاملة برؤية 2050'
                : 'SAP/MeDO ERP Enterprise Sovereign Cloud Platform 2050 Vision'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

