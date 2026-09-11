import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { trackEvent } from '../../components/marketing/AnalyticsTracker';

export const PricingPage = () => {
  const { lang } = useLanguage();
  return (
    <div className="p-16 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-[#0A2540] mb-12 text-center">{lang === 'ar' ? 'خطط الأسعار' : 'Pricing Plans'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
            { name: lang === 'ar' ? 'الأساسية' : 'Essential', desc: lang === 'ar' ? 'للشركات الناشئة' : 'For Startups' },
            { name: lang === 'ar' ? 'المتقدمة' : 'Advanced', desc: lang === 'ar' ? 'للشركات المتوسطة' : 'For SMEs' },
            { name: lang === 'ar' ? 'المؤسسية' : 'Enterprise', desc: lang === 'ar' ? 'للمؤسسات الكبرى' : 'For Large Enterprises' }
        ].map((plan) => (
          <div key={plan.name} className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-sap-secondary text-center">
            <h2 className="text-2xl font-bold text-[#0A2540] mb-4">{plan.name}</h2>
            <p className="text-gray-600 mb-6">{plan.desc}</p>
            <button 
              onClick={() => trackEvent('conversion', { plan: plan.name })}
              className="bg-sap-secondary text-[#0A2540] px-6 py-2 rounded font-bold hover:bg-yellow-600 transition"
            >
              {lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};