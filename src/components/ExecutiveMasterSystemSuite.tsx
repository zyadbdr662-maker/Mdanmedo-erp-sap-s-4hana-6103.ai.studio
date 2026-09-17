import React, { useState, useEffect } from "react";
import {
  Shield,
  ShieldCheck,
  Settings,
  Cloud,
  Database,
  Award,
  BellRing,
  Volume2,
  MessageSquare,
  Lock,
  Building2,
  Users,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Play,
  Send,
  Radio,
  KeyRound,
  FileCheck2,
  Sliders,
  DollarSign,
  ExternalLink,
  History,
  Clock,
  PhoneCall,
  Archive,
} from "lucide-react";
import { CentralArchiveSection } from "./CentralArchiveSection";
import { SystemSettingsView } from "./SystemSettingsView";
import { ScheduledBackupView } from "./ScheduledBackupView";
import { SaaSPlatformView } from "./SaaSPlatformView";
import { SecuritySessionsAndAuditView } from "./SecuritySessionsAndAuditView";
import { CloudSecurityCenterView } from "./CloudSecurityCenterView";
import { FinancialGovernanceReportsView } from "./FinancialGovernanceReportsView";
import { EmployeeAccessControlView } from "./EmployeeAccessControlView";
import { ImmutableAuditTrailView } from "./ImmutableAuditTrailView";
import { TrialExtensionDashboardView } from "./TrialExtensionDashboardView";
import { SystemAlertCenterView } from "./SystemAlertCenterView";
import { AdminDeviceManagerView } from "./AdminDeviceManagerView";
import { SystemPromptsHistoryDashboard } from "./SystemPromptsHistoryDashboard";
import { SystemAuditReportView } from "./SystemAuditReportView";
import { ERPState, SystemSettings } from "../types/erp";
import { soundService, SoundType, WhatsAppNotificationPayload } from "../services/notificationSoundService";

interface ExecutiveMasterSystemSuiteProps {
  fullState: ERPState;
  onUpdateSystemSettings: (newSettings: SystemSettings) => void;
  onResetAllData: () => void;
  onLogout?: () => void;
  isSuperAdmin?: boolean;
}

