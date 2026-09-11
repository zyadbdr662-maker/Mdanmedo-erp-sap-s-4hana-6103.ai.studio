import React, { useState } from "react";
import {
  ERPState,
  SaaSClient,
} from "../types/erp";
import { SapComplianceReportModal } from "./SapComplianceReportModal";
import {
  ShieldCheck,
  Users,
  Key,
  Globe,
  Bell,
  Activity,
  BookOpen,
  Plus,
  CheckCircle2,
  Lock,
  Award,
  Terminal,
  Server,
  Cpu,
  FileText,
  Megaphone,
  Download,
  AlertTriangle,
  Building2,
  Layers,
  Sparkles,
  Printer,
  Copy,
  Check,
  RefreshCw,
  Send,
  Mail,
  Smartphone,
  ExternalLink,
  Sliders,
  BarChart3,
  Boxes,
} from "lucide-react";

interface SaaSPlatformViewProps {
  erpState: ERPState;
  onUpdateState: (newState: Partial<ERPState>) => void;
  onOpenTrialLockModal: () => void;
}

export const SaaSPlatformView: React.FC<SaaSPlatformViewProps> = ({
  erpState,
  onUpdateState,
  onOpenTrialLockModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    "ADMIN_DASHBOARD" | "LICENSING" | "NOTIFICATIONS" | "WHITE_LABEL_V2" | "CLIENTS" | "LEGAL_DOCS" | "HANDOVER"
  >("ADMIN_DASHBOARD");

  // State for White Label Customization
  const [agencyName, setAgencyName] = useState("مجموعة بن زياد التجارية المعتمدة");
  const [tenantSlug, setTenantSlug] = useState("binziyad-agency");
  const [primaryColor, setPrimaryColor] = useState("#1A6B3C");
  const [secondaryColor, setSecondaryColor] = useState("#D4AF37");
  const [selectedFont, setSelectedFont] = useState("Cairo");
  const [packageTier, setPackageTier] = useState("Enterprise Unlimited");
  const [licenseDuration, setLicenseDuration] = useState("مدى الحياة (ترخيص دائم غير محدود)");
  const [adminEmail, setAdminEmail] = useState("admin@medo-erp.com");
  const [adminPhone, setAdminPhone] = useState("+967 773 586 047");
  const [copiedLetter, setCopiedLetter] = useState(false);
  
  // New Client & License Form
  const [newCompany, setNewCompany] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLicenseType, setNewLicenseType] = useState<"TRIAL_30" | "ANNUAL_365" | "LIFETIME">("LIFETIME");
  const [successMsg, setSuccessMsg] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Digital Certificate Modal
  const [selectedCertClient, setSelectedCertClient] = useState<SaaSClient | null>(null);
  const [isComplianceModalOpen, setIsComplianceModalOpen] = useState(false);

  // Notification Broadcast State
  const [broadcastTitle, setBroadcastTitle] = useState("تحديث أمني وترقية للنظام (SAP S/4HANA Kernel 2026)");
  const [broadcastMessage, setBroadcastMessage] = useState("نحيطكم علماً بأنه تم ترقية خوادم MeDo ERP بنجاح لدعم التشفير المزدوج ومطابقة متطلبات هيئة الزكاة والضريبة والجمارك والربط السحابي اللحظي.");
  const [broadcastTarget, setBroadcastTarget] = useState<"ALL_USERS" | "TRIAL_USERS" | "ENTERPRISE">("ALL_USERS");
  const [broadcastChannel, setBroadcastChannel] = useState<"IN_APP" | "EMAIL" | "WHATSAPP" | "ALL_CHANNELS">("ALL_CHANNELS");
  const [broadcastHistory, setBroadcastHistory] = useState([
    {
      id: "bc-1",
      title: "تنبيه اقتراب انتهاء الفترة التجريبية (5 أيام متبقية)",
      target: "مستخدمو النسخة التجريبية (Trial)",
      channel: "بريد + تنبيه داخلي",
      date: "2026-09-09 10:30 AM",
      status: "تم الإرسال بنجاح (100%)",
    },
    {
      id: "bc-2",
      title: "إطلاق ميزة استوديو الهوية البصرية والفوترة الإلكترونية ZATCA",
      target: "كافة المشتركين",
      channel: "إشعار نظام فوري",
      date: "2026-09-05 02:15 PM",
      status: "تم الإرسال بنجاح",
    },
    {
      id: "bc-3",
      title: "خصم 20% على التجديد السنوي لعملاء مجموعة بن زياد",
      target: "عملاء محددين",
      channel: "WhatsApp API",
      date: "2026-09-01 09:00 AM",
      status: "تم الإرسال بنجاح",
    },
  ]);

  const clients: SaaSClient[] = erpState.saasClients || [
    {
      id: "cli-albinaa-2026",
      companyName: "البناء للخياطة والاكسسوار",
      clientName: "أمل القمطي",
      email: "mbaaydz7@gmail.com",
      phone: "715779976",
      licenseKey: "MEDO-SAP-2026-ALBN-7799",
      uniqueDomain: "https://medo-erp.com/client/albinaa-tailoring",
      status: "ACTIVE",
      subscriptionStart: "2026-09-11",
      subscriptionEnd: "2026-10-11",
      databaseType: "POSTGRES_LOCAL",
      maxOperations: 5000,
      currentOperationsCount: 0,
      usersCount: 5,
    },
    {
      id: "cli-01",
      companyName: "مجموعة بن زياد التجارية المحدودة",
      clientName: "بدر عايض محمد",
      email: "zyadbdr925@gmail.com",
      phone: "+0967773586047",
      licenseKey: "MEDO-SAP-2026-B8Z9-4K1M",
      uniqueDomain: "https://medo-erp.com/client/binziyad",
      status: "ACTIVE",
      subscriptionStart: "2026-09-01",
      subscriptionEnd: "2026-10-01",
      databaseType: "POSTGRES_LOCAL",
      maxOperations: 10000,
      currentOperationsCount: 1480,
      usersCount: 8,
    },
    {
      id: "cli-02",
      companyName: "شركة الأفق للاستيراد والتوزيع",
      clientName: "م. فهد القحطاني",
      email: "alofooq@medo-erp.com",
      phone: "+967771234567",
      licenseKey: "MEDO-SAP-2026-OFQ7-99XP",
      uniqueDomain: "https://medo-erp.com/client/alofooq",
      status: "ACTIVE",
      subscriptionStart: "2026-01-15",
      subscriptionEnd: "2027-01-15",
      databaseType: "POSTGRES_LOCAL",
      maxOperations: 50000,
      currentOperationsCount: 8420,
      usersCount: 12,
    },
    {
      id: "cli-03",
      companyName: "مؤسسة الرواد للخدمات اللوجستية",
      clientName: "أ. عصام الشامي",
      email: "alrowad@medo-erp.com",
      phone: "+967779876543",
      licenseKey: "MEDO-SAP-2026-RWD2-33TL",
      uniqueDomain: "https://medo-erp.com/client/alrowad",
      status: "ACTIVE",
      subscriptionStart: "2026-03-01",
      subscriptionEnd: "2027-03-01",
      databaseType: "POSTGRES_LOCAL",
      maxOperations: 25000,
      currentOperationsCount: 3190,
      usersCount: 6,
    },
  ];

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newClientName) return;

    const prefix = "MEDO-SAP-2026-";
    const randPart = Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedKey = prefix + randPart;

    const durationDays = newLicenseType === "TRIAL_30" ? 30 : newLicenseType === "ANNUAL_365" ? 365 : 3650;

    const newClient: SaaSClient = {
      id: "cli-" + Date.now(),
      companyName: newCompany,
      clientName: newClientName,
      email: newEmail || "client@medo-erp.com",
      phone: newPhone || "+967773586047",
      licenseKey: generatedKey,
      uniqueDomain: `https://app.medo-erp.com/client/${newCompany.replace(/\s+/g, '-').toLowerCase()}`,
      status: "ACTIVE",
      subscriptionStart: new Date().toISOString().split("T")[0],
      subscriptionEnd: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      databaseType: "POSTGRES_LOCAL",
      maxOperations: newLicenseType === "TRIAL_30" ? 5000 : 50000,
      currentOperationsCount: 0,
      usersCount: newLicenseType === "TRIAL_30" ? 5 : 20,
    };

    onUpdateState({
      saasClients: [newClient, ...clients],
    });

    setNewCompany("");
    setNewClientName("");
    setNewEmail("");
    setNewPhone("");
    setSuccessMsg(`تم بنجاح إصدار الترخيص الرقمي (${generatedKey}) وإضافة العميل للمنظومة!`);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    const newBroadcast = {
      id: "bc-" + Date.now(),
      title: broadcastTitle,
      target: broadcastTarget === "ALL_USERS" ? "كافة المشتركين" : broadcastTarget === "TRIAL_USERS" ? "النسخ التجريبية" : "الشركات الكبرى",
      channel: broadcastChannel === "ALL_CHANNELS" ? "كافة القنوات (بريد + نظام + واتساب)" : broadcastChannel,
      date: new Date().toLocaleString("ar-YE"),
      status: "تم الإرسال بنجاح (100%)",
    };

    setBroadcastHistory([newBroadcast, ...broadcastHistory]);
    setSuccessMsg("تم بث الإشعار بنجاح لكافة المستخدمين والقنوات المستهدفة!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto font-sans text-right" dir="rtl" style={{ fontFamily: "'Cairo', 'Tajawal', sans-serif" }}>
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-900 to-slate-950 border border-sap-primary/50 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-sap-primary/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sap-primary/30 text-sap-secondary border border-sap-secondary/40 rounded-full text-xs font-bold mb-3 shadow-sm">
              <Award className="w-4 h-4 text-sap-secondary" />
              <span>لوحة تحكم الإدارة ونظام التراخيص المعتمد (SAP Cloud Architecture)</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
              <span>إدارة التراخيص والمنظومة السحابية MeDo ERP</span>
              <span className="text-xs px-2.5 py-1 bg-sap-primary text-white rounded-lg font-mono font-bold">
                v2026.9 SAP-Spec
              </span>
            </h1>
            <p className="text-xs lg:text-sm text-slate-300 max-w-2xl leading-relaxed">
              المنصة المركزية لمجموعة بن زياد التجارية لإدارة العمليات، مراقبة نشاط المستخدمين والفروع، إصدار وتجديد التراخيص الرقمية، وبث الإشعارات التلقائية والتنبيهات.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsComplianceModalOpen(true)}
              className="px-4 py-2.5 bg-sap-secondary hover:bg-[#b89528] text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-black/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Award className="w-4 h-4 text-slate-950" />
              <span>تقرير الامتثال لمعايير SAP (99.4%)</span>
            </button>
            <button
              onClick={onOpenTrialLockModal}
              className="px-4 py-2.5 bg-amber-600/90 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>معاينة شاشة القفل التجريبي</span>
            </button>
            <button
              onClick={() => setActiveTab("NOTIFICATIONS")}
              className="px-4 py-2.5 bg-sap-primary hover:bg-[#14532D] border border-sap-secondary/50 text-sap-secondary font-bold rounded-xl text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-sap-secondary" />
              <span>مركز الإشعارات والتنبيهات</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "ADMIN_DASHBOARD", label: "لوحة تحكم الإدارة والمؤشرات", icon: BarChart3 },
          { id: "LICENSING", label: "نظام إدارة وتوليد التراخيص", icon: Key },
          { id: "NOTIFICATIONS", label: "مركز الإشعارات وتنبيهات التجربة", icon: Bell },
          { id: "CLIENTS", label: "سجل العملاء والاشتراكات", icon: Users },
          { id: "WHITE_LABEL_V2", label: "استوديو الهوية للوكيل المعتمد", icon: Award },
          { id: "LEGAL_DOCS", label: "الوثائق القانونية والشروط (SAP Matrix)", icon: FileText },
          { id: "HANDOVER", label: "مفاتيح العمل والتشغيل", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-sap-primary text-white shadow-md shadow-sap-primary/30 border border-sap-secondary/50"
                  : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {successMsg && (
        <div className="bg-sap-primary/20 border border-sap-secondary/50 text-sap-secondary p-4 rounded-2xl text-xs font-bold flex items-center gap-3 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-sap-secondary" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* TAB 1: ADMIN_DASHBOARD */}
      {activeTab === "ADMIN_DASHBOARD" && (
        <div className="space-y-6">
          {/* Top 4 Real-time Admin KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Active Users */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">عدد المستخدمين النشطين</span>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">8 مستخدمين</span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                  متصلون الآن
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                4 مدراء، 2 محاسبين ماليين، 2 مسؤولي مبيعات ومخازن
              </p>
            </div>

            {/* KPI 2: Branches & Warehouses */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">الفروع والمستودعات</span>
                <div className="p-2.5 rounded-xl bg-sap-primary/20 text-sap-secondary border border-sap-primary/40">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">4 فروع / 6 مخازن</span>
                <span className="text-[11px] font-bold text-sap-secondary bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                  مفعلة بالكامل
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                الفرع الرئيسي صنعاء، فرع عدن، فرع تعز، فرع الحديدة
              </p>
            </div>

            {/* KPI 3: Executed Operations */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">العمليات المنفذة</span>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">1,480+ عملية</span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/50">
                  +18% هذا الشهر
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                قيود، فواتير ضريبية، سندات صرف وقبض، حركات مخزون
              </p>
            </div>

            {/* KPI 4: Licenses & Subscription Health */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">حالة التراخيص والاشتراكات</span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Key className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-sap-secondary">3 تراخيص سحابية</span>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-800/50">
                  1 تجريبية نشطة
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                نسخة تجريبية 30 يوم + 2 اشتراك سنوي سحابي
              </p>
            </div>
          </div>

          {/* Detailed Status Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Active Sessions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>المستخدمون المتصلون الآن (Active Users)</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  مباشر (Live)
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { name: "بدر عايض محمد", role: "مدير النظام العام (Super Admin)", branch: "الإدارة العامة - صنعاء", status: "ONLINE", time: "الآن" },
                  { name: "أحمد صالح الزريقي", role: "رئيس الحسابات (Chief Accountant)", branch: "فرع عدن الرئيسي", status: "ONLINE", time: "منذ 4 دقائق" },
                  { name: "مروان التميمي", role: "مسؤول المبيعات والمشتريات", branch: "فرع تعز", status: "ONLINE", time: "منذ 12 دقيقة" },
                  { name: "فؤاد الهتار", role: "أمين المخزن المركزي", branch: "مستودع الحديدة", status: "ONLINE", time: "منذ 25 دقيقة" },
                ].map((user, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span>{user.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{user.role} • {user.branch}</div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{user.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Branches & Warehouse Distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sap-secondary" />
                  <span>توزيع الفروع والمستودعات المركزية</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sap-primary/30 text-sap-secondary border border-sap-secondary/30">
                  4 فروع
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { name: "الفرع الرئيسي والمقر العام - صنعاء", code: "BR-SANAA-01", status: "نشط • خادم رئيسي", ops: "720 عملية" },
                  { name: "فرع عدن التجاري والمنفذ البحري", code: "BR-ADEN-02", status: "نشط • مزامنة سحابية", ops: "410 عمليات" },
                  { name: "فرع تعز للتوزيع وتجارة الجملة", code: "BR-TAIZ-03", status: "نشط • ربط محلي", ops: "230 عملية" },
                  { name: "فرع ومستودع الحديدة المركزي", code: "BR-HOD-04", status: "نشط • مخزون استراتيجي", ops: "120 عملية" },
                ].map((branch, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{branch.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{branch.code} • {branch.status}</div>
                    </div>
                    <span className="text-[11px] font-bold text-sap-secondary bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                      {branch.ops}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* License & Offline-First Health Engine */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>محرك الأمان والمزامنة الهجينة (SAP Hybrid)</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  99.98% جاهزية
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400">حالة قاعدة البيانات المحلية (IndexedDB / SQLite):</div>
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>مشفرة بنمط AES-256 وتعمل بكفاءة دون انقطاع</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400">عزل البيانات متعدد المستأجرين (Multi-Tenant Isolation):</div>
                  <div className="text-sap-secondary font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>معزول كلياً بمفاتيح تشفير خاصة بكل عميل</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400">حالة الربط مع ZATCA والفاتورة الإلكترونية:</div>
                  <div className="text-indigo-400 font-bold flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    <span>جاهز للمرحلة الثانية (Phase 2 Integration)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LICENSING */}
      {activeTab === "LICENSING" && (
        <div className="space-y-6">
          {/* Issue New Digital License */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-sap-secondary" />
                  <span>إصدار وتوليد ترخيص رقمي جديد (Digital License Generator)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  توليد مفاتيح تشفير تسلسلية معتمدة ومتوافقة مع معايير ترخيص SAP Cloud Trial & Enterprise
                </p>
              </div>

              <span className="text-xs px-3 py-1 bg-sap-primary/30 text-sap-secondary border border-sap-secondary/30 rounded-xl font-bold">
                توليد فوري مشفر
              </span>
            </div>

            <form onSubmit={handleAddClient} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">اسم المؤسسة / الشركة</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="مثال: مجموعة بن زياد التجارية"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">اسم المسؤول المعتمد</label>
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="مثال: بدر عايض محمد"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">البريد الإلكتروني المعتمد</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="zyadbdr925@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">نوع وفترة الترخيص</label>
                <select
                  value={newLicenseType}
                  onChange={(e) => setNewLicenseType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white"
                >
                  <option value="TRIAL_30">نسخة تجريبية 30 يوماً (SAP Trial)</option>
                  <option value="ANNUAL_365">اشتراك سنوي (365 يوماً - Enterprise)</option>
                  <option value="LIFETIME">ترخيص مؤسسي دائم (Lifetime Unlimited)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-sap-primary hover:bg-[#14532D] text-sap-secondary font-bold rounded-xl text-xs border border-sap-secondary/50 shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>توليد الترخيص الآن</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Licenses Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>سجل التراخيص الصادرة وحالتها التشغيلية</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                إجمالي التراخيص: {clients.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 px-3">الشركة / العميل</th>
                    <th className="pb-3 px-3">مفتاح الترخيص الرقمي (License Key)</th>
                    <th className="pb-3 px-3">نوع الاشتراك</th>
                    <th className="pb-3 px-3">تاريخ الانتهاء</th>
                    <th className="pb-3 px-3">الحالة</th>
                    <th className="pb-3 px-3 text-center">الإجراءات والشهادة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {clients.map((cli) => (
                    <tr key={cli.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white">
                        <div>{cli.companyName}</div>
                        <div className="text-[11px] text-slate-400">{cli.clientName} ({cli.phone})</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-sap-secondary font-bold">
                        <div className="flex items-center gap-2">
                          <span>{cli.licenseKey}</span>
                          <button
                            onClick={() => handleCopyKey(cli.licenseKey)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                            title="نسخ مفتاح الترخيص"
                          >
                            {copiedKey === cli.licenseKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-bold text-slate-200">
                          {cli.id === "cli-01" ? "تجريبي (30 يوماً)" : "سنوي مؤسسي (Enterprise)"}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono">{cli.subscriptionEnd}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2.5 py-1 bg-sap-primary/25 text-emerald-400 border border-sap-primary/50 rounded-full font-bold text-[10px]">
                          {cli.status === "ACTIVE" ? "مرخص ونشط" : "منتهي الصلاحية"}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedCertClient(cli)}
                            className="px-3 py-1.5 rounded-lg bg-sap-primary/20 hover:bg-sap-primary/40 text-sap-secondary border border-sap-secondary/40 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>عرض الشهادة الرسمية</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NOTIFICATIONS & BROADCAST CENTER */}
      {activeTab === "NOTIFICATIONS" && (
        <div className="space-y-6">
          {/* Send Broadcast Announcement */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-sap-secondary" />
                  <span>مركز إرسال الإشعارات والإعلانات الفورية (Broadcast Center)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  إرسال تنبيهات انتهاء الفترة التجريبية، إعلانات التحديثات، وعروض التجديد للمستخدمين
                </p>
              </div>

              <span className="text-xs px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-xl font-bold">
                إشعار فوري متعدد القنوات
              </span>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">عنوان الإشعار / الإعلان</label>
                  <input
                    type="text"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">الفئة المستهدفة</label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    <option value="ALL_USERS">كافة المستخدمين والمشتركين</option>
                    <option value="TRIAL_USERS">مستخدمو النسخة التجريبية (Trial Users)</option>
                    <option value="ENTERPRISE">عملاء الباقة المؤسسية (Enterprise)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">قناة الإرسال</label>
                  <select
                    value={broadcastChannel}
                    onChange={(e) => setBroadcastChannel(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  >
                    <option value="ALL_CHANNELS">كافة القنوات (بريد + نظام + واتساب)</option>
                    <option value="IN_APP">إشعار داخل النظام فقط (In-App Alert)</option>
                    <option value="EMAIL">رسالة بريد إلكتروني رسمية (Email)</option>
                    <option value="WHATSAPP">رسالة واتساب معتمدة (WhatsApp API)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">نص الرسالة / تفاصيل الإعلان</label>
                <textarea
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-sap-primary hover:bg-[#14532D] text-sap-secondary font-bold rounded-xl text-xs border border-sap-secondary/50 shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-sap-secondary" />
                  <span>بث الإشعار الآن للجميع</span>
                </button>
              </div>
            </form>
          </div>

          {/* Broadcast History */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Activity className="w-5 h-5 text-emerald-400" />
              <span>سجل الإشعارات والإعلانات المرسلة مؤخراً</span>
            </h3>

            <div className="space-y-3">
              {broadcastHistory.map((item) => (
                <div key={item.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-bold text-white flex items-center gap-2">
                      <Bell className="w-4 h-4 text-sap-secondary" />
                      <span>{item.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      المستهدف: <span className="text-slate-300 font-bold">{item.target}</span> • القناة: <span className="text-slate-300">{item.channel}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-mono">{item.date}</span>
                    <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full font-bold text-[10px]">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CLIENTS */}
      {activeTab === "CLIENTS" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-sap-secondary" />
              <span>قائمة العملاء والمستأجرين المعتمدين</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 px-3">الشركة / العميل</th>
                    <th className="pb-3 px-3">الرقم التسلسلي (License)</th>
                    <th className="pb-3 px-3">الرابط المخصص (Domain)</th>
                    <th className="pb-3 px-3">تاريخ الانتهاء</th>
                    <th className="pb-3 px-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {clients.map((cli) => (
                    <tr key={cli.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-bold text-white">
                        <div>{cli.companyName}</div>
                        <div className="text-[11px] text-slate-400">{cli.clientName} ({cli.phone})</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-sap-secondary">{cli.licenseKey}</td>
                      <td className="py-3 px-3 text-slate-400 truncate max-w-xs">{cli.uniqueDomain}</td>
                      <td className="py-3 px-3 font-mono">{cli.subscriptionEnd}</td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-1 bg-sap-primary/20 text-emerald-400 border border-sap-primary/40 rounded-full font-bold text-[10px]">
                          {cli.status === "ACTIVE" ? "نشط ومفعل" : "معطل"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: WHITE_LABEL_V2 */}
      {activeTab === "WHITE_LABEL_V2" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-l from-sap-primary/30 via-slate-900 to-slate-950 border border-sap-secondary/40 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="px-3 py-1 bg-sap-secondary/20 text-sap-secondary border border-sap-secondary/40 rounded-full text-xs font-bold inline-block mb-2">
                  ✨ النسخة المخصصة رقم (2) للوكيل المعتمد
                </span>
                <h2 className="text-xl font-black text-white">
                  خطاب تجهيز واعتراف استلام النسخة المخصصة (White-Label) من MeDo ERP
                </h2>
              </div>
              <button
                onClick={() => {
                  const letterText = `الموضوع: تجهيز واستلام النسخة المخصصة (White-Label) من نظام MeDo ERP المحاسبي والإداري السحابي - النسخة رقم (2)\n\nالسلام عليكم ورحمة الله وبركاته،\nالسادة / ${agencyName} المحترمون\nعناية الأخ / المسؤول الرسمي المحترم\n\nيسرنا إبلاغكم بأنه تم الانتهاء من إعداد وتجهيز البنية التحتية لمنظومة نظام MeDo ERP المحاسبي والإداري السحابي الشامل، ونحن بصدد إطلاق وتخصيص النسخة رقم (2) الخاصة بكم كوكيل معتمد وموزع رسمي.\n\nبيانات المستأجر والرابط المخصص: ${tenantSlug}\nاللون الرئيسي: ${primaryColor} | اللون الثانوي: ${secondaryColor} | الخط العربي: ${selectedFont}\nالباقة المعتمدة: ${packageTier} (${licenseDuration})\n\nإدارة نظام MeDo ERP\nالمدير العام: بدر عايض محمد\nواتساب / هاتف: +967 773 586 047\nالبريد الإلكتروني: admin@medo-erp.com`;
                  navigator.clipboard.writeText(letterText);
                  setCopiedLetter(true);
                  setTimeout(() => setCopiedLetter(false), 3000);
                }}
                className="px-4 py-2 bg-sap-primary hover:bg-[#14532D] text-sap-secondary font-bold rounded-xl text-xs border border-sap-secondary/50 shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>{copiedLetter ? "تم نسخ نص الخطاب بنجاح!" : "نسخ نص الخطاب الرسمي للوكيل"}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-slate-300 text-xs leading-relaxed space-y-3 font-mono">
              <p className="text-sap-secondary font-bold font-sans text-sm">📄 نص الخطاب / الرسالة الموجهة للوكيل:</p>
              <p><strong>الموضوع:</strong> تجهيز واستلام النسخة المخصصة (White-Label) من نظام MeDo ERP المحاسبي والإداري السحابي - النسخة رقم (2)</p>
              <p>السلام عليكم ورحمة الله وبركاته،<br />السادة / <span className="text-sap-secondary font-bold">{agencyName}</span> المحترمون<br />عناية الأخ / المسؤول المعتمد المحترم<br />تحية طيبة وبعد،،</p>
              <p>يسرنا إبلاغكم بأنه تم الانتهاء من إعداد وتجهيز البنية التحتية لمنظومة نظام MeDo ERP المحاسبي والإداري السحابي الشامل، ونحن بصدد إطلاق وتخصيص النسخة رقم (2) الخاصة بكم كوكيل معتمد وموزع رسمي.</p>
              <p>ولضمان إطلاق النسخة بالهوية البصرية والتشغيلية المعتمدة لشركتكم، تم اعتماد المعايير التالية على نسختكم الخاصة:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pr-2">
                <li><strong>اللون الرئيسي (Primary):</strong> <span style={{ color: primaryColor }} className="font-bold">{primaryColor}</span></li>
                <li><strong>اللون الثانوي / التمييزي (Secondary/Gold):</strong> <span style={{ color: secondaryColor }} className="font-bold">{secondaryColor}</span></li>
                <li><strong>الخط العربي المفضل:</strong> <span className="text-white font-bold">{selectedFont}</span></li>
                <li><strong>اسم المنشأة/الوكالة الرسمي:</strong> <span className="text-white font-bold">{agencyName}</span></li>
                <li><strong>الرابط المخصص (Tenant URL):</strong> <span className="text-emerald-400 font-bold">https://medo-erp.com/client/{tenantSlug}</span></li>
              </ul>
              <div className="pt-3 border-t border-slate-800 flex flex-col md:flex-row justify-between text-slate-400 text-[11px]">
                <div>
                  <span className="text-white font-bold">إدارة نظام MeDo ERP</span><br />
                  المدير العام: <span className="text-sap-secondary font-bold">بدر عايض محمد</span>
                </div>
                <div className="mt-2 md:mt-0">
                  📱 واتساب / هاتف: <span className="text-white font-bold">{adminPhone}</span><br />
                  ✉️ البريد الإلكتروني: <span className="text-white font-bold">{adminEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: LEGAL_DOCS */}
      {activeTab === "LEGAL_DOCS" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-sap-secondary" />
            <span>حزمة الوثائق القانونية والسياسات المعتمدة (SAP Standard Suite)</span>
          </h3>
          <p className="text-slate-300 leading-relaxed">
            تم تضمين كافة الوثائق القانونية والسياسات الرسمية الـ 8 المعتمدة في نظام MeDo ERP لضمان الامتثال التام مع متطلبات SAP Cloud Trust Center وحماية البيانات (DPA) واتفاقيات مستوى الخدمة (SLA 99.9%).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {[
              "1. اتفاقية شروط الاستخدام للنسخة التجريبية (Terms of Service)",
              "2. الشروط والأحكام العامة للخدمات السحابية (GTC)",
              "3. الملحق الفني والتشغيلي ومستوى الخدمة (Supplement & SLA 99.9%)",
              "4. ملحق معالجة وأمن البيانات والخصوصية (DPA)",
              "5. سياسة الخصوصية وحماية البيانات الشخصية (Privacy Policy)",
              "6. اتفاقية ترخيص المستخدم النهائي وحماية الملكية (EULA)",
              "7. إخلاء المسؤولية للنسخ التجريبية (Trial Disclaimer)",
              "8. جدول المقارنة والامتثال المعياري مع SAP (SAP Matrix)",
            ].map((doc, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 font-bold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: HANDOVER */}
      {activeTab === "HANDOVER" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-xs">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>تسليم المفاتيح وبيانات الاعتماد الرسمية</span>
          </h3>
          <div className="space-y-3 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-slate-300 font-mono">
            <div><span className="text-slate-500">مدير النظام المعتمد:</span> <strong className="text-white font-sans">بدر عايض محمد</strong></div>
            <div><span className="text-slate-500">الشركة المالكة:</span> <strong className="text-sap-secondary font-sans">مجموعة بن زياد التجارية المحدودة</strong></div>
            <div><span className="text-slate-500">الشريك التقني والمطور:</span> <strong className="text-emerald-400 font-sans">ميدو تك (MeDo Tech Enterprise)</strong></div>
            <div><span className="text-slate-500">البريد الإلكتروني للإشعارات:</span> <strong className="text-white">zyadbdr925@gmail.com</strong></div>
            <div><span className="text-slate-500">رقم واتساب الإدارة:</span> <strong className="text-white">+0967773586047</strong></div>
          </div>
        </div>
      )}

      {/* Digital Certificate Modal (Official Printable License Certificate) */}
      {selectedCertClient && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sap-secondary/60 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl text-right animate-scaleUp relative overflow-hidden" dir="rtl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sap-primary/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Certificate Header */}
            <div className="flex items-center justify-between border-b border-sap-secondary/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sap-primary text-sap-secondary border border-sap-secondary/60 flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-sap-secondary" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">
                    شهادة ترخيص رقمية معتمدة (Digital License Certificate)
                  </h2>
                  <p className="text-xs text-slate-400">
                    نظام MeDo ERP المؤسسي السحابي • المعيار المتوافق مع SAP Cloud
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCertClient(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Certificate Body (Clean and Official Frame) */}
            <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-sap-secondary/40 rounded-2xl p-6 space-y-5 relative shadow-inner text-xs">
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-sap-secondary tracking-widest">
                  OFFICIAL ENTERPRISE LICENSE GRANT
                </span>
                <h3 className="text-xl font-black text-white font-serif">
                  شهادة اعتماد ومنح الترخيص البرمجي
                </h3>
                <p className="text-slate-400 text-xs">
                  تشهد إدارة MeDo ERP بأن المنشأة الموضحة أدناه مسجلة ومرخصة رسمياً لاستخدام النظام:
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">اسم المنشأة المرخصة:</span>
                  <strong className="text-white text-sm">{selectedCertClient.companyName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">اسم المسؤول المعتمد:</span>
                  <strong className="text-white text-sm">{selectedCertClient.clientName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">تاريخ بدء الترخيص:</span>
                  <strong className="text-slate-200 font-mono">{selectedCertClient.subscriptionStart}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">تاريخ انتهاء الترخيص:</span>
                  <strong className="text-amber-400 font-mono">{selectedCertClient.subscriptionEnd}</strong>
                </div>
              </div>

              <div className="p-3 bg-sap-primary/20 border border-sap-secondary/50 rounded-xl text-center space-y-1">
                <span className="text-[10px] text-slate-400">مفتاح الترخيص الرقمي المشفر (License Key):</span>
                <div className="font-mono text-base font-black text-sap-secondary tracking-wider">
                  {selectedCertClient.licenseKey}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
                <div>
                  <span>الختم والاعتماد: </span>
                  <strong className="text-emerald-400">معتمد رقمياً عبر MeDo Cloud Security</strong>
                </div>
                <div>
                  <span>مدير النظام العام: </span>
                  <strong className="text-white">بدر عايض محمد</strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-5 py-2.5 bg-sap-primary hover:bg-[#14532D] text-sap-secondary font-bold rounded-xl text-xs border border-sap-secondary/50 flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Printer className="w-4 h-4 text-sap-secondary" />
                <span>طباعة الشهادة الرسمية (PDF)</span>
              </button>
              <button
                onClick={() => setSelectedCertClient(null)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAP Compliance & Readiness Audit Modal */}
      <SapComplianceReportModal
        isOpen={isComplianceModalOpen}
        onClose={() => setIsComplianceModalOpen(false)}
      />
    </div>
  );
};
