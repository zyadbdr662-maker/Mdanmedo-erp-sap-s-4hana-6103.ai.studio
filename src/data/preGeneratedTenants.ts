/**
 * MeDo ERP - 200 Multi-Tenant Master Enterprise Companies Directory
 * Pre-configured directory of 200 independent enterprise nodes
 * Distributed across Vercel & MeDo Cloud domains (company-1 to company-200)
 * 5 Dedicated Roles per company = 1000 Total Isolated Links
 */

export interface TenantRoleCredentials {
  token: string;
  email: string;
  password: string;
  roleNameAr: string;
  path: string;
  subLink: string;
}

export interface PreGeneratedTenant {
  index: number;
  id: string; // 'company-1' to 'company-200'
  slug: string;
  name: string; // 'شركة الأمل للتجارة والمقاولات'
  nameEn: string;
  companyNameAr: string; // Alias for backward compatibility
  companyNameEn: string;
  crNumber: string; // Commercial Registration
  commercialReg: string; // Alias
  taxNumber: string; // VAT Number
  phone: string;
  address: string;
  city: string;
  industry: string;
  logo: string;
  masterDomain: string;
  vercelUrl: string;
  status: "ACTIVE" | "TRIAL" | "EXPIRED" | "PAID_ENTERPRISE";
  trialDaysRemaining: number;
  operationsCount: number;
  maxTrialOperations: number; // 200
  assignedAdminName: string;
  assignedAdminPhone: string;
  assignedAdminEmail: string;
  databaseNode: "Alibaba Cloud" | "Huawei Cloud" | "PostgreSQL Local" | "Firebase" | "Qiniu Cloud";
  unlockCode: string;
  roles?: {
    MANAGER: TenantRoleCredentials;
    ACCOUNTANT: TenantRoleCredentials;
    CASHIER: TenantRoleCredentials;
    PURCHASER: TenantRoleCredentials;
    AUDITOR: TenantRoleCredentials;
  };
  employees: {
    id: string;
    name: string;
    roleAr: string;
    roleEn: "MANAGER" | "ACCOUNTANT" | "PURCHASER" | "SALES" | "AUDITOR" | "CASHIER";
    subLink: string;
    loginEmail: string;
    password: string;
  }[];
}

const companyNames = [
  "شركة الأمل للتجارة والمقاولات",
  "مؤسسة النور للإلكترونيات والتوريدات",
  "مجموعة الازدهار للاستيراد والتصدير",
  "شركة التقدم للخدمات اللوجستية",
  "رواد الخليج للصناعات التحويلية",
  "شركة البدر للأدوية والمستلزمات الطبية",
  "مؤسسة الفجر للطاقة المتجددة",
  "شركة الوفاق للمواد الغذائية والتموينية",
  "مجموعة الصرح للاستثمار والتطوير العقاري",
  "شركة التميز لتقنية المعلومات والحلول الذكية",
  "مؤسسة القمة للمعدات الثقيلة والآلات",
  "شركة المستقبل للأجهزة الكهربائية والمكيفات",
  "مجموعة الهلال للحديد والصلب",
  "شركة النخبة للسيارات وقطع الغيار",
  "مؤسسة الوسام للمفروشات والديكور الحديث",
  "شركة الأفق للملاحة والشحن الدولي",
  "مجموعة البركة للإنتاج الزراعي والحيواني",
  "شركة الإبداع للدعاية والتسويق الرقمي",
  "مؤسسة الريان لتنقية ومعالجة المياه",
  "شركة الشروق للمنسوجات والملابس الجاهزة",
  "مجموعة الاتحاد للبتروكيماويات والزيوت",
  "شركة الرواد للأخشاب وتصنيع الأثاث",
  "مؤسسة البشائر للأدوات الصحية والسباكة",
  "شركة النصر للألمنيوم والواجهات الزجاجية",
  "مجموعة الفرسان للأمن والسلامة المهنية",
  "شركة الدلتا للصناعات البلاستيكية والكرتون",
  "مؤسسة المجد للمقاولات العامة والإنشاءات",
  "شركة الواحة للتجارة العامة والتوكيلات",
  "مجموعة التضامن للصرافة والتحويلات المالية",
  "شركة المنار للصناعات الغذائية والتغليف",
  "مؤسسة دار الخبرة للاستشارات الإدارية والمالية",
  "شركة اليمامة لخدمات الطيران والسفر",
  "مجموعة الفردوس للمنتجعات السياحية والفنادق",
  "شركة الساحل للصيد البحري والأسماك",
  "مؤسسة ركاز للأحجار والرخام الطبيعي",
  "شركة طويق لحلول الاتصالات والشبكات",
  "مجموعة الروابي لمصانع الألبان والعصائر",
  "شركة الأطلس للمستودعات الجمركية والتخزين",
  "مؤسسة التاج للذهب والمجوهرات الثمينة",
  "شركة الشرق للمستلزمات المكتبية والقرطاسية",
];

