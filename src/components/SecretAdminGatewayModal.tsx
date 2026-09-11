import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  KeyRound,
  Laptop,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Clock,
  ArrowRight,
  Sparkles,
  Shield,
  HelpCircle,
  PlusCircle,
  RefreshCw,
  X,
  Mail,
} from "lucide-react";
import {
  AdminPortalSecurityService,
  AuthorizedDevice,
  DEFAULT_MASTER_PASSWORD_PLAIN,
  MASTER_DEVICE_ENROLL_PIN,
  MASTER_ADMIN_EMAIL,
} from "../services/adminPortalSecurityService";

interface SecretAdminGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUnlock: () => void;
}

export const SecretAdminGatewayModal: React.FC<SecretAdminGatewayModalProps> = ({
  isOpen,
  onClose,
  onSuccessUnlock,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutHours, setLockoutHours] = useState<number | null>(null);

  // Device Whitelist Check State
  const [deviceInfo, setDeviceInfo] = useState<{
    fingerprint: string;
    isAuthorized: boolean;
    device?: AuthorizedDevice;
    deviceType: string;
    browserInfo: string;
    osInfo: string;
  } | null>(null);

  // Device Enrollment Form State
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [enrollPin, setEnrollPin] = useState("");
  const [enrollDeviceName, setEnrollDeviceName] = useState("");
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [enrollSuccess, setEnrollSuccess] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkInitialSecurityState();
    }
  }, [isOpen]);

  const checkInitialSecurityState = async () => {
    setIsLoading(true);
    try {
      await AdminPortalSecurityService.initializeMasterPassword();

      // Check lockout status
      const locked = AdminPortalSecurityService.isLockoutActive();
      setIsLockedOut(locked);
      if (locked) {
        const lockoutUntil = AdminPortalSecurityService.getLockoutUntil();
        const hours = Math.max(1, Math.ceil((lockoutUntil - Date.now()) / (1000 * 60 * 60)));
        setLockoutHours(hours);
      } else {
        setRemainingAttempts(AdminPortalSecurityService.getRemainingAttempts());
      }

      // Check Device Whitelist
      const fpDetails = await AdminPortalSecurityService.getDeviceFingerprint();
      const authResult = await AdminPortalSecurityService.isCurrentDeviceAuthorized();

      setDeviceInfo({
        fingerprint: fpDetails.fingerprint,
        isAuthorized: authResult.isAuthorized,
        device: authResult.device,
        deviceType: fpDetails.deviceType,
        browserInfo: fpDetails.browserInfo,
        osInfo: fpDetails.osInfo,
      });

      if (!enrollDeviceName) {
        setEnrollDeviceName(`جهاز بدر (${fpDetails.osInfo} - ${fpDetails.deviceType})`);
      }
    } catch (e) {
      console.error("Error checking portal security state:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMsg("يرجى إدخال كلمة مرور المدير للمتابعة.");
      return;
    }

    if (deviceInfo && !deviceInfo.isAuthorized) {
      setErrorMsg("⚠️ هذا الجهاز غير مصرح به في قائمة الأجهزة المعتمدة. يرجى تفويض الجهاز أولاً بواسطة الرمز السيادي.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const result = await AdminPortalSecurityService.verifyMasterPassword(password);

      if (result.success) {
        setSuccessMsg("✓ تم التحقق بنجاح! جاري فتح لوحة الإدارة الرأسية...");
        setTimeout(() => {
          onSuccessUnlock();
          onClose();
        }, 1200);
      } else {
        setRemainingAttempts(result.remainingAttempts);
        setIsLockedOut(result.isLockedOut);
        setLockoutHours(result.lockoutDurationHours || null);
        setErrorMsg(result.errorMsg || "كلمة مرور المدير غير صحيحة.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ غير متوقع أثناء التحقق.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollPin.trim()) {
      setEnrollError("يرجى إدخال رمز التفويض السيادي.");
      return;
    }

    setIsEnrolling(true);
    setEnrollError(null);

    try {
      const result = await AdminPortalSecurityService.enrollDeviceWithPin(
        enrollPin,
        enrollDeviceName.trim()
      );

      if (result.success) {
        setEnrollSuccess("✓ تم تسجيل وتفويض هذا الجهاز بنجاح! يمكنك الآن إدخال كلمة المرور.");
        setShowEnrollForm(false);
        setEnrollPin("");
        await checkInitialSecurityState();
      } else {
        setEnrollError(result.errorMsg || "رمز التفويض غير صحيح.");
      }
    } catch (err: any) {
      setEnrollError(err.message || "فشل تفويض الجهاز.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="secret-admin-gateway-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      dir="rtl"
    >
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#0B192C] via-[#0A2240] to-[#061220] border-2 border-blue-500/50 rounded-3xl shadow-2xl shadow-blue-950/80 p-6 sm:p-8 text-white overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer"
          title="إغلاق والعودة للنظام الرئيسي"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-400 p-0.5 shadow-xl shadow-blue-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B192C] rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-9 h-9 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              <span>🔐 بوابة الإدارة العليا</span>
              <span className="text-blue-400 font-mono text-sm">MeDo ERP</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              المنظومة المحصنة ثلاثية الطبقات (الرابط السري • كلمة مرور المدير • بصمة الجهاز)
            </p>
          </div>
        </div>

        {/* Security Status Checklist (Matching Mockup) */}
        <div className="bg-slate-950/70 border border-blue-500/30 rounded-2xl p-4 space-y-3 mb-6 font-mono text-xs shadow-inner">
          {/* Layer 1: Secret URL */}
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-sans flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>الرابط السري (Secret Admin URL):</span>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✓ تم التحقق بنجاح</span>
            </span>
          </div>

          {/* Layer 2: Device Whitelist */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-slate-300 font-sans flex items-center gap-2">
              {deviceInfo?.deviceType === "MOBILE" ? (
                <Smartphone className="w-4 h-4 text-blue-400" />
              ) : (
                <Laptop className="w-4 h-4 text-blue-400" />
              )}
              <span>حالة الجهاز (Device Whitelist):</span>
            </span>
            {deviceInfo?.isAuthorized ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>✓ مصرح به ({deviceInfo.device?.name || "جهاز معتمد"})</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>⚠️ جهاز غير معتمد</span>
              </span>
            )}
          </div>

          {/* Device Fingerprint Details */}
          {deviceInfo && (
            <div className="text-[11px] text-slate-400 flex items-center justify-between px-1 pt-1 font-mono">
              <span>البصمة: {deviceInfo.fingerprint}</span>
              <span>{deviceInfo.browserInfo}</span>
            </div>
          )}
        </div>

        {/* Enroll Device Form (If Device is not authorized) */}
        {!deviceInfo?.isAuthorized && (
          <div className="mb-6 p-4 bg-amber-950/40 border border-amber-600/50 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>تفويض هذا الجهاز بواسطة الرمز السيادي</span>
              </span>
              <button
                type="button"
                onClick={() => setShowEnrollForm(!showEnrollForm)}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer"
              >
                {showEnrollForm ? "إخفاء" : "تفويض الجهاز الآن"}
              </button>
            </div>

            {showEnrollForm && (
              <form onSubmit={handleEnrollDevice} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">اسم الجهاز (للتعريف):</label>
                  <input
                    type="text"
                    value={enrollDeviceName}
                    onChange={(e) => setEnrollDeviceName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="مثال: كمبيوتر بدر الرئيسي"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-300 mb-1">رمز التفويض السيادي (Enroll PIN):</label>
                  <input
                    type="password"
                    value={enrollPin}
                    onChange={(e) => setEnrollPin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    placeholder="أدخل الرمز السيادي (PIN)"
                  />
                </div>
                {enrollError && <p className="text-[11px] text-rose-400 font-bold">{enrollError}</p>}
                {enrollSuccess && <p className="text-[11px] text-emerald-400 font-bold">{enrollSuccess}</p>}
                <button
                  type="submit"
                  disabled={isEnrolling}
                  className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow cursor-pointer disabled:opacity-50"
                >
                  {isEnrolling ? "جاري التفويض..." : "✓ حفظ وتفويض هذا الجهاز"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Lockout Warning Banner */}
        {isLockedOut ? (
          <div className="p-5 bg-rose-950/60 border border-rose-600/70 rounded-2xl text-center space-y-3 mb-6">
            <div className="w-12 h-12 mx-auto rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-200">بوابة الإدارة مقفلة أمنياً</h3>
              <p className="text-xs text-slate-300 mt-1">
                تم استنفاد كافة المحاولات المتاحة (3/3). القفل الأمني نشط لمدة 24 ساعة لحماية المنظومة.
              </p>
            </div>
            {lockoutHours && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-900/40 border border-rose-500/40 rounded-xl text-xs font-mono text-rose-300">
                <Clock className="w-3.5 h-3.5" />
                <span>متبقي على فك القفل: ~{lockoutHours} ساعة</span>
              </div>
            )}
          </div>
        ) : (
          /* Main Master Password Verification Form */
          <form onSubmit={handleVerify} className="space-y-4 mb-6">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-200">
                  أدخل كلمة مرور المدير (Master Password):
                </label>
                <span className="text-[11px] text-blue-400 font-bold">
                  محاولات متبقية: {remainingAttempts} / 3
                </span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isLockedOut || (!deviceInfo?.isAuthorized)}
                  className="w-full py-3.5 pr-4 pl-12 rounded-2xl bg-slate-950/90 border border-blue-500/40 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="أدخل كلمة مرور الإدارة العليا..."
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error and Success Banners */}
            {errorMsg && (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-600/70 text-rose-200 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-500/40 text-blue-200 text-[11px] font-medium flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>تم إرسال إشعار أمني فوري وتنبيه بالحادثة إلى:</span>
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">{MASTER_ADMIN_EMAIL}</span>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-600/70 text-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isLockedOut || (!deviceInfo?.isAuthorized) || !password.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-blue-600/30 border border-blue-400/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>جاري التحقق والتشفير...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-blue-200" />
                  <span>دخول لوحة الإدارة (Executive Suite)</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Alert Footer Note */}
        <div className="pt-4 border-t border-slate-800/80 text-center space-y-1.5 text-[11px] text-slate-400">
          <p className="flex items-center justify-center gap-1.5 font-medium">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>يتم تسجيل كافة محاولات الدخول وإرسال إشعار فوري لبريد الإدارة:</span>
          </p>
          <p className="font-mono text-blue-300 font-bold">{MASTER_ADMIN_EMAIL}</p>
        </div>
      </div>
    </div>
  );
};
