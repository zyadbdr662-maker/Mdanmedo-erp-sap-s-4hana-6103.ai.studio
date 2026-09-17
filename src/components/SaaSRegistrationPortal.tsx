import React, { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  User,
  Globe2,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Server,
  KeyRound,
  Copy,
  ExternalLink,
  Loader2,
  Check
} from "lucide-react";
import { executeRecaptchaV3 } from "../services/recaptcha";
import { SecurityAuditService } from "../services/securityAuditService";
import { generateClientPortalUrl, OFFICIAL_APP_DOMAIN } from "../config/appConfig";

interface SaaSRegistrationPortalProps {
  onCancel: () => void;
  onRegistrationSuccess: (tenantUrl: string, formData: any) => void;
}

export const SaaSRegistrationPortal: React.FC<SaaSRegistrationPortalProps> = ({
  onCancel,
  onRegistrationSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form Data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyName: "",
    industry: "RETAIL",
    country: "YE",
  });

  // Generated Tenant Data
  const [tenantData, setTenantData] = useState<{
    url: string;
    licenseKey: string;
    username: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        setError("يرجى تعبئة جميع البيانات الشخصية المطلوبة.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("يرجى إدخال بريد إلكتروني صحيح.");
        return;
      }
    }
    setError("");
    setStep((s) => (s + 1) as 1 | 2 | 3);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName) {
      setError("يرجى إدخال اسم المنشأة أو الشركة.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      // 1. Security Check (reCAPTCHA v3)
      const recaptchaRes = await executeRecaptchaV3("register");
      
      if (!recaptchaRes.success || recaptchaRes.isBotRisk || recaptchaRes.score < 0.5) {
        SecurityAuditService.getInstance().recordAuditLog({
          action: "SECURITY_ALERT",
          username: "غير معروف",
          email: formData.email,
          riskLevel: "HIGH",
          details: `تم حظر محاولة تسجيل حساب تجريبي جديد للشركة ${formData.companyName} بسبب رصد نشاط آلي (Bot).`,
          status: "BLOCKED",
          deviceInfo: "SaaS Onboarding",
        });
        setError("⚠️ تم اكتشاف نشاط مشبوه أو سلوك آلي عبر Google reCAPTCHA v3. تم حظر محاولة التسجيل لحماية النظام.");
        setIsLoading(false);
        return;
      }

      // 2. Simulate Cloud Provisioning (Database & Tenant Creation)
      setTimeout(() => {
        const slug = formData.companyName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .substring(0, 15) || "erp";
        const randomId = Math.random().toString(36).substring(2, 8);
        const tenantUrl = generateClientPortalUrl(`${slug}-${randomId}`);
        const licenseKey = `MEDO-TRIAL-${randomId.toUpperCase()}-${new Date().getFullYear()}`;

        setTenantData({
          url: tenantUrl,
          licenseKey: licenseKey,
          username: formData.email,
        });

        // Audit Log for successful tenant creation
        SecurityAuditService.getInstance().recordAuditLog({
          action: "SETTINGS_MODIFIED",
          username: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          riskLevel: "LOW",
          details: `تم إنشاء مساحة عمل مؤسسية سحابية جديدة (Tenant) بنجاح لشركة: ${formData.companyName}. رابط الدخول: ${tenantUrl}`,
          status: "SUCCESS",
          deviceInfo: "SaaS Onboarding",
        });

        setStep(3);
        setIsLoading(false);
      }, 2500); // Simulate provisioning time
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء إعداد النسخة التجريبية.");
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#060B14] flex flex-col items-center justify-center p-4 sm:p-8" dir="rtl">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] opacity-50 mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      </div>

      <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl relative z-10 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950/50 border-b border-slate-800 p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <Globe2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">إنشاء مساحة عمل سحابية</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-md">
            احصل على نسختك التجريبية المعزولة تماماً من نظام SAP/MeDO ERP بأعلى معايير الأمان (SAP Standards).
          </p>
        </div>

        {/* Progress Bar */}
        {step < 3 && (
          <div className="px-8 pt-6 pb-2">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-10" />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  step >= 1 ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]" : "bg-slate-900 border-slate-700 text-slate-500"
                }`}
              >
                1
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  step >= 2 ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]" : "bg-slate-900 border-slate-700 text-slate-500"
                }`}
              >
                2
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                  step >= 3 ? "bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-slate-900 border-slate-700 text-slate-500"
                }`}
              >
                3
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-2 px-1">
              <span>البيانات الشخصية</span>
              <span>بيانات المنشأة</span>
              <span>تجهيز المنصة</span>
            </div>
          </div>
        )}

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 animate-fade-in">
              <ShieldCheck className="w-5 h-5 text-rose-400 shrink-0" />
              <p className="text-sm font-semibold text-rose-300">{error}</p>
            </div>
          )}

          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">الاسم الأول *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="أحمد"
                      className="w-full pl-3 pr-9 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 ml-1">الاسم الأخير *</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="بن زياد"
                      className="w-full pl-3 pr-9 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 ml-1">البريد الإلكتروني للعمل *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@company.com"
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors text-left"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 ml-1">رقم الهاتف النشط *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+967 77X XXX XXX"
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors text-left"
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white font-bold transition flex items-center justify-center"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-[2] px-4 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <span>التالي</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Company Details */}
          {step === 2 && (
            <form onSubmit={handleRegister} className="space-y-5 animate-fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 ml-1">اسم المنشأة أو الشركة *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="مجموعة النهضة التجارية..."
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 ml-1">مجال العمليات الأساسي</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                  >
                    <option value="RETAIL">التجارة والتجزئة والاستيراد</option>
                    <option value="MFG">التصنيع والإنتاج</option>
                    <option value="SERVICES">الخدمات والاستشارات</option>
                    <option value="CONSTRUCTION">المقاولات والبناء</option>
                    <option value="OTHER">أخرى (سيتم تخصيص النظام)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 ml-1">الدولة / المنطقة</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="YE">الجمهورية اليمنية</option>
                  <option value="SA">المملكة العربية السعودية</option>
                  <option value="AE">الإمارات العربية المتحدة</option>
                  <option value="OTHER">دولة أخرى</option>
                </select>
              </div>

              {/* Data Privacy & Isolation Assurance */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300">عزل تام للبيانات السحابية</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  يتم توفير مساحة سحابية مستقلة (Tenant) لشركتك. بياناتك المالية، قواعد المخزون، والقيود المحاسبية معزولة تماماً عن أي أطراف أخرى، ولا تشارك المنصة السحابية أي موارد داخلية.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700">AES-256 Encrypted</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700">Dedicated DB</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-800 text-slate-300 border border-slate-700">reCAPTCHA v3 Protected</span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white font-bold transition flex items-center justify-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-[2] px-4 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg ${
                    isLoading 
                      ? "bg-blue-600/50 text-white/50 cursor-not-allowed shadow-none" 
                      : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جاري إعداد بيئة العمل...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5" />
                      <span>إنشاء المنصة وإصدار الرابط</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success & Credentials */}
          {step === 3 && tenantData && (
            <div className="space-y-6 animate-fade-in text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white">تم إعداد منصتك بنجاح!</h3>
                <p className="text-sm text-slate-400">
                  تم تجهيز بيئة ERP المخصصة لشركة <span className="font-bold text-white">{formData.companyName}</span>.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-right space-y-5">
                {/* Dedicated URL */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-blue-400" />
                    رابط المنصة الخاص بشركتك
                  </label>
                  <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl p-3">
                    <span className="text-sm font-mono font-bold text-emerald-400" dir="ltr">{tenantData.url}</span>
                    <button 
                      onClick={() => copyToClipboard(tenantData.url)}
                      className="text-slate-400 hover:text-white transition"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* License Key */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    مفتاح الترخيص التجريبي (License Key)
                  </label>
                  <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-xl p-3">
                    <span className="text-[11px] font-mono text-amber-300" dir="ltr">{tenantData.licenseKey}</span>
                    <button 
                      onClick={() => copyToClipboard(tenantData.licenseKey)}
                      className="text-slate-400 hover:text-white transition"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-blue-300">جاهز للبدء</p>
                    <p className="text-xs text-blue-200/70 leading-relaxed">
                      اسم المستخدم الخاص بك هو: <span className="font-mono text-blue-300 font-bold">{tenantData.username}</span>. يرجى الاحتفاظ بالرابط ومفتاح الترخيص. يمكنك الآن الدخول لمنصتك المعزولة وبدء العمل.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onRegistrationSuccess(tenantData.url, formData)}
                  className="w-full px-4 py-3.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                >
                  <span>الدخول إلى المنصة المخصصة الآن</span>
                  <ExternalLink className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Protected by reCAPTCHA badge */}
      {step < 3 && (
        <div className="mt-8 text-center opacity-60">
          <p className="text-[10px] text-slate-400 font-medium font-sans">
            محمي بواسطة <strong className="text-white">reCAPTCHA v3</strong> و <strong className="text-white">SAP Cloud Protocol</strong><br/>
            تطبق سياسة الخصوصية وشروط الخدمة.
          </p>
        </div>
      )}
    </div>
  );
};