const cities = ["صنعاء", "عدن", "الرياض", "جدة", "دبي", "الدمام", "تعز", "الحديدة", "المكلا", "أبوظبي", "الدوحة", "مسقط"];
const addresses = [
  "شارع حدة - مجمع النخبة التجاري",
  "شارع الزبيري - مقابل برج الأطباء",
  "شارع الستين الجنوبي - برج الأمل",
  "شارع الستين الغربي - بجوار سيتي ماكس",
  "شارع تعز - جولة 45",
  "شارع الدائري الغربي - مبنى التميز",
  "شارع التحلية - مركز التجارة والأعمال",
  "طريق الملك فهد - برج المروة",
  "شارع المطار - المنطقة الحرة",
  "شارع التسعين - مجمع النور",
  "شارع بغداد - عمارة الرواد",
  "شارع القيادة - مقابل البنك المركزي",
];

const industries = [
  "تجارة عامة واستيراد",
  "صناعة وتحويل",
  "مقاولات وإنشاءات",
  "أدوية ورعاية صحية",
  "أغذية ومشروبات",
  "تقنية واتصالات",
  "شحن ولوجستيات",
  "صرافة وخدمات مالية",
  "معدات وسيارات",
  "طاقة وبيئة",
];

export const VERCEL_PRODUCTION_BASE = "https://mdanmedo-erp-sap-s-4hana-6103-ai-st-iota.vercel.app";

/**
 * Manual VIP Enterprise Nodes (Added by request)
 */
