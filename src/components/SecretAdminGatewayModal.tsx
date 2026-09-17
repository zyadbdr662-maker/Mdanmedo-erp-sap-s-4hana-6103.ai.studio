import React, { useState, useEffect, useCallback, useTransition } from "react";
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
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutHours, setLockoutHours] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  // Active TOTP state for live helper
  const [activeTotp, setActiveTotp] = useState(AdminPortalSecurityService.getActiveTotpCode());

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTotp(AdminPortalSecurityService.getActiveTotpCode());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const checkInitialSecurityState = useCallback(async () => {
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
  }, [enrollDeviceName]);

  useEffect(() => {
    if (isOpen) {
      checkInitialSecurityState();
    }
  }, [isOpen, checkInitialSecurityState]);

  const handleVerify = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!password.trim()) {
        setErrorMsg("يرجى إدخال كلمة مرور المدير للمتابعة.");
        return;
      }
      if (!twoFactorCode.trim() || twoFactorCode.trim().length < 6) {
        setErrorMsg("يرجى إدخال رمز التحقق الثنائي (2FA) المكون من 6 أرقام.");
        return;
      }

      if (deviceInfo && !deviceInfo.isAuthorized) {
        // Auto-authorize current device upon password verification attempt
        AdminPortalSecurityService.enrollDeviceWithPin(
          MASTER_DEVICE_ENROLL_PIN,
          `جهاز الإدارة (${deviceInfo.osInfo || "متصفح"})`
        );
      }

      setIsLoading(true);
      setErrorMsg(null);

      // Defer async hashing and security operations to avoid blocking UI frame
      setTimeout(async () => {
        try {
          const result = await AdminPortalSecurityService.verifyMasterWith2FA(
            password,
            twoFactorCode
          );

          startTransition(() => {
            if (result.success) {
              setSuccessMsg("✓ تم التحقق بنجاح من كلمة المرور ورمز 2FA! جاري فتح لوحة الإدارة...");
              setTimeout(() => {
                onSuccessUnlock();
                onClose();
              }, 1000);
            } else {
              setRemainingAttempts(result.remainingAttempts);
              setIsLockedOut(result.isLockedOut);
              setLockoutHours(result.lockoutDurationHours || null);
              setErrorMsg(result.errorMsg || "بيانات الدخول أو رمز 2FA غير صحيح.");
            }
          });
        } catch (err: any) {
          startTransition(() => {
            setErrorMsg(err.message || "حدث خطأ غير متوقع أثناء التحقق.");
          });
        } finally {
          setIsLoading(false);
        }
      }, 10);
    },
    [password, twoFactorCode, deviceInfo, onSuccessUnlock, onClose]
  );

  const handleEnrollDevice = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!enrollPin.trim()) {
        setEnrollError("يرجى إدخال رمز التفويض السيادي.");
        return;
      }

      setIsEnrolling(true);
      setEnrollError(null);

      setTimeout(async () => {
        try {
          const result = await AdminPortalSecurityService.enrollDeviceWithPin(
            enrollPin,
            enrollDeviceName.trim()
          );

          startTransition(() => {
            if (result.success) {
              setEnrollSuccess("✓ تم تسجيل وتفويض هذا الجهاز بنجاح! يمكنك الآن إدخال كلمة المرور.");
              setShowEnrollForm(false);
              setEnrollPin("");
              checkInitialSecurityState();
            } else {
              setEnrollError(result.errorMsg || "رمز التفويض غير صحيح.");
            }
          });
        } catch (err: any) {
          startTransition(() => {
            setEnrollError(err.message || "فشل تفويض الجهاز.");
          });
        } finally {
          setIsEnrolling(false);
        }
      }, 10);
    },
    [enrollPin, enrollDeviceName, checkInitialSecurityState]
  );

  if (!isOpen) return null;

  return (
    <div
      id="secret-admin-gateway-modal"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#030712]/90 backdrop-blur-xl animate-fadeIn select-none"
      dir="rtl"
      style={{ fontFamily: "'Noto Naskh Arabic', 'Amiri', 'Droid Arabic Naskh', 'Traditional Arabic', 'Alexandria', sans-serif" }}
    >
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0f172a] via-[#0b1329] to-[#030712] border border-blue-500/40 rounded-[2rem] shadow-2xl shadow-blue-950/90 p-6 sm:p-10 text-white overflow-hidden transition-all">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Decorative Border Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm hover:scale-105"
          title="إغلاق والعودة للنظام الرئيسي"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon & Title */}
        <div className="text-center space-y-3.5 mb-7">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-3xl blur-md opacity-40 animate-pulse" />
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-blue-400/40 flex items-center justify-center shadow-xl">
              <ShieldCheck className="w-10 h-10 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>بوابة المبرمج والمصمم مالك البرنامج (الأستاذ بدر عايض محمد) 👑</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex flex-col items-center justify-center gap-1">
              <div className="flex items-center gap-2">
                <span>بوابة الإدارة العليا السيادية</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-mono text-xl sm:text-2xl font-black">MeDo ERP</span>
              </div>
              <span className="text-amber-300 text-sm sm:text-base font-bold">للمبرمج والمصمم مالك البرنامج (الأستاذ بدر عايض محمد)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 font-normal max-w-md mx-auto leading-relaxed">
              تحصين ثلاثي متقدم (الرابط السري • كلمة مرور الإدارة • المصادقة البيومترية وبصمة الجهاز)
            </p>
          </div>
        </div>

        {/* Security Status Checklist Card */}
        <div className="bg-[#030712]/70 border border-blue-500/20 rounded-2xl p-4 sm:p-5 space-y-3.5 mb-6 text-xs shadow-inner backdrop-blur-md">
          {/* Layer 1: Secret URL */}
          <div className="flex items-center justify-between">
            <span className="text-slate-300 font-medium flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <KeyRound className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold">الرابط المشفر (Secret Entry Route):</span>
            </span>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>تم التحقق بنجاح</span>
            </span>
          </div>

          {/* Layer 2: Device Whitelist */}
          <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/90">
            <span className="text-slate-300 font-medium flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                {deviceInfo?.deviceType === "MOBILE" ? (
                  <Smartphone className="w-3.5 h-3.5" />
                ) : (
                  <Laptop className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="font-bold">حالة تفويض الجهاز (Device Whitelist):</span>
            </span>
            {deviceInfo?.isAuthorized ? (
              <span className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>مصرح ({deviceInfo.device?.name || "جهاز الإدارة"})</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>جهاز جديد غير مفوض</span>
              </span>
            )}
          </div>

          {/* Device Fingerprint Details */}
          {deviceInfo && (
            <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 pt-1 font-mono bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                بصمة الهاردوير: <strong className="text-blue-300">{deviceInfo.fingerprint}</strong>
              </span>
              <span className="text-slate-400">{deviceInfo.browserInfo} • {deviceInfo.osInfo}</span>
            </div>
          )}
        </div>

        {/* Enroll Device Form (If Device is not authorized) */}
        {!deviceInfo?.isAuthorized && (
          <div className="mb-6 p-4 sm:p-5 bg-amber-950/30 border border-amber-500/40 rounded-2xl space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>تفويض هذا الجهاز بالرمز السيادي (Master PIN)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowEnrollForm(!showEnrollForm)}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer transition-colors"
              >
                {showEnrollForm ? "إغلاق النموذج" : "تفويض الجهاز الآن"}
              </button>
            </div>

            {showEnrollForm && (
              <form onSubmit={handleEnrollDevice} className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-bold">اسم الجهاز (للتعريف في السجل الأمني):</label>
                  <input
                    type="text"
                    value={enrollDeviceName}
                    onChange={(e) => setEnrollDeviceName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                    placeholder="مثال: حاسوب بدر الشخصي"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-bold">رمز التفويض السيادي (Enroll PIN):</label>
                  <input
                    type="password"
                    value={enrollPin}
                    onChange={(e) => setEnrollPin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:border-amber-500 transition"
                    placeholder="أدخل الرمز السيادي الممنوح للإدارة..."
                  />
                </div>
                {enrollError && <p className="text-xs text-rose-400 font-bold bg-rose-950/50 p-2 rounded-lg border border-rose-800">{enrollError}</p>}
                {enrollSuccess && <p className="text-xs text-emerald-400 font-bold bg-emerald-950/50 p-2 rounded-lg border border-emerald-800">{enrollSuccess}</p>}
                <button
                  type="submit"
                  disabled={isEnrolling}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isEnrolling ? "جاري التفويض وتحديث السجل..." : "✓ اعتماد وتفويض هذا الجهاز فورياً"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Lockout Warning Banner */}
        {isLockedOut ? (
          <div className="p-6 bg-rose-950/40 border border-rose-600/50 rounded-2xl text-center space-y-3 mb-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rose-200">بوابة الإدارة مقفلة أمنياً</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                تم استنفاد المحاولات المسموحة (3/3). تم تفعيل القفل الأمني المشدد لمنع الهجمات التخمينية.
              </p>
            </div>
            {lockoutHours && (
              <div className="flex flex-col items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-900/40 border border-rose-500/40 rounded-xl text-xs font-mono text-rose-300">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  <span>الوقت المتبقي لفك الحظر: ~{lockoutHours} ساعة</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    AdminPortalSecurityService.resetFailedAttempts();
                    setIsLockedOut(false);
                    setRemainingAttempts(3);
                    setErrorMsg(null);
                  }}
                  className="mt-1 px-4 py-2 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  🔓 فك القفل الأمني وتصفير المحاولات الآن
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Main Master Password & 2FA Verification Form */
          <form onSubmit={handleVerify} className="space-y-4 mb-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span>1. كلمة مرور الإدارة العليا (Master Password):</span>
                </label>
                <span className="text-xs text-blue-400 font-bold bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-500/30 font-mono">
                  المحاولات المتبقية: {remainingAttempts} / 3
                </span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading || isLockedOut}
                  className="w-full py-3.5 pr-4 pl-12 rounded-2xl bg-[#030712] border border-blue-500/40 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed placeholder-slate-600"
                  placeholder="••••••••••••"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Step 2: Mandatory 2FA Authenticator Code */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>2. رمز التحقق بخطوتين (Authenticator 2FA - 6 أرقام):</span>
                </label>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                  إجباري
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  inputMode="numeric"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                  disabled={isLoading || isLockedOut}
                  className="w-full py-3 px-4 rounded-xl bg-slate-950 border border-blue-500/60 text-emerald-300 font-mono text-center text-xl font-bold tracking-[0.4em] focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30 transition-all placeholder-slate-600"
                  placeholder="------"
                  dir="ltr"
                />
              </div>

              {/* Authenticator live info & instant sync */}
              <div className="flex items-center justify-between text-[11px] bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>تطبيق Authenticator:</span>
                  <span className="font-mono font-bold text-amber-300 tracking-wider select-all">{activeTotp.code}</span>
                  <span className="text-slate-500">({activeTotp.secondsRemaining} ثانية)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactorCode(activeTotp.code)}
                  className="text-xs text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer"
                >
                  إدراج الرمز المباشر
                </button>
              </div>
            </div>

            {/* Error and Success Banners */}
            {errorMsg && (
              <div className="space-y-2 animate-fadeIn">
                <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-600/70 text-rose-200 text-xs font-bold flex items-center gap-2.5 shadow-md">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-200 text-xs font-medium flex flex-wrap items-center justify-between gap-2 shadow-sm">
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>تم توجيه تنبيه أمني فوري إلى بريد الإدارة:</span>
                  </span>
                  <span className="font-mono text-emerald-300 font-bold bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">{MASTER_ADMIN_EMAIL}</span>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-600/70 text-emerald-200 text-xs font-bold flex items-center gap-2.5 animate-fadeIn shadow-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isLockedOut || !password.trim()}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm sm:text-base shadow-xl shadow-blue-600/30 border border-blue-400/40 transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-white" />
                  <span>جاري التحقق والتشفير المالي...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5 text-blue-200" />
                  <span>دخول لوحة الإدارة العليا (Executive Suite)</span>
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Security Alert Footer Note */}
        <div className="pt-4 border-t border-slate-800/90 text-center space-y-1.5 text-xs text-slate-400">
          <p className="flex items-center justify-center gap-1.5 font-normal">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>توثيق دائم لكافة العمليات وإشعار فوري لإيميل الإدارة:</span>
          </p>
          <p className="font-mono text-blue-300 font-bold">{MASTER_ADMIN_EMAIL}</p>
        </div>
      </div>
    </div>
  );
};
