import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  FileSpreadsheet, 
  ShoppingCart, 
  Package, 
  Users, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Headphones,
  Laptop,
  Zap
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { trackEvent } from '../../components/marketing/AnalyticsTracker';

export const HomePage = () => {
  const { lang } = useLanguage();
  
  const handleTrialClick = (source: string) => {
    trackEvent('trial_started', { source });
  };

  const coreModules = [
    {
      num: "1",
      icon: <FileSpreadsheet className="w-8 h-8 text-blue-400" />,
      title: lang === 'ar' ? 'المحاسبة والمالية (مستوى بنكي)' : 'Accounting & Finance (Bank-Grade)',
      desc: lang === 'ar' 
        ? 'دليل حسابات شجري متكامل، قيود يومية آلية، وتقارير مالية فورية وفق معايير IFRS/GAAP.' 
        : 'Hierarchical chart of accounts, automated journal entries, and real-time financial statements (IFRS/GAAP).'
    },
    {
      num: "2",
      icon: <ShoppingCart className="w-8 h-8 text-blue-400" />,
      title: lang === 'ar' ? 'إدارة المبيعات ونقاط البيع' : 'Sales & Point of Sale (POS)',
      desc: lang === 'ar' 
        ? 'فواتير سريعة ذكية، متابعة حسابات العملاء، ودعم كامل لأجهزة الباركود والفوترة الإلكترونية.' 
        : 'Smart rapid invoicing, customer receivables tracking, and electronic billing compliance.'
    },
    {
      num: "3",
      icon: <Package className="w-8 h-8 text-blue-400" />,
      title: lang === 'ar' ? 'إدارة المشتريات والمخزون' : 'Purchasing & Inventory Control',
      desc: lang === 'ar' 
        ? 'تتبع دقيق للمخزون لحظياً متعدد المستودعات، تنبيهات حد الطلب ونفاذ الأصناف، وإدارة الموردين.' 
        : 'Real-time multi-warehouse tracking, low-stock notifications, and vendor accounts management.'
    },
    {
      num: "4",
      icon: <Users className="w-8 h-8 text-blue-400" />,
      title: lang === 'ar' ? 'إدارة الموارد البشرية' : 'Human Resources Management (HR)',
      desc: lang === 'ar' 
        ? 'سجلات شاملة للموظفين، احتساب الرواتب والبدلات، وإدارة الورديات وسجلات الحضور والانصراف.' 
        : 'Employee master files, payroll calculations, shift scheduling, and attendance management.'
    },
    {
      num: "5",
      icon: <Cpu className="w-8 h-8 text-blue-400" />,
      title: lang === 'ar' ? 'إدارة الأصول الثابتة' : 'Fixed Assets Management',
      desc: lang === 'ar' 
        ? 'تتبع الأصول الرأسمالية، قيود الإهلاك التلقائي، وجداول الصيانة الدورية ومواقع الأصول.' 
        : 'Capital asset tracking, automated depreciation entries, and periodic maintenance records.'
    },
    {
      num: "6",
      icon: <Sparkles className="w-8 h-8 text-blue-400" />,
      title: lang === 'ar' ? 'التحليل الذكي (Gemini AI)' : 'Intelligent Analytics (Gemini AI)',
      desc: lang === 'ar' 
        ? 'تحليل لحظي لمؤشرات الربحية والسيولة، كشف مبكر للشذوذ ومحاولات الاختلاس، وتوصيات استثمارية مدعومة بالذكاء الاصطناعي.' 
        : 'Real-time profitability & cash flow analytics, anomaly & fraud detection, and AI investment guidance.'
    },
  ];

  return (
    <div className="bg-slate-50 font-['Cairo',sans-serif]">
      {/* Jaw-Dropping Hero Section */}
      <section className="relative bg-[#050B14] text-white pt-28 pb-36 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/5">
        {/* Dynamic Glowing Orbs Background */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-[#d4af37]/30 to-[#f39c12]/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-[#1E3A8A]/40 to-[#0A2540]/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-[#1A6B3C]/15 blur-[160px] rounded-full pointer-events-none mix-blend-screen" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10 flex flex-col items-center">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 backdrop-blur-xl text-white px-5 py-2 rounded-full text-sm font-bold tracking-wider mb-10 shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:bg-white/10 transition-all cursor-default">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4af37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#d4af37]"></span>
            </span>
            <span className="text-[#d4af37]">v4.5</span>
            <span className="h-4 w-px bg-white/20 mx-1"></span>
            <span>{lang === 'ar' ? 'ميدو تك للحلول البرمجية - إبداع بلا حدود' : 'MeDo Tech Solutions - Limitless Innovation'}</span>
          </div>

          {/* Main Title - Stunning Gradient */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.15] drop-shadow-2xl">
            {lang === 'ar' ? (
              <>
                مستقبل إدارة الأعمال <br className="hidden sm:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#f1c40f] to-[#e67e22] filter drop-shadow-lg">
                  يبدأ من هنا.
                </span>
              </>
            ) : (
              <>
                The Future of Enterprise <br className="hidden sm:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#f1c40f] to-[#e67e22] filter drop-shadow-lg">
                  Begins Here.
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-slate-300 font-medium mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
            {lang === 'ar'
              ? 'منظومة MeDo ERP السحابية.. قوة الأداء، أناقة التصميم، وأمان بمستوى بنكي. نُعيد صياغة معايير الأنظمة الإدارية والمحاسبية لنجعل من تعقيدات العمل متعة بصرية وعملية.'
              : 'MeDo ERP Cloud Platform.. Power, Elegance, and Bank-grade Security. Redefining enterprise management standards to turn business complexities into visual and operational delight.'}
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            <Link 
              to="/pricing" 
              onClick={() => handleTrialClick('hero_free_trial')}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#d4af37] to-[#f39c12] hover:from-[#f39c12] hover:to-[#d4af37] text-[#0a1525] px-10 py-5 rounded-2xl text-lg font-black shadow-[0_10px_40px_rgba(212,175,55,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(212,175,55,0.6)] border-b-4 border-[#b8860b]"
            >
              <Sparkles className="w-6 h-6 text-[#0a1525] group-hover:animate-pulse" />
              <span>{lang === 'ar' ? 'ابدأ رحلة النجاح الآن' : 'Start Your Journey Now'}</span>
            </Link>
            
            <Link 
              to="/erp" 
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#0a1525]/80 hover:bg-[#0a1525] border border-white/10 hover:border-[#d4af37]/50 text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-xl shadow-xl hover:shadow-[0_10px_30px_rgba(10,37,64,0.5)]"
            >
              <Building2 className="w-6 h-6 text-[#d4af37]" />
              <span>{lang === 'ar' ? 'تسجيل الدخول للنظام' : 'Login to System'}</span>
            </Link>
          </div>

          {/* Features Strip */}
          <div className="mt-16 flex items-center justify-center gap-6 sm:gap-12 text-sm text-slate-400 flex-wrap font-semibold bg-white/5 border border-white/10 px-8 py-4 rounded-2xl backdrop-blur-md shadow-2xl">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#1e7e34]" />
              {lang === 'ar' ? 'حماية بنكية (256-bit)' : 'Bank-grade Security'}
            </span>
            <span className="hidden sm:block text-slate-600">|</span>
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#d4af37]" />
              {lang === 'ar' ? 'سرعة فائقة وأداء مذهل' : 'Lightning Fast Performance'}
            </span>
            <span className="hidden sm:block text-slate-600">|</span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#38bdf8]" />
              {lang === 'ar' ? 'مطابق لمعايير IFRS/GAAP' : 'IFRS/GAAP Compliant'}
            </span>
          </div>
        </div>
      </section>
      {/* Core Modules Section */}
      <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3.5 py-1 rounded-full text-xs font-black mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{lang === 'ar' ? 'شامل ومترابط' : 'Comprehensive & Integrated'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            {lang === 'ar' ? '✨ الوحدات الرئيسية في منظومة MeDo ERP' : '✨ Core Modules of MeDo ERP'}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            {lang === 'ar'
              ? 'كل ما تحتاجه لإدارة مؤسستك بكفاءة متناهية في بيئة عمل سحابية موحدة تجمع كافة الأقسام والمستويات الإدارية.'
              : 'Everything required to run your enterprise efficiently in a unified cloud environment.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreModules.map((module) => (
            <div 
              key={module.num} 
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition">
                    {module.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-300 group-hover:text-blue-500/40 transition">
                    0{module.num}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {module.title}
                </h3>
                <p className="text-base text-slate-600 leading-relaxed mb-6 font-medium">
                  {module.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600 group-hover:text-blue-800 transition">
                <span>{lang === 'ar' ? 'استكشف الوحدة' : 'Explore Module'}</span>
                <ArrowRight className="w-4 h-4 mr-1.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Numbers Section */}
      <section className="bg-white py-16 border-y border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: 'v4.2', label: lang === 'ar' ? 'إصدار المنظومة المعتمد' : 'Certified Release' },
            { num: '30 يوماً', label: lang === 'ar' ? 'فترة تجربة مجانية بالكامل' : 'Full Free Trial Period' },
            { num: 'IFRS', label: lang === 'ar' ? 'معايير محاسبية دولية' : 'Accounting Standards' },
            { num: '24/7', label: lang === 'ar' ? 'دعم فني واستشارات متواصلة' : 'Continuous Support' }
          ].map((stat, i) => (
            <div key={i} className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-[#0A0A0A] mb-2">{stat.num}</div>
              <div className="text-sm font-bold text-[#1A2B4C]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Box */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <div className="bg-gradient-to-br from-[#0A0A0A] to-[#1A2B4C] rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden border-2 border-[#B8860B]">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            {lang === 'ar' ? '🚀 ابدأ الآن وحوّل إدارة أعمالك' : '🚀 Start Now & Transform Your Business'}
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8 font-medium">
            {lang === 'ar'
              ? 'جرب النظام مجاناً لمدة 30 يوماً، أو اطلب عرضاً توضيحياً مخصصاً لفريقك للاطلاع على كافة الإمكانيات.'
              : 'Try the system free for 30 days, or request a customized demo for your team.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/pricing"
              className="w-full sm:w-auto bg-[#B8860B] hover:bg-[#996515] text-white px-8 py-3.5 rounded-xl font-black text-sm shadow-md transition"
            >
              {lang === 'ar' ? 'جرب النظام مجاناً لمدة 30 يوماً' : 'Try Free for 30 Days'}
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold text-sm transition"
            >
              {lang === 'ar' ? 'اطلب عرضاً توضيحياً لفريقك' : 'Request a Team Demo'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