export const MANUAL_VIP_TENANTS: PreGeneratedTenant[] = [
  {
    index: 0,
    id: 'alzarqa',
    slug: 'alzarqa',
    name: 'الشركة الزرقاء النبيلة (ش.م.ي)',
    nameEn: 'Al-Zarqa Al-Nabeela Company',
    companyNameAr: 'الشركة الزرقاء النبيلة (ش.م.ي)',
    companyNameEn: 'Al-Zarqa Al-Nabeela Company',
    crNumber: 'CR-AZ-99201',
    commercialReg: 'CR-AZ-99201',
    taxNumber: '300748291000003',
    phone: '+967 773 586 047',
    address: 'المنطقة الحرة - عدن، اليمن',
    city: 'عدن',
    industry: 'تجارة عامة واستيراد',
    logo: '/logos/alzarqa.png',
    masterDomain: `${VERCEL_PRODUCTION_BASE}/?tenant=alzarqa`,
    vercelUrl: `${VERCEL_PRODUCTION_BASE}/?tenant=alzarqa`,
    status: "PAID_ENTERPRISE",
    trialDaysRemaining: 365,
    operationsCount: 1200,
    maxTrialOperations: 200,
    assignedAdminName: 'أ. بدر عايض',
    assignedAdminPhone: '+967 773 586 047',
    assignedAdminEmail: 'manager@alzarqa.medo-erp.cloud',
    databaseNode: "PostgreSQL Local",
    unlockCode: "MEDO-AZ-VIP-2026",
    roles: {
      MANAGER: { token: 'AUTH_MGR_AZ', email: 'manager@alzarqa.medo-erp.cloud', password: '1234', roleNameAr: "المدير العام (MANAGER)", path: "/employee/manager", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=alzarqa&role=MANAGER&token=AUTH_MGR_AZ&path=/employee/manager` },
      ACCOUNTANT: { token: 'AUTH_ACC_AZ', email: 'accountant@alzarqa.medo-erp.cloud', password: '1234', roleNameAr: "كبير المحاسبين (ACCOUNTANT)", path: "/employee/accountant", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=alzarqa&role=ACCOUNTANT&token=AUTH_ACC_AZ&path=/employee/accountant` },
      CASHIER: { token: 'AUTH_SALES_AZ', email: 'sales@alzarqa.medo-erp.cloud', password: '1234', roleNameAr: "مسؤول المبيعات (CASHIER)", path: "/employee/sales", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=alzarqa&role=CASHIER&token=AUTH_SALES_AZ&path=/employee/sales` },
      PURCHASER: { token: 'AUTH_PUR_AZ', email: 'purchase@alzarqa.medo-erp.cloud', password: '1234', roleNameAr: "مسؤول المشتريات (PURCHASER)", path: "/employee/purchase", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=alzarqa&role=PURCHASER&token=AUTH_PUR_AZ&path=/employee/purchase` },
      AUDITOR: { token: 'AUTH_AUD_AZ', email: 'auditor@alzarqa.medo-erp.cloud', password: '1234', roleNameAr: "المراجع المالي (AUDITOR)", path: "/employee/auditor", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=alzarqa&role=AUDITOR&token=AUTH_AUD_AZ&path=/employee/auditor` },
    },
    employees: []
  },
  {
    index: 0,
    id: 'bin-ziad',
    slug: 'bin-ziad',
    name: 'مجموعة بن زياد التجارية المتحدة',
    nameEn: 'Bin Ziad United Commercial Group',
    companyNameAr: 'مجموعة بن زياد التجارية المتحدة',
    companyNameEn: 'Bin Ziad United Commercial Group',
    crNumber: '3892710',
    commercialReg: '3892710',
    taxNumber: '30074829100003',
    phone: '+967 773586047 | 715779976',
    address: 'الكندوي، حمر، عمران - اليمن',
    city: 'عمران',
    industry: 'مواد بناء ومواد زراعية',
    logo: '/logos/binziad.png',
    masterDomain: `${VERCEL_PRODUCTION_BASE}/?tenant=bin-ziad`,
    vercelUrl: `${VERCEL_PRODUCTION_BASE}/?tenant=bin-ziad`,
    status: "PAID_ENTERPRISE",
    trialDaysRemaining: 365,
    operationsCount: 1800,
    maxTrialOperations: 200,
    assignedAdminName: 'أ. علي بن زياد',
    assignedAdminPhone: '+967 773 586 047',
    assignedAdminEmail: 'manager@binziyad.medo-erp.cloud',
    databaseNode: "PostgreSQL Local",
    unlockCode: "MEDO-BZ-VIP-2026",
    roles: {
      MANAGER: { token: 'AUTH_MGR_BZ', email: 'manager@binziyad.medo-erp.cloud', password: '1234', roleNameAr: "المدير العام (MANAGER)", path: "/employee/manager", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=bin-ziad&role=MANAGER&token=AUTH_MGR_BZ&path=/employee/manager` },
      ACCOUNTANT: { token: 'AUTH_ACC_BZ', email: 'accountant@binziyad.medo-erp.cloud', password: '1234', roleNameAr: "كبير المحاسبين (ACCOUNTANT)", path: "/employee/accountant", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=bin-ziad&role=ACCOUNTANT&token=AUTH_ACC_BZ&path=/employee/accountant` },
      CASHIER: { token: 'AUTH_SALES_BZ', email: 'sales@binziyad.medo-erp.cloud', password: '1234', roleNameAr: "مسؤول المبيعات (CASHIER)", path: "/employee/sales", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=bin-ziad&role=CASHIER&token=AUTH_SALES_BZ&path=/employee/sales` },
      PURCHASER: { token: 'AUTH_PUR_BZ', email: 'purchase@binziyad.medo-erp.cloud', password: '1234', roleNameAr: "مسؤول المشتريات (PURCHASER)", path: "/employee/purchase", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=bin-ziad&role=PURCHASER&token=AUTH_PUR_BZ&path=/employee/purchase` },
      AUDITOR: { token: 'AUTH_AUD_BZ', email: 'auditor@binziyad.medo-erp.cloud', password: '1234', roleNameAr: "المراجع المالي (AUDITOR)", path: "/employee/auditor", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=bin-ziad&role=AUDITOR&token=AUTH_AUD_BZ&path=/employee/auditor` },
    },
    employees: []
  },
  {
    index: 0,
    id: 'binziyad',
    slug: 'binziyad',
    name: 'مجموعة بن زياد التجارية المتحدة',
    nameEn: 'Bin Ziad United Commercial Group',
    companyNameAr: 'مجموعة بن زياد التجارية المتحدة',
    companyNameEn: 'Bin Ziad United Commercial Group',
    crNumber: '3892710',
    commercialReg: '3892710',
    taxNumber: '30074829100003',
    phone: '+967 773586047 | 715779976',
    address: 'الكندوي، حمر، عمران - اليمن',
    city: 'عمران',
    industry: 'مواد بناء ومواد زراعية',
    logo: '/logos/binziad.png',
    masterDomain: `${VERCEL_PRODUCTION_BASE}/?tenant=binziyad`,
    vercelUrl: `${VERCEL_PRODUCTION_BASE}/?tenant=binziyad`,
    status: "PAID_ENTERPRISE",
    trialDaysRemaining: 365,
    operationsCount: 1800,
    maxTrialOperations: 200,
    assignedAdminName: 'أ. علي بن زياد',
    assignedAdminPhone: '+967 773 586 047',
    assignedAdminEmail: 'manager@binziyad.medo-erp.cloud',
    databaseNode: "PostgreSQL Local",
    unlockCode: "MEDO-BZ-VIP-2026",
    roles: {
      MANAGER: { token: 'AUTH_MGR_BZ', email: 'manager@binziyad.medo-erp.cloud', password: '1234', roleNameAr: "المدير العام (MANAGER)", path: "/employee/manager", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=binziyad&role=MANAGER&token=AUTH_MGR_BZ&path=/employee/manager` },
      ACCOUNTANT: { token: 'AUTH_ACC_BZ', email: 'accountant@binziyad.medo-erp.cloud', password: '1234', roleNameAr: "كبير المحاسبين (ACCOUNTANT)", path: "/employee/accountant", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=binziyad&role=ACCOUNTANT&token=AUTH_ACC_BZ&path=/employee/accountant` },
      CASHIER: { token: 'AUTH_SALES_BZ', email: 'sales@binziyad.medo-erp.cloud', password: '1234', roleNameAr: "مسؤول المبيعات (CASHIER)", path: "/employee/sales", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=binziyad&role=CASHIER&token=AUTH_SALES_BZ&path=/employee/sales` },
      PURCHASER: { token: 'AUTH_PUR_BZ', email: 'purchase@binziyad.medo-erp.cloud', password: '1234', roleNameAr: "مسؤول المشتريات (PURCHASER)", path: "/employee/purchase", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=binziyad&role=PURCHASER&token=AUTH_PUR_BZ&path=/employee/purchase` },
      AUDITOR: { token: 'AUTH_AUD_BZ', email: 'auditor@binziyad.medo-erp.cloud', password: '1234', roleNameAr: "المراجع المالي (AUDITOR)", path: "/employee/auditor", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=binziyad&role=AUDITOR&token=AUTH_AUD_BZ&path=/employee/auditor` },
    },
    employees: []
  },
  {
    index: 0,
    id: 'albadr-pharma-2026',
    slug: 'albadr-pharma-2026',
    name: 'شركة البدر للأدوية والمستلزمات الطبية',
    nameEn: 'Al-Badr Pharmaceuticals & Medical Supplies',
    companyNameAr: 'شركة البدر للأدوية والمستلزمات الطبية',
    companyNameEn: 'Al-Badr Pharmaceuticals & Medical Supplies',
    crNumber: '1029384',
    commercialReg: '1029384',
    taxNumber: '30009827400003',
    phone: '+967 1 445566 | 771234567',
    address: 'المركز الرئيسي - شارع حدة، صنعاء',
    city: 'صنعاء',
    industry: 'أدوية ومستلزمات طبية',
    logo: '/logos/albadr.png',
    masterDomain: `${VERCEL_PRODUCTION_BASE}/?tenant=albadr-pharma-2026`,
    vercelUrl: `${VERCEL_PRODUCTION_BASE}/?tenant=albadr-pharma-2026`,
    status: "PAID_ENTERPRISE",
    trialDaysRemaining: 365,
    operationsCount: 950,
    maxTrialOperations: 200,
    assignedAdminName: 'د. عبدالملك بدر',
    assignedAdminPhone: '+967 771 234 567',
    assignedAdminEmail: 'manager@albadr.medo-erp.cloud',
    databaseNode: "PostgreSQL Local",
    unlockCode: "MEDO-BADR-VIP-2026",
    roles: {
      MANAGER: { token: 'AUTH_MGR_BADR', email: 'manager@albadr.medo-erp.cloud', password: '1234', roleNameAr: "المدير العام (MANAGER)", path: "/employee/manager", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=albadr-pharma-2026&role=MANAGER&token=AUTH_MGR_BADR&path=/employee/manager` },
      ACCOUNTANT: { token: 'AUTH_ACC_BADR', email: 'accountant@albadr.medo-erp.cloud', password: '1234', roleNameAr: "كبير المحاسبين (ACCOUNTANT)", path: "/employee/accountant", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=albadr-pharma-2026&role=ACCOUNTANT&token=AUTH_ACC_BADR&path=/employee/accountant` },
      CASHIER: { token: 'AUTH_SALES_BADR', email: 'sales@albadr.medo-erp.cloud', password: '1234', roleNameAr: "مسؤول المبيعات (CASHIER)", path: "/employee/sales", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=albadr-pharma-2026&role=CASHIER&token=AUTH_SALES_BADR&path=/employee/sales` },
      PURCHASER: { token: 'AUTH_PUR_BADR', email: 'purchase@albadr.medo-erp.cloud', password: '1234', roleNameAr: "مسؤول المشتريات (PURCHASER)", path: "/employee/purchase", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=albadr-pharma-2026&role=PURCHASER&token=AUTH_PUR_BADR&path=/employee/purchase` },
      AUDITOR: { token: 'AUTH_AUD_BADR', email: 'auditor@albadr.medo-erp.cloud', password: '1234', roleNameAr: "المراجع المالي (AUDITOR)", path: "/employee/auditor", subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=albadr-pharma-2026&role=AUDITOR&token=AUTH_AUD_BADR&path=/employee/auditor` },
    },
    employees: []
  }
];

