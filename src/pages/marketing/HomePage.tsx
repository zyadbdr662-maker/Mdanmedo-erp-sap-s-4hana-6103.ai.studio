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
  Laptop
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
    <div className="bg-slate-50 font-['Alexandria','Cairo',sans-serif]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0B192C] via-[#0F284E] to-[#081220] text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#1E3A8A]/50">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[130px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/40 text-blue-200 px-4 py-1.5 rounded-full text-xs font-black tracking-wide mb-6 shadow-sm">
            <Building2 className="w-4 h-4 text-blue-300" />
            <span>{lang === 'ar' ? 'ميدو تك للحلول البرمجية بالشراكة مع بن زياد المتحدة' : 'MeDo Tech Solutions & Bin Ziad United'}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
            {lang === 'ar' ? '🏢 نظام MeDo ERP' : '🏢 MeDo ERP System'}
          </h1>

          <p className="text-xl sm:text-2xl text-slate-100 font-bold mb-4 max-w-3xl mx-auto leading-relaxed">
            {lang === 'ar'
              ? 'منصة سحابية متكاملة لإدارة المؤسسات وفق معايير عالمية (IFRS/GAAP)، مع ربط لحظي لكافة الأقسام والفروع.'
              : 'An integrated cloud platform for enterprise management compliant with international standards (IFRS/GAAP), with real-time sync across departments & branches.'}
          </p>

          <p className="text-base text-slate-300 mb-10 max-w-2xl mx-auto font-medium">
            {lang === 'ar'
              ? 'مصمم خصيصاً ليلائم واقع السوق المحلي والإقليمي، مع أمان بمستوى بنكي ودعم كامل لفرق العملات والمحافظ الإلكترونية وتعدد الفروع والمستودعات.'
              : 'Designed to fit local market realities with bank-grade security, currency exchange handling, and multi-branch management.'}
          </p>

          {/* Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/pricing" 
              onClick={() => handleTrialClick('hero_free_trial')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8] hover:from-[#2563EB] hover:to-[#1E3A8A] text-white px-8 py-4 rounded-xl text-base font-black shadow-lg shadow-blue-950/60 border border-blue-300/40 transition transform hover:-translate-y-0.5"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>{lang === 'ar' ? '🚀 جرب مجاناً (30 يوماً)' : '🚀 Try Free (30 Days)'}</span>
            </Link>

            <Link 
              to="/contact" 
              onClick={() => handleTrialClick('hero_request_demo')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white px-8 py-4 rounded-xl text-base font-bold transition transform hover:-translate-y-0.5 backdrop-blur-sm"
            >
              <Laptop className="w-5 h-5 text-blue-300" />
              <span>{lang === 'ar' ? 'اطلب عرضاً توضيحياً لفريقك' : 'Request a Demo'}</span>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-300 flex-wrap font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              {lang === 'ar' ? 'بدون بطاقة ائتمان للتجربة' : 'No credit card required'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              {lang === 'ar' ? 'تفعيل فوري خلال دقيقة' : 'Instant activation'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              {lang === 'ar' ? 'دعم العمل دون اتصال (Offline-First)' : 'Offline-first enabled'}
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

