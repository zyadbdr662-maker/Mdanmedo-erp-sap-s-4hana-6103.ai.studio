/**
 * MeDo ERP - 200 Multi-Tenant Master Trial Companies Directory
 * Pre-configured directory of 200 independent enterprise trial nodes
 * Distributed across Vercel & MeDo Cloud domains (company-1 to company-200)
 */

export interface PreGeneratedTenant {
  index: number;
  id: string;
  slug: string;
  companyNameAr: string;
  companyNameEn: string;
  commercialReg: string;
  taxNumber: string;
  industry: string;
  city: string;
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
  employees: {
    id: string;
    name: string;
    roleAr: string;
    roleEn: "MANAGER" | "ACCOUNTANT" | "PURCHASER" | "SALES" | "AUDITOR";
    subLink: string;
    loginEmail?: string;
    password?: string;
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
const industries = ["تجارة عامة واستيراد", "صناعة وتحويل", "مقاولات وإنشاءات", "أدوية ورعاية صحية", "أغذية ومشروبات", "تقنية واتصالات", "شحن ولوجستيات", "صرافة وخدمات مالية"];
const dbNodes: ("Alibaba Cloud" | "Huawei Cloud" | "PostgreSQL Local" | "Firebase" | "Qiniu Cloud")[] = [
  "Alibaba Cloud",
  "Huawei Cloud",
  "Firebase",
  "PostgreSQL Local",
  "Qiniu Cloud",
];

// Generate exact 200 distinct enterprise nodes
export const PRE_GENERATED_200_TENANTS: PreGeneratedTenant[] = Array.from({ length: 200 }, (_, i) => {
  const num = i + 1;
  const nameBase = companyNames[(num - 1) % companyNames.length];
  const companyNameAr = num <= companyNames.length ? nameBase : `${nameBase} - الفرع (${Math.floor((num - 1) / companyNames.length) + 1})`;
  const slug = `company-${num}`;
  const city = cities[(num * 3) % cities.length];
  const industry = industries[(num * 2) % industries.length];
  const cr = `CR-1010${(500000 + num * 37).toString().substring(0, 6)}`;
  const vat = `300${(748291000 + num * 91).toString().substring(0, 9)}00003`;
  
  const isPaid = num % 4 === 0; // 50 paid, 150 trial
  const status = isPaid ? "PAID_ENTERPRISE" : "TRIAL";
  const opsCount = isPaid ? Math.floor(Math.random() * 4500) + 500 : Math.floor(Math.random() * 185) + 1;
  const trialDaysRemaining = isPaid ? 365 : Math.max(1, 30 - Math.floor(opsCount / 7));
  const databaseNode = dbNodes[num % dbNodes.length];

  const unlockCode = `MEDO-UNLOCK-2026-C${num.toString().padStart(3, "0")}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const vercelBase = "https://mdanmedo-erp-sap-s-4hana-6103-ai-st-iota.vercel.app";
  const masterDomain = `${vercelBase}/?tenant=${slug}`;
  const vercelUrl = masterDomain;

  const employees = [
    {
      id: `emp-${num}-1`,
      name: `أ. محمد العتيبي (المدير التنفيذي)`,
      roleAr: "مدير عام المنشأة",
      roleEn: "MANAGER" as const,
      subLink: `${vercelBase}/?tenant=${slug}&role=MANAGER&token=AUTH_MGR_${num}&path=/employee/manager`,
      loginEmail: `manager@${slug}.medo-erp.cloud`,
      password: "1234",
    },
    {
      id: `emp-${num}-2`,
      name: `أ. أحمد باوزير (كبير المحاسبين)`,
      roleAr: "محاسب عام رئيسي",
      roleEn: "ACCOUNTANT" as const,
      subLink: `${vercelBase}/?tenant=${slug}&role=ACCOUNTANT&token=AUTH_ACC_${num}&path=/employee/accountant`,
      loginEmail: `accountant@${slug}.medo-erp.cloud`,
      password: "1234",
    },
    {
      id: `emp-${num}-3`,
      name: `أ. خالد اليافعي (مدير المشتريات)`,
      roleAr: "مسؤول مشتريات ومخازن",
      roleEn: "PURCHASER" as const,
      subLink: `${vercelBase}/?tenant=${slug}&role=PURCHASER&token=AUTH_PUR_${num}&path=/employee/purchaser`,
      loginEmail: `purchaser@${slug}.medo-erp.cloud`,
      password: "1234",
    },
    {
      id: `emp-${num}-4`,
      name: `أ. طارق الشميري (مسؤول المبيعات)`,
      roleAr: "كاشير ومبيعات نقاط البيع",
      roleEn: "SALES" as const,
      subLink: `${vercelBase}/?tenant=${slug}&role=SALES&token=AUTH_SALES_${num.toString().padStart(4, "0")}&path=/employee/sales`,
      loginEmail: `sales@${slug}.medo-erp.cloud`,
      password: "1234",
    },
    {
      id: `emp-${num}-5`,
      name: `د. سامي القحطاني (المراجع المالي)`,
      roleAr: "مدقق ومراجع حسابات خارجي",
      roleEn: "AUDITOR" as const,
      subLink: `${vercelBase}/?tenant=${slug}&role=AUDITOR&token=AUTH_AUD_${num}&path=/employee/auditor`,
      loginEmail: `auditor@${slug}.medo-erp.cloud`,
      password: "1234",
    },
  ];

  return {
    index: num,
    id: `tenant-${slug}`,
    slug,
    companyNameAr,
    companyNameEn: `Enterprise Node #${num} (${slug})`,
    commercialReg: cr,
    taxNumber: vat,
    industry,
    city,
    masterDomain,
    vercelUrl,
    status,
    trialDaysRemaining,
    operationsCount: opsCount,
    maxTrialOperations: 200,
    assignedAdminName: `مسؤول الحساب - المنشأة ${num}`,
    assignedAdminPhone: `+967 773 586 047`,
    assignedAdminEmail: `admin@${slug}.medo-erp.cloud`,
    databaseNode,
    unlockCode,
    employees,
  };
});

const TENANTS_STORAGE_KEY = "medo_erp_200_tenants_v2";

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