const dbNodes: ("Alibaba Cloud" | "Huawei Cloud" | "PostgreSQL Local" | "Firebase" | "Qiniu Cloud")[] = [
  "Alibaba Cloud",
  "Huawei Cloud",
  "Firebase",
  "PostgreSQL Local",
  "Qiniu Cloud",
];

// Generate exact 200 distinct enterprise nodes with full 5-role credentials
export const PRE_GENERATED_200_TENANTS: PreGeneratedTenant[] = Array.from({ length: 200 }, (_, i) => {
  const num = i + 1;
  const nameBase = companyNames[(num - 1) % companyNames.length];
  const companyNameAr = num <= companyNames.length ? nameBase : `${nameBase} (الفرع ${Math.floor((num - 1) / companyNames.length) + 1})`;
  const slug = `company-${num}`;
  const id = slug;
  const city = cities[(num * 3) % cities.length];
  const address = `${city} - ${addresses[(num * 5) % addresses.length]}`;
  const industry = industries[(num * 2) % industries.length];
  const cr = `1010${(500000 + num * 37).toString().substring(0, 6)}`;
  const vat = `300${(748291000 + num * 91).toString().substring(0, 9)}00003`;
  const phone = `777${(111000 + num * 23).toString().substring(0, 6)}`;
  
  const isPaid = num % 4 === 0; // 50 paid, 150 trial
  const status: "ACTIVE" | "TRIAL" | "EXPIRED" | "PAID_ENTERPRISE" = isPaid ? "PAID_ENTERPRISE" : "TRIAL";
  const opsCount = isPaid ? Math.floor(Math.random() * 4500) + 500 : Math.floor(Math.random() * 185) + 1;
  const trialDaysRemaining = isPaid ? 365 : Math.max(1, 30 - Math.floor(opsCount / 7));
  const databaseNode = dbNodes[num % dbNodes.length];

  const unlockCode = `MEDO-UNLOCK-2026-C${num.toString().padStart(3, "0")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const masterDomain = `${VERCEL_PRODUCTION_BASE}/?tenant=${slug}`;
  const vercelUrl = masterDomain;

  const roles = {
    MANAGER: {
      token: `AUTH_MGR_${num}`,
      email: `manager@${slug}.medo-erp.cloud`,
      password: "1234",
      roleNameAr: "مدير عام المنشأة (MANAGER)",
      path: "/employee/manager",
      subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=${slug}&role=MANAGER&token=AUTH_MGR_${num}&path=/employee/manager`,
    },
    ACCOUNTANT: {
      token: `AUTH_ACC_${num}`,
      email: `accountant@${slug}.medo-erp.cloud`,
      password: "1234",
      roleNameAr: "كبير المحاسبين (ACCOUNTANT)",
      path: "/employee/accountant",
      subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=${slug}&role=ACCOUNTANT&token=AUTH_ACC_${num}&path=/employee/accountant`,
    },
    CASHIER: {
      token: `AUTH_SALES_${num}`,
      email: `sales@${slug}.medo-erp.cloud`,
      password: "1234",
      roleNameAr: "مسؤول المبيعات ونقاط البيع (CASHIER)",
      path: "/employee/sales",
      subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=${slug}&role=CASHIER&token=AUTH_SALES_${num}&path=/employee/sales`,
    },
    PURCHASER: {
      token: `AUTH_PUR_${num}`,
      email: `purchase@${slug}.medo-erp.cloud`,
      password: "1234",
      roleNameAr: "مسؤول المشتريات والتوريد (PURCHASER)",
      path: "/employee/purchase",
      subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=${slug}&role=PURCHASER&token=AUTH_PUR_${num}&path=/employee/purchase`,
    },
    AUDITOR: {
      token: `AUTH_AUD_${num}`,
      email: `auditor@${slug}.medo-erp.cloud`,
      password: "1234",
      roleNameAr: "مدقق ومراجع الحسابات (AUDITOR)",
      path: "/employee/auditor",
      subLink: `${VERCEL_PRODUCTION_BASE}/?tenant=${slug}&role=AUDITOR&token=AUTH_AUD_${num}&path=/employee/auditor`,
    },
  };

  const employees = [
    {
      id: `emp-${num}-1`,
      name: `أ. محمد العتيبي (المدير العام)`,
      roleAr: "مدير عام المنشأة",
      roleEn: "MANAGER" as const,
      subLink: roles.MANAGER.subLink,
      loginEmail: roles.MANAGER.email,
      password: roles.MANAGER.password,
    },
    {
      id: `emp-${num}-2`,
      name: `أ. أحمد باوزير (كبير المحاسبين)`,
      roleAr: "محاسب عام رئيسي",
      roleEn: "ACCOUNTANT" as const,
      subLink: roles.ACCOUNTANT.subLink,
      loginEmail: roles.ACCOUNTANT.email,
      password: roles.ACCOUNTANT.password,
    },
    {
      id: `emp-${num}-3`,
      name: `أ. خالد اليافعي (مدير المشتريات)`,
      roleAr: "مسؤول مشتريات وتوريد",
      roleEn: "PURCHASER" as const,
      subLink: roles.PURCHASER.subLink,
      loginEmail: roles.PURCHASER.email,
      password: roles.PURCHASER.password,
    },
    {
      id: `emp-${num}-4`,
      name: `أ. محمود صالح يحيى عايض (مسؤول المبيعات ونقاط البيع)`,
      roleAr: "كاشير ونقاط البيع POS",
      roleEn: "SALES" as const,
      subLink: roles.CASHIER.subLink,
      loginEmail: roles.CASHIER.email,
      password: roles.CASHIER.password,
    },
    {
      id: `emp-${num}-5`,
      name: `د. سامي القحطاني (المراجع المالي)`,
      roleAr: "مدقق ومراجع حسابات خارجي",
      roleEn: "AUDITOR" as const,
      subLink: roles.AUDITOR.subLink,
      loginEmail: roles.AUDITOR.email,
      password: roles.AUDITOR.password,
    },
  ];

  return {
    index: num,
    id,
    slug,
    name: companyNameAr,
    nameEn: `Enterprise Node #${num} (${slug})`,
    companyNameAr,
    companyNameEn: `Enterprise Node #${num} (${slug})`,
    crNumber: cr,
    commercialReg: cr,
    taxNumber: vat,
    phone,
    address,
    city,
    industry,
    logo: `/logos/${slug}.png`,
    masterDomain,
    vercelUrl,
    status,
    trialDaysRemaining,
    operationsCount: opsCount,
    maxTrialOperations: 200,
    assignedAdminName: `مسؤول الحساب - المنشأة ${num}`,
    assignedAdminPhone: phone,
    assignedAdminEmail: roles.MANAGER.email,
    databaseNode,
    unlockCode,
    roles,
    employees,
  };
});

