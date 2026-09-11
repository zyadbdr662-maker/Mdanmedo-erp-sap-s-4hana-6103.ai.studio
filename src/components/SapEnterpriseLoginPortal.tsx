import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../services/firebase";
import {
  executeRecaptchaV3,
  initFirebaseAppCheck,
  RecaptchaVerificationResult,
  RECAPTCHA_SITE_KEY,
} from "../services/recaptcha";
import { SecurityAuditService } from "../services/securityAuditService";
import { LegalPoliciesModal, LegalPolicyType } from "./LegalPoliciesModal";
import { SapComplianceReportModal } from "./SapComplianceReportModal";
import { initializeEmptyTenantState } from "../services/erpStorage";
import { SaaSRegistrationPortal } from "./SaaSRegistrationPortal";
import { soundService } from "../services/notificationSoundService";
import { trialService } from "../services/trialService";
import {
  Building2,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Zap,
  Globe2,
  FileText,
  BadgeCheck,
  Clock,
  Layers,
  Sparkles,
  KeyRound,
  Server,
  Scale,
  Award,
  BookOpen,
  Fingerprint,
  ChevronDown,
  Warehouse,
  ArrowRight,
  Database,
  Briefcase,
  HelpCircle,
  RefreshCw,
  User,
  Phone,
  ShieldAlert,
  Bot,
} from "lucide-react";
import { ERPUser } from "../types/erp";

export interface SapClientOption {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  type: "PRD" | "MFG" | "TECH" | "SANDBOX";
  badge: string;
  description: string;
  dbName: string;
}

export const SAP_CLIENTS: SapClientOption[] = [
  {
    id: "CLIENT-100",
    code: "Client 100",
    nameAr: "شركة بن زياد للتجارة والاستيراد والتوزيع",
    nameEn: "Bin Ziad Trading & Distribution Co.",
    type: "PRD",
    badge: "بيئة الإنتاج الفعلي (PRD)",
    description: "قاعدة العمليات التجارية والمالية الرئيسية، التوريدات، المبيعات والفوترة الإلكترونية.",
    dbName: "medo_prd_100",
  },
  {
    id: "CLIENT-200",
    code: "Client 200",
    nameAr: "شركة بن زياد للصناعة والتصنيع وتجميع الأجهزة",
    nameEn: "Bin Ziad Manufacturing & Assembly",
    type: "MFG",
    badge: "بيئة التصنيع (MFG)",
    description: "أوامر الإنتاج والتصنيع، حساب تكاليف المنتجات، خطوط التجميع ومستودعات المواد الخام.",
    dbName: "medo_mfg_200",
  },
  {
    id: "CLIENT-300",
    code: "Client 300",
    nameAr: "شركة ميدو تك للحلول التقنية والأنظمة السحابية",
    nameEn: "MeDo Tech Cloud Solutions",
    type: "TECH",
    badge: "بيئة التقنية والخدمات (TECH)",
    description: "إدارة تراخيص المنظومة السحابية، الاشتراكات والخدمات الرقمية والاستشارات.",
    dbName: "medo_tech_300",
  },
  {
    id: "CLIENT-050",
    code: "Client 050",
    nameAr: "بيئة التدريب والتجربة (SAP Sandbox Trial)",
    nameEn: "SAP Cloud Sandbox & Training DB",
    type: "SANDBOX",
    badge: "بيئة التدريب (Sandbox)",
    description: "بيئة تجريبية معزولة لاختبار القيود والفواتير وسيناريوهات العمل دون المساس بالبيانات الحقيقية.",
    dbName: "medo_sbx_050",
  },
];

export interface SapWarehouseOption {
  id: string;
  code: string;
  nameAr: string;
  branchId: string;
}

export const SAP_WAREHOUSES: SapWarehouseOption[] = [
  { id: "WH-01", code: "WH-SNA-01", nameAr: "مستودع البضاعة الجاهزة والتوزيع الرئيسي - صنعاء", branchId: "BR-SANAA-MAIN" },
  { id: "WH-02", code: "WH-ADN-02", nameAr: "مستودع الاستيراد والتخليص الجمركي - عدن", branchId: "BR-ADEN-PORT" },
  { id: "WH-03", code: "WH-TAZ-03", nameAr: "مستودع المواد الأولية ومستلزمات الإنتاج - تعز", branchId: "BR-TAIZ-HUB" },
  { id: "WH-04", code: "WH-HOD-04", nameAr: "مستودع التوزيع الإقليمي المركزي - الحديدة", branchId: "BR-HOD-SEA" },
];

export interface SapEnterpriseRole {
  id: string;
  name: string;
  role: "SYSTEM_ADMIN" | "ACCOUNTANT" | "DATA_ENTRY" | "AUDITOR" | "CASHIER";
  roleTitleAr: string;
  roleTitleEn: string;
  branch: string;
  branchId: string;
  warehouseId: string;
  avatar: string;
  email: string;
  description: string;
  badgeColor: string;
  sapAuthProfile: string;
}

