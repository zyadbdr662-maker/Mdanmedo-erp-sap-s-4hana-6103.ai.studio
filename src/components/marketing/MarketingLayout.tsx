import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { AnalyticsTracker } from './AnalyticsTracker';
import { Phone, Mail, MessageSquare, MapPin } from 'lucide-react';

export const MarketingLayout = () => {
  const { lang, toggleLang } = useLanguage();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Alexandria','Cairo',sans-serif]">
      <AnalyticsTracker />
      <header className="bg-[#0B192C] text-white p-4 shadow-lg border-b border-[#1E3A8A]/60 sticky top-0 z-50 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <Link to="/" className="text-2xl font-black text-white flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#2563EB] border border-blue-400/50 flex items-center justify-center text-white shadow-md font-black text-lg">
              M
            </div>
            <span className="tracking-tight text-white">MeDo ERP</span>
            <span className="text-xs bg-blue-500/20 text-blue-300 font-bold px-2.5 py-0.5 rounded-full border border-blue-400/30">v4.5</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6 flex-wrap text-sm font-bold">
            <Link to="/" className="text-slate-200 hover:text-white transition py-1">{lang === 'ar' ? 'الرئيسية' : 'Home'}</Link>
            <Link to="/about" className="text-slate-200 hover:text-white transition py-1">{lang === 'ar' ? 'عن الشركة' : 'About'}</Link>
            <Link to="/system" className="text-slate-200 hover:text-white transition py-1">{lang === 'ar' ? 'النظام' : 'System'}</Link>
            <Link to="/pricing" className="text-slate-200 hover:text-white transition py-1">{lang === 'ar' ? 'الأسعار' : 'Pricing'}</Link>
            <Link to="/blog" className="text-blue-300 hover:text-white font-extrabold transition py-1">{lang === 'ar' ? 'المدونة' : 'Blog'}</Link>
            <Link to="/contact" className="text-slate-200 hover:text-white transition py-1">{lang === 'ar' ? 'اتصل بنا' : 'Contact'}</Link>
            <button onClick={toggleLang} className="text-blue-300 font-bold border border-blue-400/40 px-3 py-1 rounded-lg text-xs hover:bg-blue-600 hover:text-white transition">
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>
            <Link to="/erp" className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8] text-white px-5 py-2 rounded-xl font-black hover:from-[#2563EB] hover:to-[#1E3A8A] transition text-sm shadow-md shadow-blue-950/50 border border-blue-300/40">
              {lang === 'ar' ? 'الدخول للنظام' : 'Login'}
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-[#081220] text-white pt-12 pb-8 border-t border-[#1E3A8A]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 text-sm">
            <div>
              <h4 className="text-white font-black text-base mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                ميدو تك للحلول البرمجية
              </h4>
              <p className="text-slate-300 leading-relaxed mb-3 font-medium">
                بالشراكة الاستراتيجية مع بن زياد المتحدة. أنظمة ERP سحابية متطورة لتحويل العمليات التشغيلية والمالية إلى أصول ذكية موثوقة.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>خمر - الكدوي - عمارة القلمي دور أرضي</span>
              </div>
            </div>

            <div>
              <h4 className="text-white font-black text-base mb-3">التواصل السريع والدعم</h4>
              <ul className="space-y-2 text-slate-300 font-medium">
                <li>
                  <a href="tel:+967773586047" dir="ltr" className="hover:text-blue-300 transition flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span>+967773586047</span>
                  </a>
                </li>
                <li>
                  <a href="https://wa.me/967773586047" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>واتساب: +967773586047</span>
                  </a>
                </li>
                <li>
                  <a href="mailto:bdr.zyad@yandex.com" className="hover:text-blue-300 transition flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>bdr.zyad@yandex.com</span>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black text-base mb-3">روابط هامة</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-300 font-medium">
                <Link to="/about" className="hover:text-white transition">عن الشركة</Link>
                <Link to="/system" className="hover:text-white transition">وحدات النظام</Link>
                <Link to="/pricing" className="hover:text-white transition">الأسعار والباقات</Link>
                <Link to="/blog" className="hover:text-white transition">المدونة</Link>
                <Link to="/privacy" className="hover:text-white transition">سياسة الخصوصية</Link>
                <Link to="/terms" className="hover:text-white transition">الشروط والأحكام</Link>
              </div>
            </div>
          </div>

          <div className="pt-6 text-center text-xs text-slate-400 font-medium">
            <p>
              {lang === 'ar'
                ? '© 2026 ميدو تك للحلول البرمجية بالشراكة الاستراتيجية مع بن زياد المتحدة - جميع الحقوق محفوظة.'
                : '© 2026 MeDo Tech Solutions in strategic partnership with Bin Ziad United - All Rights Reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