// Alias export for standard naming
export const preGeneratedTenants = [...MANUAL_VIP_TENANTS, ...PRE_GENERATED_200_TENANTS];

const TENANTS_STORAGE_KEY = "medo_erp_200_tenants_v3";

/**
 * Retrieves stored 200 tenants from localStorage or defaults to generated list
 */
export function getStored200Tenants(): PreGeneratedTenant[] {
  if (typeof window === "undefined") return PRE_GENERATED_200_TENANTS;
  try {
    const raw = localStorage.getItem(TENANTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 200) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load stored tenants", e);
  }
  return PRE_GENERATED_200_TENANTS;
}

/**
 * Saves updated 200 tenants list to localStorage
 */
export function saveStored200Tenants(tenants: PreGeneratedTenant[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
  } catch (e) {
    console.error("Failed to save tenants", e);
  }
}

/**
 * Robust tenant lookup by ID, slug, index or standard aliases
 */
export function findTenantById(tenantIdentifier: string | null | undefined): PreGeneratedTenant | null {
  if (!tenantIdentifier) return null;
  const clean = tenantIdentifier.toLowerCase().trim();

  // Check in-memory preGeneratedTenants first
  const allTenants = preGeneratedTenants;

  // Exact ID / Slug match
  let found = allTenants.find((t) => t.id.toLowerCase() === clean || t.slug.toLowerCase() === clean);
  if (found) return found;

  // Check aliases
  if (clean === "alzarqa" || clean === "zarqa" || clean === "az") {
    return allTenants.find((t) => t.id === "alzarqa") || null;
  }
  if (clean === "bin-ziad" || clean === "binziyad" || clean === "binziad" || clean === "bz") {
    return allTenants.find((t) => t.id === "bin-ziad" || t.id === "binziyad") || null;
  }
  if (clean === "albadr" || clean === "albadr-pharma-2026" || clean === "badr" || clean === "client-albadr") {
    return allTenants.find((t) => t.id === "albadr-pharma-2026") || null;
  }
  if (clean === "company-1" || clean === "client-1" || clean === "alamal" || clean === "al-amal" || clean === "amal") {
    return allTenants.find((t) => t.id === "company-1") || null;
  }
  if (clean === "company-2" || clean === "client-2" || clean === "alnoor" || clean === "al-noor") {
    return allTenants.find((t) => t.id === "company-2") || null;
  }
  if (clean === "company-3" || clean === "client-3" || clean === "alqimma" || clean === "al-qimma") {
    return allTenants.find((t) => t.id === "company-3") || null;
  }

  // Check numerical pattern e.g. "1" -> "company-1"
  if (/^\d+$/.test(clean)) {
    const num = parseInt(clean, 10);
    found = allTenants.find((t) => t.index === num || t.id === `company-${num}`);
    if (found) return found;
  }

  // Check "company_X" or "companyX"
  const match = clean.match(/^company[_-]?(\d+)$/);
  if (match) {
    const num = parseInt(match[1], 10);
    found = allTenants.find((t) => t.index === num || t.id === `company-${num}`);
    if (found) return found;
  }

  return null;
}

