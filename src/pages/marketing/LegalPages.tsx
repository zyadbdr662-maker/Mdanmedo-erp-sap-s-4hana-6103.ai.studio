import React from 'react';
import { PrivacyPolicyDocument } from '../../components/PrivacyPolicyDocument';
import { TermsOfServiceDocument } from '../../components/TermsOfServiceDocument';

export const PrivacyPage = () => (
  <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto">
      <PrivacyPolicyDocument />
    </div>
  </div>
);

export const TermsPage = () => (
  <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-5xl mx-auto">
      <TermsOfServiceDocument />
    </div>
  </div>
);

export const DisclaimerPage = () => (
  <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-100" dir="rtl">
    <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
      <h1 className="text-3xl font-black text-amber-400">إخلاء المسؤولية القانونية — منصة MeDo ERP</h1>
      <p className="text-sm text-slate-300 leading-relaxed">
        تُقدم منصة MeDo ERP للأغراض المحاسبية والإدارية السحابية "كما هي" و"حسب توفرها". تقع مسؤولية صحة ودقة البيانات والمدخلات والقيود المحاسبية على عاتق المستخدم والمستأجر.
      </p>
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
        <p>• لا تُعد منصة MeDo ERP بديلاً عن الاستشارات القانونية أو الضريبية المتخصصة.</p>
        <p>• لا يتحمل المزود أي مسؤولية عن القرارات التجارية أو الضريبية التي تتخذها المنشأة استناداً إلى تقارير النظام دون مراجعة مدقق حسابات قانوني معتمد.</p>
      </div>
      <div className="text-xs text-slate-500 font-mono">
        © 2026 ميدو تك للحلول البرمجية — جميع الحقوق محفوظة.
      </div>
    </div>
  </div>
);