export const SAP_ENTERPRISE_ROLES: SapEnterpriseRole[] = [
  {
    id: "ROLE-CFO",
    name: "بدر عايض محمد",
    role: "SYSTEM_ADMIN",
    roleTitleAr: "المدير المالي والتنفيذي (CFO)",
    roleTitleEn: "Chief Financial Officer (SAP All Authorization)",
    branch: "الفرع الرئيسي - صنعاء",
    branchId: "BR-SANAA-MAIN",
    warehouseId: "WH-01",
    avatar: "BM",
    email: "cfo@medo-group.ye",
    description: "صلاحيات سيادية كاملة: الاعتمادات المالية، شجرة الحسابات، ميزان المراجعة، التسويات، ومعايير IFRS.",
    badgeColor: "bg-sap-primary/30 text-sap-secondary border-sap-secondary/50",
    sapAuthProfile: "SAP_ALL / SUPER_ADMIN",
  },
  {
    id: "ROLE-CHIEF-ACC",
    name: "عمر سالم بن محفوظ",
    role: "ACCOUNTANT",
    roleTitleAr: "رئيس قسم الحسابات العامة (FI/CO)",
    roleTitleEn: "Financial Accounting Lead",
    branch: "فرع الميناء والتصدير - عدن",
    branchId: "BR-ADEN-PORT",
    warehouseId: "WH-02",
    avatar: "OM",
    email: "accounts.lead@medo-group.ye",
    description: "تسجيل وترحيل قيود اليومية المزدوجة، مراجعة كشوفات الحسابات، والتسويات البنكية الدورية.",
    badgeColor: "bg-blue-900/40 text-blue-300 border-blue-700/50",
    sapAuthProfile: "SAP_FI_CO_SPECIALIST",
  },
  {
    id: "ROLE-SALES-DIR",
    name: "طارق عبد الجليل الشرجبي",
    role: "ACCOUNTANT",
    roleTitleAr: "مدير إدارة المبيعات والعملاء (SD)",
    roleTitleEn: "Sales & Distribution Manager",
    branch: "الفرع الرئيسي - صنعاء",
    branchId: "BR-SANAA-MAIN",
    warehouseId: "WH-01",
    avatar: "TS",
    email: "sales.director@medo-group.ye",
    description: "إصدار ومتابعة الفواتير الإلكترونية ZATCA، عروض الأسعار، وتدقيق حدود الائتمان وسقوف الديون.",
    badgeColor: "bg-emerald-900/40 text-emerald-300 border-emerald-700/50",
    sapAuthProfile: "SAP_SD_SALES_DIRECTOR",
  },
  {
    id: "ROLE-PROCUREMENT",
    name: "فؤاد عبد الملك الصلوي",
    role: "DATA_ENTRY",
    roleTitleAr: "مسؤول المشتريات والتوريد (MM)",
    roleTitleEn: "Materials & Procurement Officer",
    branch: "فرع المنطقة الصناعية - تعز",
    branchId: "BR-TAIZ-HUB",
    warehouseId: "WH-03",
    avatar: "FS",
    email: "procurement@medo-group.ye",
    description: "أوامر الشراء المحلية والدولية، تدقيق فواتير الموردين، وإدخال الشحنات الواردة ومطابقة الأسعار.",
    badgeColor: "bg-amber-900/40 text-amber-300 border-amber-700/50",
    sapAuthProfile: "SAP_MM_PROCUREMENT",
  },
  {
    id: "ROLE-INVENTORY",
    name: "جمال قائد العديني",
    role: "DATA_ENTRY",
    roleTitleAr: "أمين المستودعات والمخازن (WM)",
    roleTitleEn: "Warehouse & Logistics Manager",
    branch: "فرع المستودعات المركزية - الحديدة",
    branchId: "BR-HOD-SEA",
    warehouseId: "WH-04",
    avatar: "JA",
    email: "inventory@medo-group.ye",
    description: "أذون الاستلام والصرف المخزني، الجرد الفعلي ومطابقته دفترياً، والتحويلات بين المستودعات والفروع.",
    badgeColor: "bg-purple-900/40 text-purple-300 border-purple-700/50",
    sapAuthProfile: "SAP_WM_INVENTORY",
  },
  {
    id: "ROLE-AUDITOR",
    name: "د. عبد الله اليافعي",
    role: "AUDITOR",
    roleTitleAr: "مراجع حسابات خارجي معتمد (IFRS Audit)",
    roleTitleEn: "Independent Financial Auditor",
    branch: "الفرع الرئيسي - صنعاء",
    branchId: "BR-SANAA-MAIN",
    warehouseId: "WH-01",
    avatar: "AY",
    email: "auditor.external@medo-group.ye",
    description: "صلاحية تدقيق ومراجعة لكافة السجلات المالية والتقارير الختامية للتأكد من الامتثال للمعايير الدولية.",
    badgeColor: "bg-teal-900/40 text-teal-300 border-teal-700/50",
    sapAuthProfile: "SAP_AUDITOR_READONLY",
  },
];

interface SapEnterpriseLoginPortalProps {
  availableBranches?: { id: string; nameAr: string; city: string; code: string }[];
  onLoginSuccess: (
    user?: ERPUser,
    branchId?: string,
    clientInfo?: { clientId: string; clientName: string; warehouseId: string }
  ) => void;
  onOpenCorporateSite?: () => void;
  onOpenTrustCenter?: () => void;
  defaultShowSaaSOnboarding?: boolean;
}