export const ExecutiveMasterSystemSuite: React.FC<ExecutiveMasterSystemSuiteProps> = ({
  fullState,
  onUpdateSystemSettings,
  onResetAllData,
  onLogout,
  isSuperAdmin = true,
}) => {
  const [activeTab, setActiveTab] = useState<
    | "SETTINGS"
    | "SAAS_LICENSES"
    | "CENTRAL_ARCHIVE"
    | "CLOUD_SECURITY"
    | "GOVERNANCE_REPORTS"
    | "ACCESS_LICENSES"
    | "IMMUTABLE_AUDIT"
    | "TRIAL_EXTENSIONS"
    | "SYSTEM_ALERT_CENTER"
    | "BACKUP"
    | "AUDIO_WHATSAPP_ALERTS"
    | "DEVICE_WHITELIST"
    | "PROMPTS_HISTORY"
    | "SYSTEM_AUDIT_REPORT"
  >("SETTINGS");

  // Audio & WhatsApp Settings State
  const [soundConfig, setSoundConfig] = useState(soundService.getConfig());
  const [testAmount, setTestAmount] = useState(750000);
  const [testCurrency, setTestCurrency] = useState("YER");
  const [testSentSuccess, setTestSentSuccess] = useState<string | null>(null);
  const [whatsappLogs, setWhatsappLogs] = useState<WhatsAppNotificationPayload[]>([]);

  useEffect(() => {
    setSoundConfig(soundService.getConfig());
    setWhatsappLogs(soundService.getWhatsAppLogs());
  }, [activeTab]);

  // Security Access Guard for Client Tenants - Only SYSTEM_ADMIN or SUPER_ADMIN
  const userRole = fullState.currentUser?.role;
  const hasAccess = isSuperAdmin || userRole === "SUPER_ADMIN" || userRole === "SYSTEM_ADMIN";

  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-slate-900 border border-rose-800/80 rounded-3xl shadow-2xl text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-950/80 border border-rose-700/80 text-rose-400 flex items-center justify-center text-3xl shadow-inner animate-pulse">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">
            إدارة النظام الرأسية محجوبة (Restricted Access)
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            هذه الواجهة المركزية الرأسية مخصصة حصرًا لمديري النظام برتبة <span className="text-amber-400 font-bold">SYSTEM_ADMIN</span> أو <span className="text-amber-400 font-bold">SUPER_ADMIN</span>.
          </p>
        </div>
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-400 font-mono inline-block">
          🔒 RBAC Enforced: Only System & Super Admins Authorized
        </div>
      </div>
    );
  }

  const handleSoundSelect = (tone: SoundType) => {
    const updated = soundService.saveConfig({ selectedTone: tone });
    setSoundConfig(updated);
    soundService.playSound(tone);
  };

  const handleVolumeChange = (vol: number) => {
    const updated = soundService.saveConfig({ volume: vol });
    setSoundConfig(updated);
  };

  const handleSoundToggle = (enabled: boolean) => {
    const updated = soundService.saveConfig({ enabled });
    setSoundConfig(updated);
  };

  const handleAdminPhoneChange = (phone: string) => {
    const updated = soundService.saveConfig({ adminWhatsAppPhone: phone });
    setSoundConfig(updated);
  };

  const handleThresholdChange = (threshold: number) => {
    const updated = soundService.saveConfig({ largeTxThreshold: threshold });
    setSoundConfig(updated);
  };

  const handleSendTestTenantAlert = () => {
    const payload = soundService.notifyNewTenantActivation(
      "مجموعة الأفق التجارية الدولية",
      "بدر عايض محمد",
      soundConfig.adminWhatsAppPhone,
      "bdr.zyad@yandex.com"
    );
    setWhatsappLogs(soundService.getWhatsAppLogs());
    setTestSentSuccess("تم إطلاق تنبيه تفعيل منشأة جديدة بنجاح وتشغيل نغمة التنبيه وإعداد رابط الواتساب!");
    setTimeout(() => setTestSentSuccess(null), 5000);
  };

  const handleSendTestLargeTxAlert = () => {
    const payload = soundService.notifyLargeFinancialTransaction(
      "سند صرف نقدي استثنائي",
      testAmount,
      testCurrency,
      `VOUCH-${Date.now().toString().slice(-4)}`,
      "سداد دفعة توريد مواد خام واعتماد التحويل المصرفي المباشر",
      fullState.currentUser?.name || "مدير النظام",
      true
    );
    setWhatsappLogs(soundService.getWhatsAppLogs());
    setTestSentSuccess("تم إطلاق تنبيه حركة مالية كبرى وتشغيل نغمة التنبيه الفوري بنجاح!");
    setTimeout(() => setTestSentSuccess(null), 5000);
  };

  const tonesList: { id: SoundType; nameAr: string; desc: string; icon: string }[] = [
    {
      id: "ROYAL_BANK_CHIME",
      nameAr: "🔔 نغمة البنك الملكية (Royal Bank Chime)",
      desc: "نغمة تتابعية رفيعة رباعية النغمات تعبر عن الفخامة المصرفية",
      icon: "💎",
    },
    {
      id: "DIAMOND_VAULT",
      nameAr: "💎 نغمة الخزينة الماسية (Diamond Vault)",
      desc: "رنين متناغم مزدوج ذو صدى عميق خاص بحركات الخزينة",
      icon: "🏛️",
    },
    {
      id: "URGENT_APPROVAL_PING",
      nameAr: "⚡ نغمة طلب الموافقة العاجلة (Urgent Ping)",
      desc: "نبضتان سريعتان عاليتان للتنبيه على الحركات التي تتطلب اعتماداً",
      icon: "⚡",
    },
    {
      id: "CASH_FLOW_PULSE",
      nameAr: "💵 نغمة التدفق النقدي (Cash Flow Pulse)",
      desc: "نغمة تصاعدية مبهجة تشبه أصوات أجهزة الصراف والنقدية",
      icon: "💵",
    },
    {
      id: "ENTERPRISE_BELL",
      nameAr: "🏢 جرس المنظومة الفاخر (Enterprise Bell)",
      desc: "جرس دافئ متوازن لإشعارات العمليات اليومية القياسية",
      icon: "🏢",
    },
    {
      id: "RADAR_SECURITY",
      nameAr: "📡 صفير الرادار الأمني (Radar Alert)",
      desc: "تنبيه صوتي بتردد راداري للحركات الأمنية وإشعارات النظام",
      icon: "📡",
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn font-['Alexandria','Cairo',sans-serif]">
      {/* Master Executive Header Banner */}
      <div className="bg-gradient-to-r from-[#0B192C] via-[#0F284E] to-[#081220] border-2 border-blue-500/50 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#0B192C] border border-blue-400/60 flex items-center justify-center text-white shadow-xl shadow-blue-950/60">
              <ShieldCheck className="w-8 h-8 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
                  بوابة الإدارة العليا — الإجراءات السيادية للمبرمج والمصمم مالك البرنامج (الأستاذ بدر عايض محمد)
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#D4AF37] text-slate-950 shadow-md border border-amber-300 font-bold">
                  المبرمج والمصمم مالك البرنامج: الأستاذ بدر عايض محمد 👑
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 mt-1.5 max-w-3xl leading-relaxed font-medium">
                الواجهة السيادية المركزية الخاصة بالمبرمج والمصمم مالك البرنامج الأستاذ بدر عايض محمد: تضم لوحة التحكم السيادية، منظومة عملاء النظام 9 (ميدو إرب)، ومنظومة الأرشيف المركزي والوثائق السيادية مع مركز الأمان السحابي والحوكمة المالية.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right font-mono text-xs text-slate-200 bg-[#081220]/90 p-3 rounded-2xl border border-blue-500/30 shadow-inner">
              <div className="text-amber-300 font-bold flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>المبرمج والمصمم مالك البرنامج</span>
              </div>
              <div className="text-amber-200 text-[11px] font-bold">الأستاذ بدر عايض محمد</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Master Vertical Hub */}
      <div className="flex flex-wrap items-center gap-2 bg-[#0B192C] border border-blue-500/30 p-2.5 rounded-2xl shadow-lg">
        {/* 1. لوحة التحكم السيادية */}
        <button
          onClick={() => setActiveTab("SETTINGS")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "SETTINGS"
              ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-blue-950/60 border border-blue-400/40"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-blue-300" />
          <span>1. لوحة التحكم السيادية والتحكم بالنظام 🛡️</span>
        </button>

        {/* 2. المنصة السحابية المشفرة ومنظومة عملاء النظام 9 */}
        <button
          onClick={() => setActiveTab("SAAS_LICENSES")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "SAAS_LICENSES"
              ? "bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-950/60 border border-emerald-400/40"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <Cloud className="w-4 h-4 text-emerald-300" />
          <span>2. المنصة السحابية المشفرة ومنظومة عملاء النظام 9 ☁️</span>
        </button>

        {/* 3. منظومة الأرشيف المركزي */}
        <button
          onClick={() => setActiveTab("CENTRAL_ARCHIVE")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "CENTRAL_ARCHIVE"
              ? "bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-950/60 border border-purple-400/40"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <Archive className="w-4 h-4 text-purple-300" />
          <span>3. منظومة الأرشيف المركزي والوثائق السيادية 🏛️</span>
        </button>

        <button
          onClick={() => setActiveTab("CLOUD_SECURITY")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "CLOUD_SECURITY"
              ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-blue-950/60 border border-blue-400/40"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <Shield className="w-4 h-4 text-blue-300" />
          <span>4. الأمان السحابي (Cloud Firewall)</span>
        </button>

        <button
          onClick={() => setActiveTab("GOVERNANCE_REPORTS")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "GOVERNANCE_REPORTS"
              ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-blue-950/60 border border-blue-400/40"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-emerald-300" />
          <span>5. تقارير الحوكمة المالية</span>
        </button>

        <button
          onClick={() => setActiveTab("ACCESS_LICENSES")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "ACCESS_LICENSES"
              ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-blue-950/60 border border-blue-400/40"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <KeyRound className="w-4 h-4 text-rose-300" />
          <span>6. تراخيص الموظفين والإيقاف</span>
        </button>

        <button
          onClick={() => setActiveTab("IMMUTABLE_AUDIT")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "IMMUTABLE_AUDIT"
              ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-blue-950/60 border border-blue-400/40"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <History className="w-4 h-4 text-indigo-300" />
          <span>7. سجل التدقيق المشفر</span>
        </button>

        <button
          onClick={() => setActiveTab("TRIAL_EXTENSIONS")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "TRIAL_EXTENSIONS"
              ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-blue-950/60 border border-blue-400/40"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <Clock className="w-4 h-4 text-amber-300" />
          <span>8. تمديد الفترة التجريبية</span>
        </button>

        <button
          onClick={() => setActiveTab("SYSTEM_ALERT_CENTER")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "SYSTEM_ALERT_CENTER"
              ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-blue-950/60 border border-blue-400/40"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <BellRing className="w-4 h-4 text-indigo-300" />
          <span>9. مركز التنبيهات والنغمات</span>
        </button>

        <button
          onClick={() => setActiveTab("BACKUP")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "BACKUP"
              ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-blue-950/60 border border-blue-400/40"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <Database className="w-4 h-4 text-blue-300" />
          <span>10. النسخ الاحتياطي التلقائي</span>
        </button>

        <button
          onClick={() => setActiveTab("AUDIO_WHATSAPP_ALERTS")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "AUDIO_WHATSAPP_ALERTS"
              ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-blue-950/60 border border-blue-400/40"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <MessageSquare className="w-4 h-4 text-emerald-300" />
          <span>11. إشعارات واتساب السريعة</span>
        </button>

        <button
          onClick={() => setActiveTab("DEVICE_WHITELIST")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "DEVICE_WHITELIST"
              ? "bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-lg shadow-blue-950/60 border border-blue-400/40"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-300" />
          <span>12. الأجهزة المصرح بها 🔐</span>
        </button>

        <button
          onClick={() => setActiveTab("PROMPTS_HISTORY")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "PROMPTS_HISTORY"
              ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-lg shadow-indigo-950/60 border border-indigo-400/40"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <History className="w-4 h-4 text-amber-300" />
          <span>13. سجل المحادثات والطلبات 📜</span>
        </button>

        <button
          onClick={() => setActiveTab("SYSTEM_AUDIT_REPORT")}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === "SYSTEM_AUDIT_REPORT"
              ? "bg-gradient-to-r from-amber-500 to-[#D4AF37] text-slate-950 shadow-lg shadow-amber-950/60 border border-amber-400/40 font-bold"
              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
          }`}
        >
          <Award className="w-4 h-4 text-slate-950" />
          <span>14. تقرير المراجعة والتدقيق الشامل 🏆</span>
        </button>
      </div>

      {/* TAB 1: SYSTEM SETTINGS */}
      {activeTab === "SETTINGS" && (
        <SystemSettingsView
          systemSettings={fullState.systemSettings}
          onUpdateSystemSettings={onUpdateSystemSettings}
          currencies={fullState.currencies}
          onUpdateCurrencies={() => {}}
          currentUser={fullState.currentUser}
          onSwitchUser={() => {}}
          onResetAllData={onResetAllData}
          fullState={fullState}
          onLogout={onLogout}
        />
      )}

      {/* TAB 2: CLOUD SECURITY CENTER (FIREWALL & ENCRYPTION AT REST) */}
      {activeTab === "CLOUD_SECURITY" && (
        <CloudSecurityCenterView currentUserName={fullState.currentUser?.name || "مدير النظام الأعلى"} />
      )}

      {/* TAB 3: FINANCIAL GOVERNANCE REPORTS & LARGE TX ALERTS */}
      {activeTab === "GOVERNANCE_REPORTS" && (
        <FinancialGovernanceReportsView fullState={fullState} currentUserName={fullState.currentUser?.name || "د. طارق المنصوري"} />
      )}

      {/* TAB 4: EMPLOYEE ACCESS LICENSES & KILL-SWITCH */}
      {activeTab === "ACCESS_LICENSES" && (
        <EmployeeAccessControlView currentUserName={fullState.currentUser?.name || "مدير النظام الأعلى"} />
      )}

      {/* TAB 5: IMMUTABLE AUDIT TRAIL (SHA-256 HASH CHAIN) */}
      {activeTab === "IMMUTABLE_AUDIT" && (
        <ImmutableAuditTrailView currentUserName={fullState.currentUser?.name || "مدير النظام الأعلى"} />
      )}

      {/* TAB 2: SAAS LICENSES & CLOUD MULTI-TENANT (منظومة عملاء النظام 9) */}
      {activeTab === "SAAS_LICENSES" && (
        <SaaSPlatformView
          erpState={fullState}
          onUpdateState={(newState) => {
            if (newState.systemSettings) {
              onUpdateSystemSettings(newState.systemSettings);
            }
          }}
          onOpenTrialLockModal={() => {}}
        />
      )}

      {/* TAB 3: CENTRAL ARHCIVE (منظومة الأرشيف المركزي والوثائق السيادية) */}
      {activeTab === "CENTRAL_ARCHIVE" && (
        <CentralArchiveSection
          companyName={fullState.systemSettings.companyNameAr}
          currencies={fullState.currencies}
        />
      )}

      {/* TAB 7: TRIAL EXTENSION DASHBOARD */}
      {activeTab === "TRIAL_EXTENSIONS" && (
        <TrialExtensionDashboardView currentUserName={fullState.currentUser?.name || "مدير النظام الأعلى"} />
      )}

      {/* TAB 8: SYSTEM ALERT CENTER & SOUND MOVEMENTS */}
      {activeTab === "SYSTEM_ALERT_CENTER" && (
        <SystemAlertCenterView currentUserName={fullState.currentUser?.name || "مدير النظام الأعلى"} />
      )}

      {/* TAB 9: SCHEDULED BACKUP */}
      {activeTab === "BACKUP" && (
        <ScheduledBackupView
          systemSettings={fullState.systemSettings}
          onUpdateSystemSettings={onUpdateSystemSettings}
          fullState={fullState}
        />
      )}

      {/* TAB 5: AUDIO RINGTONE SELECTION & WHATSAPP API INTEGRATION */}
      {activeTab === "AUDIO_WHATSAPP_ALERTS" && (
        <div className="space-y-6">
          {/* Main Controls Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 1. Custom Audio Alert Ringtone Selector */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      اختيار نغمة التنبيه الصوتي المخصصة (Audio Ringtones)
                    </h3>
                    <p className="text-xs text-slate-400">
                      تشغيل تنبيه صوتي فوري في المتصفح عند وصول إشعار جديد أو حركة تتطلب موافقة.
                    </p>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soundConfig.enabled}
                    onChange={(e) => handleSoundToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Volume Slider */}
              <div className="space-y-2 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-400" />
                    مستوى صوت التنبيه (Volume):
                  </span>
                  <span className="text-blue-400 font-mono">{Math.round(soundConfig.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={soundConfig.volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Tone Selection Cards */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-300 block">
                  اختر النغمة المفضلة للنظام (انقر للتجربة والحفظ):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tonesList.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => handleSoundSelect(tone.id)}
                      className={`p-4 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                        soundConfig.selectedTone === tone.id
                          ? "bg-gradient-to-br from-[#1E3A8A] to-[#0B192C] text-white border-blue-400 shadow-lg shadow-blue-950/60"
                          : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-black">{tone.nameAr}</span>
                        <span className="text-sm">{tone.icon}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {tone.desc}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-bold text-blue-400">
                        <span>{soundConfig.selectedTone === tone.id ? "✓ النغمة المعتمدة" : "انقر للتجربة"}</span>
                        <Play className="w-3.5 h-3.5 fill-blue-400" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. WhatsApp API Integration Dispatcher */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      خدمة إشعارات الواتساب (WhatsApp API Alerts)
                    </h3>
                    <p className="text-xs text-slate-400">
                      إرسال تنبيهات فورية لمدير النظام عند تفعيل منشأة جديدة أو إضافة حركة مالية كبرى.
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                  Active Gateway
                </span>
              </div>

              {/* Admin Phone and Threshold Configuration */}
              <div className="space-y-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    رقم واتساب مدير النظام المستلم للتنبيهات الفورية:
                  </label>
                  <input
                    type="text"
                    value={soundConfig.adminWhatsAppPhone}
                    onChange={(e) => handleAdminPhoneChange(e.target.value)}
                    placeholder="+967773586047"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono dir-ltr focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                    سقف الحركة المالية الكبرى لتفعيل التنبيه (Threshold):
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={soundConfig.largeTxThreshold}
                      onChange={(e) => handleThresholdChange(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                    <span className="px-3 py-2.5 bg-slate-800 rounded-xl text-xs font-bold text-slate-300">
                      ريال / عملة
                    </span>
                  </div>
                </div>
              </div>

              {/* Test Dispatch Triggers */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 block">
                  اختبار محرك التنبيهات الفورية (Test Instant Triggers):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleSendTestTenantAlert}
                    className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>تنبيه: تفعيل منشأة جديدة 🏢</span>
                  </button>

                  <button
                    onClick={handleSendTestLargeTxAlert}
                    className="p-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-rose-700 hover:from-amber-500 hover:to-rose-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-950/50 transition cursor-pointer"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>تنبيه: حركة مالية كبرى 💰</span>
                  </button>
                </div>
              </div>

              {testSentSuccess && (
                <div className="p-4 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl text-xs text-emerald-200 flex items-center gap-3 animate-fadeIn shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{testSentSuccess}</span>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Logs & History */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <History className="w-4 h-4 text-blue-400" />
                <span>سجل إشعارات الواتساب والحركات المنفذة (WhatsApp Dispatch Logs)</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {whatsappLogs.length} إشعار مسجل
              </span>
            </div>

            {whatsappLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-950/60 rounded-2xl border border-slate-800">
                لا توجد إشعارات مسجلة بعد. سيتم تسجيل كافة تنبيهات تفعيل المنشآت والحركات المالية الكبرى هنا تلقائياً.
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {whatsappLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          log.eventType === "NEW_TENANT" ? "bg-emerald-950 text-emerald-300 border border-emerald-700/50" : "bg-amber-950 text-amber-300 border border-amber-700/50"
                        }`}>
                          {log.eventType === "NEW_TENANT" ? "منشأة جديدة" : "حركة مالية كبرى"}
                        </span>
                        <span className="font-bold text-white">{log.title}</span>
                      </div>
                      <p className="text-slate-300 font-mono text-[11px] whitespace-pre-line leading-relaxed">
                        {log.message.slice(0, 160)}...
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                      <span className="text-slate-400 text-[10px] font-mono">
                        {new Date(log.timestamp).toLocaleTimeString("ar-SA")}
                      </span>
                      {log.directLink && (
                        <a
                          href={log.directLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition shadow"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>فتح في واتساب</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 11: DEVICE WHITELIST & SECURITY */}
      {activeTab === "DEVICE_WHITELIST" && (
        <AdminDeviceManagerView />
      )}

      {/* TAB 12: PROMPTS & ACTIONS TIMELINE HISTORY */}
      {activeTab === "PROMPTS_HISTORY" && (
        <SystemPromptsHistoryDashboard />
      )}

      {/* TAB 14: COMPREHENSIVE AUDIT REPORT */}
      {activeTab === "SYSTEM_AUDIT_REPORT" && (
        <SystemAuditReportView currentUserName={fullState.currentUser?.name || "الأستاذ بدر عايض محمد"} />
      )}
    </div>
  );
};
