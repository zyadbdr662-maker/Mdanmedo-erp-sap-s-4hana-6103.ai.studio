import React, { useState, useMemo } from "react";
import {
  PRE_GENERATED_200_TENANTS,
  PreGeneratedTenant,
  TenantRoleCredentials,
  VERCEL_PRODUCTION_BASE,
} from "../data/preGeneratedTenants";
import {
  Building2,
  Search,
  Filter,
  Download,
  Copy,
  Check,
  Share2,
  ExternalLink,
  ShieldCheck,
  Users,
  Key,
  Globe,
  Database,
  CheckCircle2,
  Sparkles,
  Layers,
  Phone,
  FileSpreadsheet,
  AlertCircle,
  Eye,
  Lock,
} from "lucide-react";
import { soundService } from "../services/notificationSoundService";

interface Master200TenantsMatrixViewProps {
  onClose?: () => void;
}

export const Master200TenantsMatrixView: React.FC<Master200TenantsMatrixViewProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [cityFilter, setCityFilter] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedTenantForDetails, setSelectedTenantForDetails] = useState<PreGeneratedTenant | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  // Filtered tenants list
  const filteredTenants = useMemo(() => {
    return PRE_GENERATED_200_TENANTS.filter((tenant) => {
      const matchesSearch =
        searchQuery === "" ||
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.crNumber.includes(searchQuery) ||
        tenant.taxNumber.includes(searchQuery) ||
        tenant.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.index.toString() === searchQuery.trim();

      const matchesStatus = statusFilter === "ALL" || tenant.status === statusFilter;
      const matchesCity = cityFilter === "ALL" || tenant.city === cityFilter;

      return matchesSearch && matchesStatus && matchesCity;
    });
  }, [searchQuery, statusFilter, cityFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredTenants.length / itemsPerPage);
  const displayedTenants = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTenants.slice(start, start + itemsPerPage);
  }, [filteredTenants, currentPage]);

  const uniqueCities = useMemo(() => {
    const set = new Set(PRE_GENERATED_200_TENANTS.map((t) => t.city));
    return Array.from(set);
  }, []);

  // Copy helper
  const handleCopyCredentials = (
    tenant: PreGeneratedTenant,
    roleKey: keyof PreGeneratedTenant["roles"]
  ) => {
    const cred = tenant.roles[roleKey];
    const text = `🏢 *${tenant.name}* (${tenant.slug})
👤 *الدور:* ${cred.roleNameAr}
🔑 *رمز المصادقة (Token):* ${cred.token}
📧 *البريد الإلكتروني:* ${cred.email}
🔒 *كلمة المرور:* ${cred.password}
🌐 *رابط الدخول المباشر المخصص:*
${cred.subLink}`;

    navigator.clipboard.writeText(text);
    const idKey = `${tenant.slug}-${roleKey}`;
    setCopiedId(idKey);
    soundService.playSound("ROYAL_BANK_CHIME");
    setTimeout(() => setCopiedId(null), 3000);
  };

  // WhatsApp helper
  const handleShareWhatsApp = (
    tenant: PreGeneratedTenant,
    roleKey: keyof PreGeneratedTenant["roles"]
  ) => {
    const cred = tenant.roles[roleKey];
    const message = `✨ *نظام MeDo ERP السحابي المتقدم - بيانات الدخول الحصري* ✨
-----------------------------------------
🏢 *المنشأة:* ${tenant.name}
📍 *المدينة:* ${tenant.city} | *س.ت:* ${tenant.crNumber}
👤 *الدور الوظيفي:* ${cred.roleNameAr}
🔑 *رمز التوثيق (Token):* \`${cred.token}\`
📧 *البريد:* \`${cred.email}\`
🔒 *كلمة المرور:* \`${cred.password}\`
-----------------------------------------
🌐 *رابط الدخول المباشر المعزول:*
${cred.subLink}
-----------------------------------------
💡 *ملاحظة أمنية:* تم تفعيل جدار عزل الصلاحيات (RBAC) التلقائي لهذه الجلسة.`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Export 1000-Link CSV/Excel
  const handleExportFullMatrixCSV = () => {
    soundService.playSound("ROYAL_BANK_CHIME");
    const headers = [
      "رقم الشركة",
      "معرف المنشأة (Slug)",
      "اسم المنشأة بالعربية",
      "اسم المنشأة بالإنجليزية",
      "السجل التجاري",
      "الرقم الضريبي",
      "المدينة",
      "العنوان التفصيلي",
      "النشاط التجاري",
      "الهاتف",
      "حالة الاشتراك",
      "عقدة قاعدة البيانات",
      "الدور الوظيفي (Role)",
      "المسمى العربي",
      "رمز التوثيق (Token)",
      "البريد الإلكتروني",
      "كلمة المرور",
      "المسار الافتراضي",
      "الرابط السحابي المباشر",
    ];

    const rows: string[][] = [];

    PRE_GENERATED_200_TENANTS.forEach((tenant) => {
      const roleKeys: (keyof PreGeneratedTenant["roles"])[] = [
        "MANAGER",
        "ACCOUNTANT",
        "CASHIER",
        "PURCHASER",
        "AUDITOR",
      ];

      roleKeys.forEach((roleKey) => {
        const cred = tenant.roles[roleKey];
        rows.push([
          tenant.index.toString(),
          tenant.slug,
          `"${tenant.name.replace(/"/g, '""')}"`,
          `"${tenant.nameEn.replace(/"/g, '""')}"`,
          tenant.crNumber,
          tenant.taxNumber,
          `"${tenant.city}"`,
          `"${tenant.address.replace(/"/g, '""')}"`,
          `"${tenant.industry}"`,
          tenant.phone,
          tenant.status,
          tenant.databaseNode,
          roleKey,
          `"${cred.roleNameAr}"`,
          cred.token,
          cred.email,
          cred.password,
          cred.path,
          `"${cred.subLink}"`,
        ]);
      });
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MeDo_ERP_200_Tenants_1000_Roles_Matrix_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "MANAGER":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-300 dark:border-purple-800";
      case "ACCOUNTANT":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800";
      case "CASHIER":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
      case "PURCHASER":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800";
      case "AUDITOR":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300";
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-16" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-inner">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider bg-indigo-900/60 px-2.5 py-0.5 rounded-full border border-indigo-700/50">
                  MeDo Multi-Tenant SaaS Sovereign Mesh
                </span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                  مصفوفة الـ 200 شركة سحابية (1000 رابط معزول بالكامل)
                </h1>
              </div>
            </div>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              إدارة وتوزيع الروابط السيادية المسبقة لـ 200 منشأة تجارية مستقلة. تم تفعيل جدار عزل الصلاحيات الصارم (RBAC Matrix) والتحقق الإجباري من الـ Tokens وتوزيع 5 أدوار وظيفية لكل شركة بإجمالي 1000 رابط مشفر.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportFullMatrixCSV}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span>تصدير المصفوفة كاملة (Excel / CSV)</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-2xl border border-slate-700 transition-all cursor-pointer"
              >
                إغلاق
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80">
          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
            <span className="text-xs text-slate-400 font-medium">إجمالي الشركات المسجلة</span>
            <div className="text-2xl font-black text-white mt-1">200 شركة</div>
            <span className="text-[11px] text-emerald-400 mt-1 block">✓ قواعد بيانات معزولة 100%</span>
          </div>

          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
            <span className="text-xs text-slate-400 font-medium">إجمالي الروابط الفرعية</span>
            <div className="text-2xl font-black text-indigo-400 mt-1">1,000 رابط</div>
            <span className="text-[11px] text-indigo-300 mt-1 block">5 أدوار تشغيلية لكل شركة</span>
          </div>

          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
            <span className="text-xs text-slate-400 font-medium">التحقق والتأمين (Tokens)</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">100% نشط</div>
            <span className="text-[11px] text-emerald-300 mt-1 block">ممنوع الوصول غير المصرح</span>
          </div>

          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
            <span className="text-xs text-slate-400 font-medium">النطاق والربط الأساسي</span>
            <div className="text-sm font-mono font-bold text-slate-200 mt-2 truncate">
              mdanmedo-erp-sap...vercel.app
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">مربوط بخوادم Cloud Run & Vercel</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث برقم الشركة (مثال: 1 أو 50)، بالاسم، بالسجل التجاري، بالرقم الضريبي، أو المدينة..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL">جميع الحالات (200)</option>
              <option value="TRIAL">النسخ التجريبية (TRIAL)</option>
              <option value="PAID_ENTERPRISE">المنشآت المدفوعة (PAID)</option>
            </select>
          </div>

          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="ALL">جميع المدن والمحافظات</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {/* Role Filter Selector */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="ALL">عرض كافة الأدوار الـ 5</option>
            <option value="MANAGER">المدير العام فقط (MANAGER)</option>
            <option value="ACCOUNTANT">المحاسب فقط (ACCOUNTANT)</option>
            <option value="CASHIER">المبيعات والكاشير فقط (CASHIER)</option>
            <option value="PURCHASER">المشتريات فقط (PURCHASER)</option>
            <option value="AUDITOR">المراجع المالي فقط (AUDITOR)</option>
          </select>
        </div>
      </div>

      {/* Quick Test Links Recommendation Bar */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
            ⚡
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
              روابط فحص سريعة لعينة من المنشآت (1، 50، 100، 150، 200):
            </h4>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
              انقر على أي منشأة لتجربة عزل الصلاحيات الفوري والتحقق من اسم المنشأة وبياناتها
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[1, 50, 100, 150, 200].map((num) => {
            const tenant = PRE_GENERATED_200_TENANTS.find((t) => t.index === num);
            if (!tenant) return null;
            return (
              <button
                key={num}
                onClick={() => setSelectedTenantForDetails(tenant)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-300 dark:border-amber-700 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>شركة {num}</span>
                <span className="text-[10px] text-slate-500">({tenant.city})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 200 Companies Cards Grid / Table */}
      <div className="space-y-4">
        {displayedTenants.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">لا توجد نتائج مطابقة</h3>
            <p className="text-xs text-slate-500 mt-1">يرجى تعديل معايير البحث أو الفلترة</p>
          </div>
        ) : (
          displayedTenants.map((tenant) => (
            <div
              key={tenant.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm transition-all overflow-hidden"
            >
              {/* Company Header Row */}
              <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
                    #{tenant.index}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {tenant.name}
                      </h3>
                      <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                        {tenant.slug}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          tenant.status === "PAID_ENTERPRISE"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300"
                        }`}
                      >
                        {tenant.status === "PAID_ENTERPRISE" ? "منشأة مدفوعة (Enterprise)" : "نسخة تجريبية (Trial)"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>📍 {tenant.city} - {tenant.address}</span>
                      <span>🏢 س.ت: <strong className="font-mono text-slate-700 dark:text-slate-300">{tenant.crNumber}</strong></span>
                      <span>📑 ضريبي: <strong className="font-mono text-slate-700 dark:text-slate-300">{tenant.taxNumber}</strong></span>
                      <span>📞 هاتف: <strong className="font-mono text-slate-700 dark:text-slate-300">{tenant.phone}</strong></span>
                      <span>🗄️ سحابة: <strong className="text-indigo-600 dark:text-indigo-400">{tenant.databaseNode}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                  <button
                    onClick={() => setSelectedTenantForDetails(tenant)}
                    className="px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>لوحة المنشأة</span>
                  </button>
                  <a
                    href={tenant.masterDomain}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>الرابط العام</span>
                  </a>
                </div>
              </div>

              {/* Roles Matrix for this Company (5 Roles) */}
              <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
                {(Object.keys(tenant.roles) as (keyof PreGeneratedTenant["roles"])[]).map((roleKey) => {
                  if (roleFilter !== "ALL" && roleFilter !== roleKey) return null;
                  const cred = tenant.roles[roleKey];
                  const copyKey = `${tenant.slug}-${roleKey}`;
                  const isCopied = copiedId === copyKey;

                  return (
                    <div
                      key={roleKey}
                      className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between gap-3 hover:shadow-md transition-all relative group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${getRoleBadgeColor(
                              roleKey
                            )}`}
                          >
                            {roleKey}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                            {cred.token}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                          {cred.roleNameAr}
                        </h4>

                        <div className="mt-2 space-y-1 text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                          <div className="truncate" title={cred.email}>
                            ✉️ {cred.email}
                          </div>
                          <div>🔑 pwd: <strong>{cred.password}</strong></div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-1.5">
                        <button
                          onClick={() => handleCopyCredentials(tenant, roleKey)}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            isCopied
                              ? "bg-emerald-600 text-white"
                              : "bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                          }`}
                          title="نسخ الرابط والبيانات"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? "تم النسخ" : "نسخ"}</span>
                        </button>

                        <button
                          onClick={() => handleShareWhatsApp(tenant, roleKey)}
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 transition-all cursor-pointer"
                          title="مشاركة عبر واتساب"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={cred.subLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition-all"
                          title="فتح وتجربة الرابط المباشر"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            عرض الصفحة {currentPage} من أصل {totalPages} (إجمالي {filteredTenants.length} منشأة)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              السابق
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                    currentPage === pageNum
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && <span className="text-xs text-slate-400">... {totalPages}</span>}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              التالي
            </button>
          </div>
        </div>
      )}

      {/* Selected Tenant Quick Detail Modal */}
      {selectedTenantForDetails && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg">
                  #{selectedTenantForDetails.index}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedTenantForDetails.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedTenantForDetails.city} - {selectedTenantForDetails.industry}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTenantForDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <div>
                <span className="text-slate-400">السجل التجاري:</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedTenantForDetails.crNumber}</p>
              </div>
              <div>
                <span className="text-slate-400">الرقم الضريبي:</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedTenantForDetails.taxNumber}</p>
              </div>
              <div>
                <span className="text-slate-400">الهاتف:</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedTenantForDetails.phone}</p>
              </div>
              <div>
                <span className="text-slate-400">عقدة السحابة:</span>
                <p className="font-bold text-indigo-600 dark:text-indigo-400">{selectedTenantForDetails.databaseNode}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">روابط الأدوار الخمسة المباشرة:</h4>
              {(Object.keys(selectedTenantForDetails.roles) as (keyof PreGeneratedTenant["roles"])[]).map((roleKey) => {
                const cred = selectedTenantForDetails.roles[roleKey];
                return (
                  <div
                    key={roleKey}
                    className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getRoleBadgeColor(roleKey)}`}>
                        {roleKey}
                      </span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{cred.roleNameAr}</p>
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {cred.email} | Token: {cred.token}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCredentials(selectedTenantForDetails, roleKey)}
                        className="px-3 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-600 cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ</span>
                      </button>
                      <a
                        href={cred.subLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>تجربة</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedTenantForDetails(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold rounded-xl cursor-pointer"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