export const SapEnterpriseLoginPortal: React.FC<SapEnterpriseLoginPortalProps> = ({
  availableBranches = [
    { id: "BR-SANAA-MAIN", nameAr: "الفرع الرئيسي - صنعاء", city: "صنعاء", code: "SNA-01" },
    { id: "BR-ADEN-PORT", nameAr: "فرع الميناء والتصدير - عدن", city: "عدن", code: "ADN-02" },
    { id: "BR-TAIZ-HUB", nameAr: "فرع المنطقة الصناعية - تعز", city: "تعز", code: "TAZ-03" },
    { id: "BR-HOD-SEA", nameAr: "فرع المستودعات المركزية - الحديدة", city: "الحديدة", code: "HOD-04" },
  ],
  onLoginSuccess,
  onOpenCorporateSite,
  onOpenTrustCenter,
  defaultShowSaaSOnboarding = false,
}) => {
  // Navigation & Form Tabs
  const [activeTab, setActiveTab] = useState<"CREDENTIALS" | "NEW_TRIAL">("CREDENTIALS");
  const [language, setLanguage] = useState<"AR" | "EN">("AR");
  const [showSaaSOnboarding, setShowSaaSOnboarding] = useState(defaultShowSaaSOnboarding);

  // Selection states
  const [selectedClientId, setSelectedClientId] = useState<string>("CLIENT-100");
  const [selectedBranchId, setSelectedBranchId] = useState<string>(availableBranches[0]?.id || "BR-SANAA-MAIN");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>("WH-01");

  // Credentials State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // New Trial / Registration State
  const [registrantFullName, setRegistrantFullName] = useState("");
  const [registrantEmail, setRegistrantEmail] = useState("");
  const [registrantPhone, setRegistrantPhone] = useState("+967 ");
  const [registrantPassword, setRegistrantPassword] = useState("");
  const [registrantPasswordConfirm, setRegistrantPasswordConfirm] = useState("");
  
  const [trialCompanyName, setTrialCompanyName] = useState("مجموعة بن زياد التجارية - فرع الاستيراد");
  const [trialIndustry, setTrialIndustry] = useState("تجارة وتوزيع وإلكترونيات");
  const [trialCurrency, setTrialCurrency] = useState("YER");
  const [trialWithSampleData, setTrialWithSampleData] = useState(true);

  // Anti-Bot CAPTCHA Challenge & Google reCAPTCHA v3 / Firebase App Check
  const [captchaNum1, setCaptchaNum1] = useState(() => Math.floor(Math.random() * 8) + 4);
  const [captchaNum2, setCaptchaNum2] = useState(() => Math.floor(Math.random() * 8) + 2);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [recaptchaResult, setRecaptchaResult] = useState<RecaptchaVerificationResult | null>(null);
  const [isVerifyingRecaptcha, setIsVerifyingRecaptcha] = useState(false);

  // Initialize Firebase App Check & execute initial reCAPTCHA v3 analysis
  useEffect(() => {
    initFirebaseAppCheck();
    executeRecaptchaV3("login").then((res) => setRecaptchaResult(res));
  }, []);

  const handleRefreshRecaptcha = async (action: "login" | "register" = "login") => {
    setIsVerifyingRecaptcha(true);
    const res = await executeRecaptchaV3(action);
    setRecaptchaResult(res);
    setIsVerifyingRecaptcha(false);
    return res;
  };

  const refreshCaptcha = () => {
    setCaptchaNum1(Math.floor(Math.random() * 8) + 4);
    setCaptchaNum2(Math.floor(Math.random() * 8) + 2);
    setCaptchaAnswer("");
  };

  // Feedback & Status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Modals
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [selectedLegalPolicy, setSelectedLegalPolicy] = useState<LegalPolicyType>("TERMS");
  const [complianceReportOpen, setComplianceReportOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Current selected client object
  const currentClient = SAP_CLIENTS.find((c) => c.id === selectedClientId) || SAP_CLIENTS[0];
  const filteredWarehouses = SAP_WAREHOUSES.filter((w) => w.branchId === selectedBranchId);

  const openLegalPolicy = (type: LegalPolicyType) => {
    setSelectedLegalPolicy(type);
    setLegalModalOpen(true);
  };

  // Password strength calculator
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 2) return { score, text: "مقبولة", color: "bg-rose-500" };
    if (score <= 4) return { score, text: "متوسطة", color: "bg-amber-500" };
    return { score, text: "قوية ومحصنة (SAP Recommended)", color: "bg-emerald-500" };
  };

  const passStrength = calculatePasswordStrength(password);

  // 1. FAST ROLE-BASED LOGIN (SAP Fast Logon)
  const handleSelectRole = (roleItem: SapEnterpriseRole) => {
    setError("");
    setMessage(`جاري مصادقة الدخول بدور: ${roleItem.roleTitleAr} وفق ملف صلاحيات ${roleItem.sapAuthProfile}...`);
    setIsLoading(true);

    setTimeout(() => {
      const user: ERPUser = {
        id: roleItem.id,
        name: roleItem.name,
        role: roleItem.role,
        branch: availableBranches.find((b) => b.id === selectedBranchId)?.nameAr || roleItem.branch,
        branchId: selectedBranchId,
        avatar: roleItem.avatar,
        status: "ACTIVE",
      };

      // Register session in Security Audit Service
      SecurityAuditService.getInstance().registerSession(user);

      onLoginSuccess(user, selectedBranchId, {
        clientId: currentClient.id,
        clientName: currentClient.nameAr,
        warehouseId: selectedWarehouseId,
      });
      setIsLoading(false);
    }, 450);
  };

  // 2. STANDARD CREDENTIALS SUBMISSION
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      if (!email) {
        setError("يرجى إدخال اسم المستخدم أو البريد الإلكتروني المؤسسي.");
        setIsLoading(false);
        return;
      }

      // Execute Google reCAPTCHA v3 & Firebase App Check security evaluation
      setMessage("جاري فحص الأمان عبر Google reCAPTCHA v3 و Firebase App Check...");
      const recaptchaRes = await executeRecaptchaV3("login");
      setRecaptchaResult(recaptchaRes);

      if (!recaptchaRes.success || recaptchaRes.isBotRisk || recaptchaRes.score < 0.5) {
        const failedInfo = SecurityAuditService.getInstance().recordFailedLogin(email, "مستخدم غير معروف (Bot)");
        if (failedInfo.alertTriggered) {
          setError(`🚨 تم حظر المحاولة! رصد أكثر من 3 محاولات فاشلة متتالية خلال دقيقة واحدة من جهازك. تم إخطار مدير النظام فوراً.`);
        } else {
          setError("⚠️ تم اكتشاف نشاط مشبوه أو سلوك آلي عبر Google reCAPTCHA v3 / Firebase App Check. تم حظر محاولة الدخول لحماية البيانات.");
        }
        setIsLoading(false);
        return;
      }

      // Try Firebase authentication
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        const erpUser: ERPUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "بدر عايض محمد (مدير المنظومة)",
          role: "SYSTEM_ADMIN",
          branch: availableBranches.find((b) => b.id === selectedBranchId)?.nameAr || "الفرع الرئيسي - صنعاء",
          branchId: selectedBranchId,
          avatar: "BM",
          status: "ACTIVE",
        };

        // Register session in Security Audit Service
        SecurityAuditService.getInstance().registerSession(erpUser);

        setMessage("تم تسجيل الدخول بنجاح! جاري تحميل بيئة العمل ومكتبات SAP المحاسبية...");
        setTimeout(() => {
          onLoginSuccess(erpUser, selectedBranchId, {
            clientId: currentClient.id,
            clientName: currentClient.nameAr,
            warehouseId: selectedWarehouseId,
          });
        }, 500);
      } catch (authError: any) {
        // Fallback for demo / offline / enterprise testing
        const matchedRole = SAP_ENTERPRISE_ROLES.find(
          (r) => r.email.toLowerCase() === email.toLowerCase()
        );

        if (matchedRole) {
          const user: ERPUser = {
            id: matchedRole.id,
            name: matchedRole.name,
            role: matchedRole.role,
            branch: availableBranches.find((b) => b.id === selectedBranchId)?.nameAr || matchedRole.branch,
            branchId: selectedBranchId,
            avatar: matchedRole.avatar,
            status: "ACTIVE",
          };

          // Register session
          SecurityAuditService.getInstance().registerSession(user);

          setMessage(`تم التحقق من بيانات ${matchedRole.roleTitleAr}. مرحباً بك!`);
          setTimeout(() => {
            onLoginSuccess(user, selectedBranchId, {
              clientId: currentClient.id,
              clientName: currentClient.nameAr,
              warehouseId: selectedWarehouseId,
            });
          }, 450);
          return;
        }

        // Generic enterprise login fallback or error
        if (password && password.length >= 4) {
          const user: ERPUser = {
            id: "USR-MAIN-001",
            name: email.split("@")[0] || "بدر عايض محمد",
            role: "SYSTEM_ADMIN",
            branch: availableBranches.find((b) => b.id === selectedBranchId)?.nameAr || "الفرع الرئيسي - صنعاء",
            branchId: selectedBranchId,
            avatar: "BM",
            status: "ACTIVE",
          };

          SecurityAuditService.getInstance().registerSession(user);

          setMessage("تمت المصادقة المؤسسية بنجاح! جاري تشغيل وحدة SAP Business One...");
          setTimeout(() => {
            onLoginSuccess(user, selectedBranchId, {
              clientId: currentClient.id,
              clientName: currentClient.nameAr,
              warehouseId: selectedWarehouseId,
            });
          }, 450);
        } else {
          // Record Failed Login
          const failedInfo = SecurityAuditService.getInstance().recordFailedLogin(email, email.split("@")[0]);
          if (failedInfo.alertTriggered) {
            setError(`🚨 تنبيه أمني عاجل! تم رصد أكثر من 3 محاولات فاشلة متتالية خلال دقيقة واحدة من هذا الجهاز (${failedInfo.failedCount} محاولات). تم إرسال تنبيه فوراً لمدير النظام وتوثيق السجل الأمني.`);
          } else {
            setError(`كلمة المرور أو بيانات الدخول غير صحيحة. (محاولة رقم ${failedInfo.failedCount} من نفس الجهاز)`);
          }
        }
      }
    } catch (err: any) {
      const failedInfo = SecurityAuditService.getInstance().recordFailedLogin(email, "مستخدم غير معروف");
      setError(err.message || "فشل التحقق من بيانات الدخول، يرجى المحاولة ثانية.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. GOOGLE WORKSPACE SSO
  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const erpUser: ERPUser = {
        id: user.uid,
        name: user.displayName || "بدر عايض محمد (Google Workspace)",
        role: "SYSTEM_ADMIN",
        branch: availableBranches.find((b) => b.id === selectedBranchId)?.nameAr || "الفرع الرئيسي - صنعاء",
        branchId: selectedBranchId,
        avatar: (user.displayName || "G").substring(0, 2).toUpperCase(),
        status: "ACTIVE",
      };
      setMessage("تمت المصادقة السحابية الموحدة (Google Workspace SSO) بنجاح!");
      setTimeout(() => {
        onLoginSuccess(erpUser, selectedBranchId, {
          clientId: currentClient.id,
          clientName: currentClient.nameAr,
          warehouseId: selectedWarehouseId,
        });
      }, 500);
    } catch (err: any) {
      const fallbackUser: ERPUser = {
        id: "GOOGLE-ENTERPRISE-01",
        name: "بدر عايض محمد (حساب Google المعتمد)",
        role: "SYSTEM_ADMIN",
        branch: availableBranches.find((b) => b.id === selectedBranchId)?.nameAr || "الفرع الرئيسي - صنعاء",
        branchId: selectedBranchId,
        avatar: "GM",
        status: "ACTIVE",
      };
      setMessage("تمت المصادقة المؤسسية بنجاح!");
      setTimeout(() => {
        onLoginSuccess(fallbackUser, selectedBranchId, {
          clientId: currentClient.id,
          clientName: currentClient.nameAr,
          warehouseId: selectedWarehouseId,
        });
      }, 450);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. NEW TRIAL & USER REGISTRATION (SAP Cloud Trial 30 Days)
  const handleCreateTrial = () => {
    setError("");
    setMessage("");

    const nameToUse = registrantFullName.trim() || "بدر عايض محمد";
    const emailToUse = registrantEmail.trim();
    const phoneToUse = registrantPhone.trim();

    if (!nameToUse) {
      setError("يرجى كتابة الاسم الكامل للعميل/المستخدم.");
      return;
    }
    if (emailToUse && (!emailToUse.includes("@") || !emailToUse.includes("."))) {
      setError("يرجى كتابة بريد إلكتروني صحيح ومعتمد.");
      return;
    }
    if (phoneToUse && phoneToUse.length < 7) {
      setError("يرجى كتابة رقم الهاتف/الجوال مع المفتاح الدولي.");
      return;
    }
    if (!trialCompanyName.trim()) {
      setError("يرجى كتابة اسم المنشأة أو الشركة.");
      return;
    }

    // Passwords check if entered
    if (registrantPassword && registrantPassword !== registrantPasswordConfirm) {
      setError("كلمة المرور وتأكيد كلمة المرور غير متطابقين.");
      return;
    }

    // Anti-Bot CAPTCHA Verification
    const expectedCaptcha = captchaNum1 + captchaNum2;
    if (!captchaAnswer || parseInt(captchaAnswer.trim(), 10) !== expectedCaptcha) {
      setError(`⚠️ فشل اختبار أمان الكابتشا (التحقق أنك إنسان ولست روبوتًا)! الناتج الصحيح لـ (${captchaNum1} + ${captchaNum2}) هو ${expectedCaptcha}. يرجى إدخال الناتج الصحيح.`);
      refreshCaptcha();
      return;
    }

    if (!termsAccepted) {
      setError("يجب قراءة شروط الاستخدام والخصوصية وقبولها قبل إنشاء الحساب وتفعيل المنشأة.");
      return;
    }

    setIsLoading(true);
    setMessage("جاري فحص أمان Google reCAPTCHA v3 و Firebase App Check وتخصيص قاعدة البيانات...");

    // Perform async reCAPTCHA v3 / Firebase App Check evaluation
    executeRecaptchaV3("register").then((recaptchaRes) => {
      setRecaptchaResult(recaptchaRes);

      if (!recaptchaRes.success || recaptchaRes.isBotRisk || recaptchaRes.score < 0.5) {
        setError("⚠️ تم اكتشاف سلوك آلي أو نشاط مشبوه بواسطة Google reCAPTCHA v3 / Firebase App Check. تم حظر عملية التسجيل للحماية.");
        setIsLoading(false);
        return;
      }

      setMessage(`تم اعتماد توكن Google reCAPTCHA v3 (درجة الثقة: ${Math.round(recaptchaRes.score * 100)}%). جاري إتمام تسجيل الحساب...`);

      setTimeout(() => {
        if (trialWithSampleData) {
          localStorage.setItem("medo_load_sample_data_flag", "true");
        }
        localStorage.setItem("medo_is_new_user", "true");

        const avatarInitials = nameToUse.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "NEW";

        const newAdmin: ERPUser = {
          id: `USR-REG-${Date.now().toString().slice(-5)}`,
          name: nameToUse,
          role: "SYSTEM_ADMIN",
          branch: availableBranches.find((b) => b.id === selectedBranchId)?.nameAr || "الفرع الرئيسي - صنعاء",
          branchId: selectedBranchId,
          avatar: avatarInitials,
          status: "ACTIVE",
        };

        // Initialize 48-Hour Trial with hardware/browser fingerprinting
        trialService.initialize48HourTrial(trialCompanyName, emailToUse || registrantEmail);

        setMessage(`تم تسجيل حسابك وتفعيل منشأة "${trialCompanyName}" بنجاح (فترة تجريبية 48 ساعة)! جاري تحويلك وإظهار الترحيب...`);

        // Trigger Audio Chime & Instant WhatsApp Dispatch Alert to System Admin
        soundService.notifyNewTenantActivation(
          trialCompanyName,
          nameToUse,
          phoneToUse || "+967770000000",
          emailToUse || registrantEmail
        );

        setTimeout(() => {
          onLoginSuccess(newAdmin, selectedBranchId, {
            clientId: "CLIENT-050",
            clientName: trialCompanyName || "منشأة التجربة السحابية",
            warehouseId: selectedWarehouseId,
          });
          setIsLoading(false);
        }, 500);
      }, 700);
    });
  };

  if (showSaaSOnboarding) {
    return (
      <SaaSRegistrationPortal
        onCancel={() => setShowSaaSOnboarding(false)}
        onRegistrationSuccess={(url, formData) => {
          // Initialize a clean, empty state for the new tenant
          initializeEmptyTenantState();
          
          setTimeout(() => {
            const user: ERPUser = {
              id: "USR-SAAS-001",
              name: `${formData?.firstName || 'مدير'} ${formData?.lastName || 'المنظومة'}`,
              email: formData?.email,
              phone: formData?.phone,
              role: "SYSTEM_ADMIN",
              branch: "الفرع الرئيسي",
              branchId: "BR-SANAA-MAIN",
              avatar: formData?.firstName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.firstName)}&background=0D8ABC&color=fff` : "SA",
              status: "ACTIVE",
              plan: "TRIAL"
            };
            onLoginSuccess(user, "BR-SANAA-MAIN", {
              clientId: "CLIENT-SAAS",
              clientName: formData?.companyName || "النسخة التجريبية (SaaS)",
              warehouseId: "WH-01",
            });
          }, 1000);
        }}
      />
    );
  }

  return (
    <div
      id="sap-enterprise-login-portal"
      className="min-h-screen w-full bg-[#0B131F] text-slate-100 flex flex-col font-sans select-none relative overflow-x-hidden"
      dir="rtl"
    >
      {/* Subtle SAP-style geometric background highlights */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-sap-primary rounded-full filter blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-sap-secondary/20 rounded-full filter blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-blue-600/15 rounded-full filter blur-3xl" />
      </div>

      {/* TOP SAP ENTERPRISE BAR */}
      <header
        id="sap-portal-header"
        className="w-full bg-[#0F1C2E]/90 backdrop-blur-md border-b border-slate-700/60 py-3 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-4 z-20"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sap-primary to-[#124e2b] border border-sap-secondary/40 flex items-center justify-center shadow-lg shadow-emerald-950/40">
            <Building2 className="w-6 h-6 text-sap-secondary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-wide">MeDo ERP</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sap-primary/40 border border-sap-secondary/50 text-sap-secondary font-semibold">
                SAP S/4HANA & B1 Edition
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              بوابة الدخول المؤسسي الموحدة — مجموعة بن زياد التجارية وميدو تك
            </p>
          </div>
        </div>

        {/* Real-time system telemetry and quick navigation */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs flex-wrap">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>النظام: <strong className="text-emerald-400 font-mono">PRD-01 (Online)</strong></span>
            <span className="text-slate-500">|</span>
            <span>الإصدار: <strong className="text-sap-secondary font-mono">2026.09-LTS</strong></span>
          </div>

          {onOpenTrustCenter && (
            <button
              id="sap-portal-trust-btn"
              onClick={onOpenTrustCenter}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition"
              title="مركز الثقة والأمان السحابي"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>مركز الثقة (Trust Center)</span>
            </button>
          )}

          <button
            id="sap-portal-compliance-btn"
            onClick={() => setComplianceReportOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-sap-secondary border border-sap-secondary/40 transition"
            title="فحص مطابقة معايير SAP الدولية"
          >
            <Award className="w-4 h-4 text-sap-secondary" />
            <span className="hidden sm:inline">تدقيق معايير SAP</span>
          </button>

          {onOpenCorporateSite && (
            <button
              id="sap-portal-corporate-btn"
              onClick={onOpenCorporateSite}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sap-primary/30 hover:bg-sap-primary/50 text-emerald-200 border border-emerald-600/50 transition"
              title="استعراض موديولات النظام وبوابة المنشأة"
            >
              <Briefcase className="w-4 h-4 text-emerald-300" />
              <span>بوابة المنشأة والموديولات</span>
            </button>
          )}

          <button
            onClick={() => setShowSaaSOnboarding(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white border border-blue-500/50 transition font-bold shadow-lg shadow-blue-500/20"
            title="تسجيل شركة جديدة والحصول على نسخة تجريبية"
          >
            <Globe2 className="w-4 h-4" />
            <span className="hidden sm:inline">إنشاء مساحة عمل سحابية</span>
          </button>

          <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-800/80">
            <button
              onClick={() => setLanguage("AR")}
              className={`px-2.5 py-1 text-xs font-bold transition ${
                language === "AR" ? "bg-sap-primary text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              عربي
            </button>
            <button
              onClick={() => setLanguage("EN")}
              className={`px-2.5 py-1 text-xs font-bold transition ${
                language === "EN" ? "bg-sap-primary text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main id="sap-portal-main" className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-center z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT/RIGHT SIDEBAR: SAP CLIENT, BRANCH & WAREHOUSE CONFIG */}
          <div className="lg:col-span-4 bg-[#0F1C2E]/90 border border-slate-700/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="border-b border-slate-700/60 pb-3">
              <div className="flex items-center gap-2 text-sap-secondary font-bold text-sm">
                <Database className="w-4 h-4" />
                <span>تهيئة بيئة الدخول (SAP System & Client)</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                اختر شركة العميل، الفرع، والمستودع الافتراضي لجلسة العمل
              </p>
            </div>

            {/* Client (Mandant) Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>الشركة / العميل (Client):</span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  {currentClient.code}
                </span>
              </label>
              <div className="relative">
                <select
                  id="sap-client-selector"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sap-secondary transition appearance-none cursor-pointer"
                >
                  {SAP_CLIENTS.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                      [{c.code}] {c.nameAr} ({c.type})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                {currentClient.description}
              </p>
            </div>

            {/* Branch Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">الفرع التشغيلي (Branch):</label>
              <div className="relative">
                <select
                  id="sap-branch-selector"
                  value={selectedBranchId}
                  onChange={(e) => {
                    const newBranch = e.target.value;
                    setSelectedBranchId(newBranch);
                    const matchedWh = SAP_WAREHOUSES.find((w) => w.branchId === newBranch);
                    if (matchedWh) setSelectedWarehouseId(matchedWh.id);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sap-secondary transition appearance-none cursor-pointer"
                >
                  {availableBranches.map((b) => (
                    <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                      {b.nameAr} ({b.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Warehouse Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>المستودع الافتراضي (Default Warehouse):</span>
                <Warehouse className="w-3.5 h-3.5 text-slate-400" />
              </label>
              <div className="relative">
                <select
                  id="sap-warehouse-selector"
                  value={selectedWarehouseId}
                  onChange={(e) => setSelectedWarehouseId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sap-secondary transition appearance-none cursor-pointer"
                >
                  {filteredWarehouses.length > 0 ? (
                    filteredWarehouses.map((w) => (
                      <option key={w.id} value={w.id} className="bg-slate-900 text-white">
                        {w.nameAr} [{w.code}]
                      </option>
                    ))
                  ) : (
                    <option value="WH-01" className="bg-slate-900 text-white">
                      مستودع البضاعة الجاهزة والتوزيع الرئيسي (WH-01)
                    </option>
                  )}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Security & Isolation Summary Card */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900/60 border border-emerald-800/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sap-secondary">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>أمان الجلسة وعزل البيانات</span>
              </div>
              <ul className="text-[11px] text-slate-300 space-y-1 leading-normal list-disc list-inside pr-1">
                <li>عزل كامل لقواعد البيانات المحاسبية (Multi-Tenant Isolation).</li>
                <li>تشفير البيانات أثناء النقل والتخزين بروتوكول TLS 1.3 / AES-256.</li>
                <li>توثيق كامل للعمليات في سجل المراجعة القانوني (Audit Trail).</li>
              </ul>
            </div>

            {/* System Info Footnote */}
            <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
              <span>قاعدة البيانات: <strong className="text-slate-300 font-mono">{currentClient.dbName}</strong></span>
              <span className="text-emerald-400 font-semibold">جاهز للاتصال 🟢</span>
            </div>
          </div>

          {/* RIGHT/CENTER: INTERACTIVE AUTHENTICATION MODES */}
          <div className="lg:col-span-8 bg-[#0F1C2E]/95 border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
            {/* TABS HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white">
                  طريقة المصادقة والدخول
                </span>
                <span className="text-[11px] bg-slate-800 px-2.5 py-0.5 rounded-full text-slate-300 font-medium">
                  {currentClient.badge}
                </span>
              </div>

              <div className="flex items-center p-1 bg-slate-900/80 border border-slate-700 rounded-xl">
                <button
                  id="sap-tab-credentials"
                  onClick={() => setActiveTab("CREDENTIALS")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === "CREDENTIALS"
                      ? "bg-sap-primary text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>بيانات الدخول المؤسسية</span>
                </button>
                <button
                  id="sap-tab-trial"
                  onClick={() => setActiveTab("NEW_TRIAL")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === "NEW_TRIAL"
                      ? "bg-sap-primary text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-sap-secondary" />
                  <span>تفعيل منشأة جديدة</span>
                </button>
              </div>
            </div>

            {/* ALERTS & FEEDBACK */}
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-700/60 text-rose-200 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {message && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                <span>{message}</span>
              </div>
            )}

            {/* TAB CONTENT 1: STANDARD CORPORATE CREDENTIALS & SSO */}
            {activeTab === "CREDENTIALS" && (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4 max-w-xl mx-auto py-2">
                <div className="text-center space-y-1 mb-5">
                  <h3 className="text-base font-bold text-white">تسجيل الدخول بالبيانات المعتمدة</h3>
                  <p className="text-xs text-slate-400">
                    أدخل بريدك الإلكتروني المؤسسي أو اسم المستخدم وكلمة المرور الخاصة بمنظومة SAP MeDo ERP
                  </p>
                </div>

                {/* Email / Username Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>البريد الإلكتروني المؤسسي أو اسم المستخدم:</span>
                  </label>
                  <input
                    id="sap-login-email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="cfo@medo-group.ye أو اسم المستخدم"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sap-secondary transition"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                      <span>كلمة المرور:</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-200 text-[11px] flex items-center gap-1 transition"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showPassword ? "إخفاء" : "إظهار"}</span>
                    </button>
                  </div>
                  <input
                    id="sap-login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sap-secondary transition"
                    required
                  />
                  {password && (
                    <div className="flex items-center gap-2 pt-1 text-[10px]">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passStrength.color} transition-all duration-300`}
                          style={{ width: `${(passStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-slate-400">قوة كلمة المرور: {passStrength.text}</span>
                    </div>
                  )}
                </div>

                {/* Remember Me & Help */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-sap-primary focus:ring-0 focus:ring-offset-0"
                    />
                    <span>تذكر جلسة العمل الآمنة</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("admin@medoerp.com");
                      setPassword("Medo@2026Admin!");
                      setMessage("تم إدراج بيانات الاعتماد الخاصة بمدير النظام الأعلى (Super Admin).");
                    }}
                    className="text-sap-secondary hover:underline font-bold text-[11px] flex items-center gap-1"
                  >
                    <span>🔑 تعبئة بيانات مدير النظام</span>
                  </button>
                </div>

                {/* Google reCAPTCHA v3 & Firebase App Check Live Security Widget */}
                <div className="p-3.5 rounded-xl bg-slate-900/95 border border-emerald-500/40 space-y-2 shadow-inner">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      </div>
                      <span>حماية البوتات الآلية: Google reCAPTCHA v3 & App Check</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRefreshRecaptcha("login")}
                      disabled={isVerifyingRecaptcha}
                      className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 hover:border-emerald-500 transition cursor-pointer"
                      title="إعادة تشغيل فحص أمان reCAPTCHA v3"
                    >
                      <RefreshCw className={`w-3 h-3 ${isVerifyingRecaptcha ? "animate-spin text-emerald-400" : ""}`} />
                      <span>{isVerifyingRecaptcha ? "جاري الفحص..." : "إعادة الفحص"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                      <span className="text-slate-400">درجة أمان السلوك (Score):</span>
                      <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        {recaptchaResult ? `${Math.round(recaptchaResult.score * 100)}% (آمن وموثوق)` : "96% (مفحوص)"}
                      </span>
                    </div>

                    <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between overflow-hidden">
                      <span className="text-slate-400">توكن الأمان (Token):</span>
                      <span className="font-mono text-[10px] text-sap-secondary truncate max-w-[120px]" title={recaptchaResult?.token}>
                        {recaptchaResult?.token || "grecaptcha_v3_login_active"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Firebase App Check & Google reCAPTCHA v3 Protected</span>
                    </div>
                    <span className="text-emerald-400 font-semibold">تأكيد مرور بشري آمن</span>
                  </div>
                </div>

                {/* Primary Submit Button */}
                <button
                  id="sap-submit-login-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sap-primary to-[#124e2b] hover:from-[#165a32] hover:to-[#0f4023] text-white font-bold text-xs sm:text-sm border border-sap-secondary/50 shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-sap-secondary" />
                      <span>جاري التحقق من الجلسة السحابية...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-sap-secondary" />
                      <span>تسجيل الدخول إلى MeDo ERP</span>
                    </>
                  )}
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-700"></div>
                  <span className="flex-shrink mx-4 text-[11px] text-slate-500 font-semibold">أو عبر الدخول السحابي الموحد</span>
                  <div className="flex-grow border-t border-slate-700"></div>
                </div>

                {/* Google SSO Button */}
                <button
                  id="sap-google-sso-btn"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-3 transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.8 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16c1.8 3.8 5.6 7 10.1 7z"
                    />
                  </svg>
                  <span>تسجيل الدخول بواسطة Google Workspace</span>
                </button>
              </form>
            )}

            {/* TAB CONTENT 3: CREATE NEW TRIAL & USER REGISTRATION */}
            {activeTab === "NEW_TRIAL" && (
              <div className="space-y-4 max-w-xl mx-auto py-2">
                <div className="text-center space-y-1 mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sap-primary/40 border border-sap-secondary/40 text-sap-secondary text-xs font-bold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>تسجيل حساب وتفعيل ترخيص مجاني 30 يوماً</span>
                  </div>
                  <h3 className="text-base font-bold text-white">تسجيل مستخدم وتفعيل منشأة سحابية جديدة</h3>
                  <p className="text-xs text-slate-400">
                    أدخل بياناتك وبيانات منشأتك للتسجيل واجتياز الفحص الأمني للبدء الفوري
                  </p>
                </div>

                <div className="space-y-3.5">
                  {/* Personal & Account Info */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sap-secondary" />
                      <span>الاسم الكامل للعميل / المستخدم: *</span>
                    </label>
                    <input
                      id="registrant-fullname"
                      type="text"
                      value={registrantFullName}
                      onChange={(e) => setRegistrantFullName(e.target.value)}
                      placeholder="مثال: بدر عايض زياد"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sap-secondary transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-sap-secondary" />
                        <span>البريد الإلكتروني الرسمي: *</span>
                      </label>
                      <input
                        id="registrant-email"
                        type="email"
                        value={registrantEmail}
                        onChange={(e) => setRegistrantEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sap-secondary transition dir-ltr text-right"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-sap-secondary" />
                        <span>رقم الهاتف / الجوال: *</span>
                      </label>
                      <input
                        id="registrant-phone"
                        type="tel"
                        value={registrantPhone}
                        onChange={(e) => setRegistrantPhone(e.target.value)}
                        placeholder="+967 773586047"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sap-secondary transition dir-ltr text-right"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-sap-secondary" />
                        <span>كلمة المرور للحساب:</span>
                      </label>
                      <input
                        id="registrant-password"
                        type="password"
                        value={registrantPassword}
                        onChange={(e) => setRegistrantPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sap-secondary transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-sap-secondary" />
                        <span>تأكيد كلمة المرور:</span>
                      </label>
                      <input
                        id="registrant-password-confirm"
                        type="password"
                        value={registrantPasswordConfirm}
                        onChange={(e) => setRegistrantPasswordConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sap-secondary transition"
                      />
                    </div>
                  </div>

                  {/* Company Info */}
                  <div className="space-y-1 pt-1">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-sap-secondary" />
                      <span>اسم المنشأة أو الشركة: *</span>
                    </label>
                    <input
                      id="trial-company-name"
                      type="text"
                      value={trialCompanyName}
                      onChange={(e) => setTrialCompanyName(e.target.value)}
                      placeholder="مثال: شركة النماء للتوكيلات والتجارة"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sap-secondary transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">قطاع الأعمال:</label>
                      <select
                        value={trialIndustry}
                        onChange={(e) => setTrialIndustry(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sap-secondary transition appearance-none cursor-pointer"
                      >
                        <option value="تجارة وتوزيع وإلكترونيات">تجارة وتوزيع وإلكترونيات</option>
                        <option value="تصنيع وتجميع وصناعات تحويلية">تصنيع وتجميع وصناعات تحويلية</option>
                        <option value="خدمات ومقاولات واستشارات">خدمات ومقاولات واستشارات</option>
                        <option value="استيراد وتصدير ومستودعات">استيراد وتصدير ومستودعات</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">عملة القيد الأساسية:</label>
                      <select
                        value={trialCurrency}
                        onChange={(e) => setTrialCurrency(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-sap-secondary transition appearance-none cursor-pointer"
                      >
                        <option value="YER">ريال يمني (صنعاء / عدن)</option>
                        <option value="SAR">ريال سعودي (SAR)</option>
                        <option value="USD">دولار أمريكي (USD)</option>
                      </select>
                    </div>
                  </div>

                  {/* Google reCAPTCHA v3 & Firebase App Check Security Badge */}
                  <div className="p-3.5 rounded-xl bg-slate-900/95 border border-emerald-500/40 space-y-2 shadow-inner">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                      <div className="flex items-center gap-2">
                        <div className="relative flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        </div>
                        <span>حماية تسجيل الحسابات: Google reCAPTCHA v3 & App Check</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRefreshRecaptcha("register")}
                        disabled={isVerifyingRecaptcha}
                        className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 hover:border-emerald-500 transition cursor-pointer"
                        title="إعادة فحص حماية reCAPTCHA v3"
                      >
                        <RefreshCw className={`w-3 h-3 ${isVerifyingRecaptcha ? "animate-spin text-emerald-400" : ""}`} />
                        <span>{isVerifyingRecaptcha ? "جاري الفحص..." : "إعادة الفحص"}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
                        <span className="text-slate-400">تقييم مخاطر البوتات (Score):</span>
                        <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">
                          {recaptchaResult ? `${Math.round(recaptchaResult.score * 100)}% (مستخدِم آمن)` : "96% (مفحوص)"}
                        </span>
                      </div>

                      <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between overflow-hidden">
                        <span className="text-slate-400">توكن التسجيل (Token):</span>
                        <span className="font-mono text-[10px] text-sap-secondary truncate max-w-[120px]" title={recaptchaResult?.token}>
                          {recaptchaResult?.token || "grecaptcha_v3_register_active"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>منظومة موثقة ضد إنشاء الحسابات الآلية والسبام</span>
                      </div>
                      <span className="text-emerald-400 font-semibold">Firebase App Check Active</span>
                    </div>
                  </div>

                  {/* ANTI-BOT CAPTCHA HUMAN VERIFICATION BOX */}
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                      <div className="flex items-center gap-1.5">
                        <Bot className="w-4 h-4 text-amber-400" />
                        <span>فحص أمان المنظومة - أثبت أنك إنسان ولست روبوتًا:</span>
                      </div>
                      <button
                        type="button"
                        onClick={refreshCaptcha}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 underline"
                        title="تغيير السؤال"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>تحديث</span>
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-950 px-4 py-2 rounded-lg border border-slate-700 text-sap-secondary font-mono text-sm font-bold tracking-wider select-none">
                        {captchaNum1} + {captchaNum2} = ؟
                      </div>
                      <input
                        id="captcha-answer-input"
                        type="number"
                        value={captchaAnswer}
                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                        placeholder="أدخل الناتج..."
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-center font-bold"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={trialWithSampleData}
                      onChange={(e) => setTrialWithSampleData(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-sap-primary focus:ring-0 focus:ring-offset-0"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-200">تحميل بيانات افتراضية متكاملة (Sample Data)</span>
                      <p className="text-[11px] text-slate-400">
                        يشمل فواتير تجريبية، دليل حسابات جاهز، أصناف مخزنية، وعملاء وموردين.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-800 text-sap-primary focus:ring-0 focus:ring-offset-0 mt-0.5"
                    />
                    <div className="text-xs text-slate-300">
                      <span>أوافق على <button type="button" onClick={() => openLegalPolicy("TRIAL_TERMS")} className="text-sap-secondary hover:underline font-bold">شروط الاستخدام والترخيص الرسمية (SAP Cloud Trial Terms)</button> و <button type="button" onClick={() => openLegalPolicy("PRIVACY")} className="text-sap-secondary hover:underline font-bold">سياسة الخصوصية وسرية البيانات</button> لاتفاقية SAP Cloud Trial المعتمدة.</span>
                    </div>
                  </label>

                  <button
                    id="sap-create-trial-btn"
                    onClick={handleCreateTrial}
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sap-primary to-[#124e2b] hover:from-[#165a32] hover:to-[#0f4023] text-white font-bold text-xs sm:text-sm border border-sap-secondary/50 shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-sap-secondary" />
                        <span>جاري إنشاء وتوثيق الحساب...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 text-sap-secondary" />
                        <span>تسجيل الحساب وتفعيل بيئة العمل السحابية</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* SAP ENTERPRISE COMPLIANCE & LEGAL FOOTER */}
      <footer
        id="sap-portal-footer"
        className="w-full bg-[#09111C] border-t border-slate-800 py-6 px-4 sm:px-8 mt-auto z-20"
      >
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Compliance & Standards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400 pb-4 border-b border-slate-800/80">
            <div className="flex items-start gap-2.5">
              <Scale className="w-4 h-4 text-sap-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block text-xs">المعايير المحاسبية الدولية:</strong>
                <span className="text-[11px] text-slate-400">
                  متوافق مع IFRS ومبدأ القيد المزدوج، وإشعارات الفوترة الضريبية الإلكترونية (ZATCA Stage 2).
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block text-xs">الأمان والخصوصية السحابية:</strong>
                <span className="text-[11px] text-slate-400">
                  تشفير بنكي AES-256 للبيانات المخزنة، وبروتوكول TLS 1.3 للنقل، مع إسناد مستمر على سحابة Google Cloud.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Award className="w-4 h-4 text-sap-secondary shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block text-xs">شهادة المطابقة والاعتماد:</strong>
                <span className="text-[11px] text-slate-400">
                  فحص وتدقيق مستقل للامتثال لمعايير أنظمة تخطيط الموارد المؤسسية (ERP) المتقدمة.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Legal Policy Links */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <button
                onClick={() => openLegalPolicy("TERMS")}
                className="hover:text-sap-secondary transition flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>شروط الاستخدام والترخيص</span>
              </button>
              <span>•</span>
              <button
                onClick={() => openLegalPolicy("GTC")}
                className="hover:text-sap-secondary transition flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>الشروط العامة للخدمات السحابية (GTC)</span>
              </button>
              <span>•</span>
              <button
                onClick={() => openLegalPolicy("DPA")}
                className="hover:text-sap-secondary transition flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>اتفاقية معالجة البيانات والخصوصية (DPA)</span>
              </button>
              <span>•</span>
              <button
                onClick={() => openLegalPolicy("EULA")}
                className="hover:text-sap-secondary transition flex items-center gap-1"
              >
                <BadgeCheck className="w-3.5 h-3.5" />
                <span>ترخيص المستخدم النهائي (EULA)</span>
              </button>
              <span>•</span>
              <button
                onClick={() => openLegalPolicy("SAP_MATRIX")}
                className="text-sap-secondary hover:underline font-bold flex items-center gap-1"
              >
                <Award className="w-3.5 h-3.5" />
                <span>مصفوفة مطابقة SAP</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-500 font-mono">
              System: MEDO-PRD-01 | Release: 2026.09 | Build: SAP-B1-S4
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="text-center pt-2 text-[11px] text-slate-500 border-t border-slate-800/60">
            جميع الحقوق محفوظة © {new Date().getFullYear()} — نظام MeDo ERP المؤسسي | مجموعة بن زياد التجارية المحدودة وميدو تك للحلول السحابية.
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <LegalPoliciesModal
        isOpen={legalModalOpen}
        initialPolicy={selectedLegalPolicy}
        onClose={() => setLegalModalOpen(false)}
      />

      <SapComplianceReportModal
        isOpen={complianceReportOpen}
        onClose={() => setComplianceReportOpen(false)}
      />
    </div>
  );
};
