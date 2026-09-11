import {
  Account,
  Branch,
  CurrencyCode,
  CurrencyInfo,
  Customer,
  FixedAsset,
  Invoice,
  JournalEntry,
  JournalLine,
  Vendor,
  Voucher,
  BankAccountItem,
  CashVaultItem,
  CostCenter,
  ERPUser,
  SystemSettings,
  InventoryItem,
  StockMovement,
  UnavailableItemRequest,
  ERPRole,
  HREmployee,
  HRAdministrativeDecision,
  HRAttendanceRecord,
  HRWorkingShift,
  HRMonthlyPayroll,
  CorrespondenceDocument,
  ApprovalRequest,
  AuditLogEntry,
  SystemAlert,
  ChatChannel,
  ChatMessage,
  AdministrativeCircular,
  WorkflowRouteRule,
  ExchangeAccount,
  ExchangeTransaction,
  SaaSClient,
} from "../types/erp";
import {
  INITIAL_ACCOUNTS,
  INITIAL_BRANCHES,
  INITIAL_BANK_ACCOUNTS,
  INITIAL_CASH_VAULTS,
  INITIAL_COST_CENTERS,
  INITIAL_CURRENCIES,
  INITIAL_CUSTOMERS,
  INITIAL_FIXED_ASSETS,
  INITIAL_INVOICES,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_USERS,
  INITIAL_VENDORS,
  INITIAL_VOUCHERS,
  INITIAL_INVENTORY_ITEMS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_UNAVAILABLE_REQUESTS,
  INITIAL_ROLES,
  INITIAL_HR_EMPLOYEES,
  INITIAL_HR_DECISIONS,
  INITIAL_HR_SHIFTS,
  INITIAL_HR_ATTENDANCE,
  INITIAL_HR_PAYROLLS,
  INITIAL_CORRESPONDENCES,
  INITIAL_APPROVAL_REQUESTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_SYSTEM_ALERTS,
  INITIAL_CHAT_CHANNELS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_ADMINISTRATIVE_CIRCULARS,
  INITIAL_WORKFLOW_RULES,
  INITIAL_EXCHANGE_ACCOUNTS,
  INITIAL_EXCHANGE_TRANSACTIONS,
  INITIAL_SAAS_CLIENTS,
} from "../data/initialERPData";

export const DEFAULT_SYSTEM_SETTINGS: SystemSettings = {
  companyNameAr: "مجموعة مـيـدو التجارية والمالية الذكية (ش.م.ي)",
  companyNameEn: "MeDo Smart Enterprise & Financial Group Inc.",
  taxNumber: "30049281040003",
  commercialRegister: "1010-948271",
  phone: "+967 770 000 000",
  address: "صنعاء / عدن - الجمهورية اليمنية",
  email: "finance@medo-group.ye",
  baseCurrency: "YER_SANAA",
  defaultBranchId: "BR-SANAA-MAIN",
  fiscalYearStart: "2026-01-01",
  fiscalYearEnd: "2026-12-31",
  closingDate: "",
  preventUnbalancedJournals: true,
  autoPostApprovedVouchers: true,
  requireCostCenterForExpenses: true,
  allowNegativeCash: false,
  aiModel: "gemini-3.7-flash",
  aiAutoValidation: true,
  licenseType: "LIFETIME",
  licenseDuration: "مدى الحياة (ترخيص دائم غير محدود)",
  licenseStatus: "ACTIVE_LIFETIME",
  licenseExpiryDate: "2099-12-31",
  scheduledBackup: {
    enabled: true,
    frequency: "EVERY_12_HOURS",
    scheduledTime: "02:00",
    autoEncrypt: true,
    encryptionKey: "MeDo-SAP-EncKey-9F2kL8xA3p",
    uploadToCloud: true,
    cloudStoragePath: "cloud_backups",
    keepMaxBackups: 10,
    lastBackupAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    nextScheduledAt: new Date(Date.now() + 3600000 * 8).toISOString(),
    lastBackupStatus: "SUCCESS",
    lastBackupMessage: "تم الرفع التلقائي المشفر بنجاح إلى سحابة Firestore",
  },
};

const STORAGE_KEYS = {
  BRANCHES: "medo_erp_branches_v1",
  ACTIVE_BRANCH_ID: "medo_erp_active_branch_id_v1",
  ACCOUNTS: "medo_erp_accounts_v1",
  JOURNAL_ENTRIES: "medo_erp_journal_entries_v1",
  VOUCHERS: "medo_erp_vouchers_v1",
  CUSTOMERS: "medo_erp_customers_v1",
  VENDORS: "medo_erp_vendors_v1",
  INVOICES: "medo_erp_invoices_v1",
  FIXED_ASSETS: "medo_erp_fixed_assets_v1",
  BANK_ACCOUNTS: "medo_erp_banks_v1",
  CASH_VAULTS: "medo_erp_vaults_v1",
  COST_CENTERS: "medo_erp_cost_centers_v1",
  CURRENCIES: "medo_erp_currencies_v1",
  CURRENT_USER: "medo_erp_current_user_v1",
  SELECTED_CURRENCY: "medo_erp_selected_currency_v1",
  SYSTEM_SETTINGS: "medo_erp_system_settings_v1",
  INVENTORY_ITEMS: "medo_erp_inventory_items_v1",
  STOCK_MOVEMENTS: "medo_erp_stock_movements_v1",
  UNAVAILABLE_REQUESTS: "medo_erp_unavailable_requests_v1",
  ROLES: "medo_erp_roles_v1",
  USERS_LIST: "medo_erp_users_list_v1",
  HR_EMPLOYEES: "medo_erp_hr_employees_v1",
  HR_DECISIONS: "medo_erp_hr_decisions_v1",
  HR_ATTENDANCE: "medo_erp_hr_attendance_v1",
  HR_SHIFTS: "medo_erp_hr_shifts_v1",
  HR_PAYROLLS: "medo_erp_hr_payrolls_v1",
  CORRESPONDENCES: "medo_erp_correspondences_v1",
  APPROVAL_REQUESTS: "medo_erp_approval_requests_v1",
  AUDIT_LOGS: "medo_erp_audit_logs_v1",
  SYSTEM_ALERTS: "medo_erp_system_alerts_v1",
  CHAT_CHANNELS: "medo_erp_chat_channels_v1",
  CHAT_MESSAGES: "medo_erp_chat_messages_v1",
  CIRCULARS: "medo_erp_circulars_v1",
  WORKFLOW_RULES: "medo_erp_workflow_rules_v1",
  EXCHANGE_ACCOUNTS: "medo_erp_exchange_accounts_v1",
  EXCHANGE_TRANSACTIONS: "medo_erp_exchange_transactions_v1",
  SAAS_CLIENTS: "medo_erp_saas_clients_v1",
};

export interface ERPFullState {
  branches?: Branch[];
  activeBranchId?: string;
  accounts: Account[];
  journalEntries: JournalEntry[];
  vouchers: Voucher[];
  customers: Customer[];
  vendors: Vendor[];
  invoices: Invoice[];
  bills?: Invoice[];
  fixedAssets: FixedAsset[];
  bankAccounts: BankAccountItem[];
  cashVaults: CashVaultItem[];
  costCenters: CostCenter[];
  currencies: CurrencyInfo[];
  currentUser: ERPUser;
  selectedDisplayCurrency?: CurrencyCode;
  systemSettings?: SystemSettings;
  inventoryItems?: InventoryItem[];
  stockMovements?: StockMovement[];
  unavailableRequests?: UnavailableItemRequest[];
  roles?: ERPRole[];
  usersList?: ERPUser[];
  hrEmployees?: HREmployee[];
  hrDecisions?: HRAdministrativeDecision[];
  hrAttendanceRecords?: HRAttendanceRecord[];
  hrShifts?: HRWorkingShift[];
  hrPayrolls?: HRMonthlyPayroll[];
  correspondences?: CorrespondenceDocument[];
  approvalRequests?: ApprovalRequest[];
  workflowRules?: WorkflowRouteRule[];
  auditLogs?: AuditLogEntry[];
  systemAlerts?: SystemAlert[];
  chatChannels?: ChatChannel[];
  chatMessages?: ChatMessage[];
  administrativeCirculars?: AdministrativeCircular[];
  exchangeAccounts?: ExchangeAccount[];
  exchangeTransactions?: ExchangeTransaction[];
  saasClients?: SaaSClient[];
}

export function loadERPState(): ERPFullState {
  try {
    const rawBranches = localStorage.getItem(STORAGE_KEYS.BRANCHES);
    const branches: Branch[] = rawBranches ? JSON.parse(rawBranches) : INITIAL_BRANCHES;
    const activeBranchId = localStorage.getItem(STORAGE_KEYS.ACTIVE_BRANCH_ID) || "ALL";

    const rawAccounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    const accounts: Account[] = rawAccounts ? JSON.parse(rawAccounts) : INITIAL_ACCOUNTS;

    const rawJournals = localStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    const journalEntries: JournalEntry[] = rawJournals ? JSON.parse(rawJournals) : INITIAL_JOURNAL_ENTRIES;

    const rawVouchers = localStorage.getItem(STORAGE_KEYS.VOUCHERS);
    const vouchers: Voucher[] = rawVouchers ? JSON.parse(rawVouchers) : INITIAL_VOUCHERS;

    const rawCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    const customers: Customer[] = rawCustomers ? JSON.parse(rawCustomers) : INITIAL_CUSTOMERS;

    const rawVendors = localStorage.getItem(STORAGE_KEYS.VENDORS);
    const vendors: Vendor[] = rawVendors ? JSON.parse(rawVendors) : INITIAL_VENDORS;

    const rawInvoices = localStorage.getItem(STORAGE_KEYS.INVOICES);
    let invoices: Invoice[] = rawInvoices ? JSON.parse(rawInvoices) : INITIAL_INVOICES;
    
    // Ensure initial purchase bills exist if missing in current state
    if (localStorage.getItem("medo_load_sample_data_flag") !== "false") {
      const hasPurchaseInvoices = invoices.some((i) => i.type === "PURCHASE" || i.type === "PURCHASE_RETURN");
      if (!hasPurchaseInvoices) {
        const initialPurchases = INITIAL_INVOICES.filter((i) => i.type === "PURCHASE" || i.type === "PURCHASE_RETURN");
        invoices = [...invoices, ...initialPurchases];
      }
    }
    const bills = invoices.filter((i) => i.type === "PURCHASE" || i.type === "PURCHASE_RETURN");

    const rawAssets = localStorage.getItem(STORAGE_KEYS.FIXED_ASSETS);
    const fixedAssets: FixedAsset[] = rawAssets ? JSON.parse(rawAssets) : INITIAL_FIXED_ASSETS;

    const rawBanks = localStorage.getItem(STORAGE_KEYS.BANK_ACCOUNTS);
    const bankAccounts: BankAccountItem[] = rawBanks ? JSON.parse(rawBanks) : INITIAL_BANK_ACCOUNTS;

    const rawVaults = localStorage.getItem(STORAGE_KEYS.CASH_VAULTS);
    const cashVaults: CashVaultItem[] = rawVaults ? JSON.parse(rawVaults) : INITIAL_CASH_VAULTS;

    const rawCostCenters = localStorage.getItem(STORAGE_KEYS.COST_CENTERS);
    const costCenters: CostCenter[] = rawCostCenters ? JSON.parse(rawCostCenters) : INITIAL_COST_CENTERS;

    const rawCurrencies = localStorage.getItem(STORAGE_KEYS.CURRENCIES);
    const currencies: CurrencyInfo[] = rawCurrencies ? JSON.parse(rawCurrencies) : INITIAL_CURRENCIES;

    const rawUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    const currentUser: ERPUser = rawUser ? JSON.parse(rawUser) : INITIAL_USERS[0];

    const rawSelectedCurrency = localStorage.getItem(STORAGE_KEYS.SELECTED_CURRENCY) as CurrencyCode;
    const selectedDisplayCurrency: CurrencyCode = rawSelectedCurrency || "YER_SANAA";

    const rawSettings = localStorage.getItem(STORAGE_KEYS.SYSTEM_SETTINGS);
    const parsedSettings = rawSettings ? JSON.parse(rawSettings) : {};
    const systemSettings: SystemSettings = {
      ...DEFAULT_SYSTEM_SETTINGS,
      ...parsedSettings,
      scheduledBackup: {
        ...DEFAULT_SYSTEM_SETTINGS.scheduledBackup,
        ...(parsedSettings.scheduledBackup || {}),
        enabled: parsedSettings.scheduledBackup?.enabled !== false, // Always active
      },
    };

    const rawInventory = localStorage.getItem(STORAGE_KEYS.INVENTORY_ITEMS);
    let inventoryItems: InventoryItem[] = rawInventory ? JSON.parse(rawInventory) : INITIAL_INVENTORY_ITEMS;
    
    // Auto-inject Tobacco & Moassel if missing (bypasses stale localStorage cache)
    // Only if not explicitly a clean SaaS tenant
    if (localStorage.getItem("medo_load_sample_data_flag") !== "false") {
      const hasTobacco = inventoryItems.some(
        (item) => item.category === "التبغ والمعسل" || item.code.startsWith("INV-TOB-")
      );
      if (!hasTobacco) {
        const tobaccoItems = INITIAL_INVENTORY_ITEMS.filter(
          (item) => item.category === "التبغ والمعسل" || item.code.startsWith("INV-TOB-")
        );
        if (tobaccoItems.length > 0) {
          inventoryItems = [...inventoryItems, ...tobaccoItems];
          localStorage.setItem(STORAGE_KEYS.INVENTORY_ITEMS, JSON.stringify(inventoryItems));
        }
      }
    }

    const rawMovements = localStorage.getItem(STORAGE_KEYS.STOCK_MOVEMENTS);
    const stockMovements: StockMovement[] = rawMovements ? JSON.parse(rawMovements) : INITIAL_STOCK_MOVEMENTS;

    const rawRequests = localStorage.getItem(STORAGE_KEYS.UNAVAILABLE_REQUESTS);
    const unavailableRequests: UnavailableItemRequest[] = rawRequests ? JSON.parse(rawRequests) : INITIAL_UNAVAILABLE_REQUESTS;

    const rawRoles = localStorage.getItem(STORAGE_KEYS.ROLES);
    const roles: ERPRole[] = rawRoles ? JSON.parse(rawRoles) : INITIAL_ROLES;

    const rawUsersList = localStorage.getItem(STORAGE_KEYS.USERS_LIST);
    const usersList: ERPUser[] = rawUsersList ? JSON.parse(rawUsersList) : INITIAL_USERS;

    const rawEmployees = localStorage.getItem(STORAGE_KEYS.HR_EMPLOYEES);
    const hrEmployees: HREmployee[] = rawEmployees ? JSON.parse(rawEmployees) : INITIAL_HR_EMPLOYEES;

    const rawDecisions = localStorage.getItem(STORAGE_KEYS.HR_DECISIONS);
    const hrDecisions: HRAdministrativeDecision[] = rawDecisions ? JSON.parse(rawDecisions) : INITIAL_HR_DECISIONS;

    const rawAttendance = localStorage.getItem(STORAGE_KEYS.HR_ATTENDANCE);
    const hrAttendanceRecords: HRAttendanceRecord[] = rawAttendance ? JSON.parse(rawAttendance) : INITIAL_HR_ATTENDANCE;

    const rawShifts = localStorage.getItem(STORAGE_KEYS.HR_SHIFTS);
    const hrShifts: HRWorkingShift[] = rawShifts ? JSON.parse(rawShifts) : INITIAL_HR_SHIFTS;

    const rawPayrolls = localStorage.getItem(STORAGE_KEYS.HR_PAYROLLS);
    const hrPayrolls: HRMonthlyPayroll[] = rawPayrolls ? JSON.parse(rawPayrolls) : INITIAL_HR_PAYROLLS;

    const rawCorr = localStorage.getItem(STORAGE_KEYS.CORRESPONDENCES);
    const correspondences: CorrespondenceDocument[] = rawCorr ? JSON.parse(rawCorr) : INITIAL_CORRESPONDENCES;

    const rawApr = localStorage.getItem(STORAGE_KEYS.APPROVAL_REQUESTS);
    const approvalRequests: ApprovalRequest[] = rawApr ? JSON.parse(rawApr) : INITIAL_APPROVAL_REQUESTS;

    const rawAudit = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    const auditLogs: AuditLogEntry[] = rawAudit ? JSON.parse(rawAudit) : INITIAL_AUDIT_LOGS;

    const rawAlerts = localStorage.getItem(STORAGE_KEYS.SYSTEM_ALERTS);
    const systemAlerts: SystemAlert[] = rawAlerts ? JSON.parse(rawAlerts) : INITIAL_SYSTEM_ALERTS;

    const rawChannels = localStorage.getItem(STORAGE_KEYS.CHAT_CHANNELS);
    const chatChannels: ChatChannel[] = rawChannels ? JSON.parse(rawChannels) : INITIAL_CHAT_CHANNELS;

    const rawMessages = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    const chatMessages: ChatMessage[] = rawMessages ? JSON.parse(rawMessages) : INITIAL_CHAT_MESSAGES;

    const rawCirc = localStorage.getItem(STORAGE_KEYS.CIRCULARS);
    const administrativeCirculars: AdministrativeCircular[] = rawCirc ? JSON.parse(rawCirc) : INITIAL_ADMINISTRATIVE_CIRCULARS;

    const rawWfRules = localStorage.getItem(STORAGE_KEYS.WORKFLOW_RULES);
    const workflowRules: WorkflowRouteRule[] = rawWfRules ? JSON.parse(rawWfRules) : INITIAL_WORKFLOW_RULES;

    const rawExchangeAccs = localStorage.getItem(STORAGE_KEYS.EXCHANGE_ACCOUNTS);
    const exchangeAccounts: ExchangeAccount[] = rawExchangeAccs ? JSON.parse(rawExchangeAccs) : INITIAL_EXCHANGE_ACCOUNTS;

    const rawExchangeTxs = localStorage.getItem(STORAGE_KEYS.EXCHANGE_TRANSACTIONS);
    const exchangeTransactions: ExchangeTransaction[] = rawExchangeTxs ? JSON.parse(rawExchangeTxs) : INITIAL_EXCHANGE_TRANSACTIONS;

    const rawSaasClients = localStorage.getItem(STORAGE_KEYS.SAAS_CLIENTS);
    const saasClients: SaaSClient[] = rawSaasClients ? JSON.parse(rawSaasClients) : INITIAL_SAAS_CLIENTS;

    return {
      branches,
      activeBranchId,
      accounts,
      journalEntries,
      vouchers,
      customers,
      vendors,
      invoices,
      bills,
      fixedAssets,
      bankAccounts,
      cashVaults,
      costCenters,
      currencies,
      currentUser,
      selectedDisplayCurrency,
      systemSettings,
      inventoryItems,
      stockMovements,
      unavailableRequests,
      roles,
      usersList,
      hrEmployees,
      hrDecisions,
      hrAttendanceRecords,
      hrShifts,
      hrPayrolls,
      correspondences,
      approvalRequests,
      workflowRules,
      auditLogs,
      systemAlerts,
      chatChannels,
      chatMessages,
      administrativeCirculars,
      exchangeAccounts,
      exchangeTransactions,
      saasClients,
    };
  } catch (error) {
    console.error("Failed to load ERP state from localStorage:", error);
    return {
      branches: INITIAL_BRANCHES,
      activeBranchId: "ALL",
      accounts: INITIAL_ACCOUNTS,
      journalEntries: INITIAL_JOURNAL_ENTRIES,
      vouchers: INITIAL_VOUCHERS,
      customers: INITIAL_CUSTOMERS,
      vendors: INITIAL_VENDORS,
      invoices: INITIAL_INVOICES,
      fixedAssets: INITIAL_FIXED_ASSETS,
      bankAccounts: INITIAL_BANK_ACCOUNTS,
      cashVaults: INITIAL_CASH_VAULTS,
      costCenters: INITIAL_COST_CENTERS,
      currencies: INITIAL_CURRENCIES,
      currentUser: INITIAL_USERS[0],
      selectedDisplayCurrency: "YER_SANAA",
      systemSettings: DEFAULT_SYSTEM_SETTINGS,
      inventoryItems: INITIAL_INVENTORY_ITEMS,
      stockMovements: INITIAL_STOCK_MOVEMENTS,
      unavailableRequests: INITIAL_UNAVAILABLE_REQUESTS,
      roles: INITIAL_ROLES,
      usersList: INITIAL_USERS,
      hrEmployees: INITIAL_HR_EMPLOYEES,
      hrDecisions: INITIAL_HR_DECISIONS,
      hrAttendanceRecords: INITIAL_HR_ATTENDANCE,
      hrShifts: INITIAL_HR_SHIFTS,
      hrPayrolls: INITIAL_HR_PAYROLLS,
      correspondences: INITIAL_CORRESPONDENCES,
      approvalRequests: INITIAL_APPROVAL_REQUESTS,
      workflowRules: INITIAL_WORKFLOW_RULES,
      auditLogs: INITIAL_AUDIT_LOGS,
      systemAlerts: INITIAL_SYSTEM_ALERTS,
      chatChannels: INITIAL_CHAT_CHANNELS,
      chatMessages: INITIAL_CHAT_MESSAGES,
      administrativeCirculars: INITIAL_ADMINISTRATIVE_CIRCULARS,
      exchangeAccounts: INITIAL_EXCHANGE_ACCOUNTS,
      exchangeTransactions: INITIAL_EXCHANGE_TRANSACTIONS,
      saasClients: INITIAL_SAAS_CLIENTS,
    };
  }
}

export function saveERPState(state: Partial<ERPFullState>): void {
  try {
    if (state.branches) localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(state.branches));
    if (state.activeBranchId) localStorage.setItem(STORAGE_KEYS.ACTIVE_BRANCH_ID, state.activeBranchId);
    if (state.accounts) localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(state.accounts));
    if (state.journalEntries) localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(state.journalEntries));
    if (state.vouchers) localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify(state.vouchers));
    if (state.customers) localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(state.customers));
    if (state.vendors) localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(state.vendors));
    if (state.invoices) localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(state.invoices));
    if (state.fixedAssets) localStorage.setItem(STORAGE_KEYS.FIXED_ASSETS, JSON.stringify(state.fixedAssets));
    if (state.bankAccounts) localStorage.setItem(STORAGE_KEYS.BANK_ACCOUNTS, JSON.stringify(state.bankAccounts));
    if (state.cashVaults) localStorage.setItem(STORAGE_KEYS.CASH_VAULTS, JSON.stringify(state.cashVaults));
    if (state.costCenters) localStorage.setItem(STORAGE_KEYS.COST_CENTERS, JSON.stringify(state.costCenters));
    if (state.currencies) localStorage.setItem(STORAGE_KEYS.CURRENCIES, JSON.stringify(state.currencies));
    if (state.currentUser) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(state.currentUser));
    if (state.selectedDisplayCurrency) localStorage.setItem(STORAGE_KEYS.SELECTED_CURRENCY, state.selectedDisplayCurrency);
    if (state.systemSettings) localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(state.systemSettings));
    if (state.inventoryItems) localStorage.setItem(STORAGE_KEYS.INVENTORY_ITEMS, JSON.stringify(state.inventoryItems));
    if (state.stockMovements) localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(state.stockMovements));
    if (state.unavailableRequests) localStorage.setItem(STORAGE_KEYS.UNAVAILABLE_REQUESTS, JSON.stringify(state.unavailableRequests));
    if (state.roles) localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(state.roles));
    if (state.usersList) localStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(state.usersList));
    if (state.hrEmployees) localStorage.setItem(STORAGE_KEYS.HR_EMPLOYEES, JSON.stringify(state.hrEmployees));
    if (state.hrDecisions) localStorage.setItem(STORAGE_KEYS.HR_DECISIONS, JSON.stringify(state.hrDecisions));
    if (state.hrAttendanceRecords) localStorage.setItem(STORAGE_KEYS.HR_ATTENDANCE, JSON.stringify(state.hrAttendanceRecords));
    if (state.hrShifts) localStorage.setItem(STORAGE_KEYS.HR_SHIFTS, JSON.stringify(state.hrShifts));
    if (state.hrPayrolls) localStorage.setItem(STORAGE_KEYS.HR_PAYROLLS, JSON.stringify(state.hrPayrolls));
    if (state.correspondences) localStorage.setItem(STORAGE_KEYS.CORRESPONDENCES, JSON.stringify(state.correspondences));
    if (state.approvalRequests) localStorage.setItem(STORAGE_KEYS.APPROVAL_REQUESTS, JSON.stringify(state.approvalRequests));
    if (state.workflowRules) localStorage.setItem(STORAGE_KEYS.WORKFLOW_RULES, JSON.stringify(state.workflowRules));
    if (state.auditLogs) localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(state.auditLogs));
    if (state.systemAlerts) localStorage.setItem(STORAGE_KEYS.SYSTEM_ALERTS, JSON.stringify(state.systemAlerts));
    if (state.chatChannels) localStorage.setItem(STORAGE_KEYS.CHAT_CHANNELS, JSON.stringify(state.chatChannels));
    if (state.chatMessages) localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(state.chatMessages));
    if (state.administrativeCirculars) localStorage.setItem(STORAGE_KEYS.CIRCULARS, JSON.stringify(state.administrativeCirculars));
    if (state.exchangeAccounts) localStorage.setItem(STORAGE_KEYS.EXCHANGE_ACCOUNTS, JSON.stringify(state.exchangeAccounts));
    if (state.exchangeTransactions) localStorage.setItem(STORAGE_KEYS.EXCHANGE_TRANSACTIONS, JSON.stringify(state.exchangeTransactions));
    if (state.saasClients) localStorage.setItem(STORAGE_KEYS.SAAS_CLIENTS, JSON.stringify(state.saasClients));
  } catch (error) {
    console.error("Error saving ERP state:", error);
  }
}

export function resetERPData(): ERPFullState {
  localStorage.clear();
  return loadERPState();
}

export function resetERPStateToDefault(): ERPFullState {
  return resetERPData();
}

export function initializeEmptyTenantState(): void {
  try {
    const defaultKeysToKeep = [
      STORAGE_KEYS.ACCOUNTS,
      STORAGE_KEYS.COST_CENTERS,
      STORAGE_KEYS.CURRENCIES,
      STORAGE_KEYS.SYSTEM_SETTINGS,
      STORAGE_KEYS.BRANCHES,
    ];

    // Keep structurally required defaults but wipe operational data
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(INITIAL_ACCOUNTS));
    localStorage.setItem(STORAGE_KEYS.COST_CENTERS, JSON.stringify(INITIAL_COST_CENTERS));
    localStorage.setItem(STORAGE_KEYS.CURRENCIES, JSON.stringify(INITIAL_CURRENCIES));
    localStorage.setItem(STORAGE_KEYS.SYSTEM_SETTINGS, JSON.stringify(DEFAULT_SYSTEM_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(INITIAL_BRANCHES));

    localStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INVENTORY_ITEMS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.VOUCHERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.FIXED_ASSETS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.BANK_ACCOUNTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CASH_VAULTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.WORKFLOW_RULES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CORRESPONDENCES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.APPROVAL_REQUESTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.HR_EMPLOYEES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_ACCOUNTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_TRANSACTIONS, JSON.stringify([]));

    // Special trigger for the onboarding modal
    localStorage.setItem("medo_is_new_user", "true");
    localStorage.setItem("medo_load_sample_data_flag", "false");
  } catch (error) {
    console.error("Error initializing empty tenant state:", error);
  }
}

export function exportERPDataAsJSON(state: ERPFullState): void {
  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", jsonStr);
  downloadAnchor.setAttribute("download", `medo_erp_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importERPDataFromJSON(file: File): Promise<ERPFullState | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.accounts && parsed.journalEntries) {
          saveERPState(parsed);
          resolve(parsed);
        } else {
          alert("الملف لا يحتوي على بيانات ERP صالحة");
          resolve(null);
        }
      } catch (err) {
        console.error("Invalid ERP JSON file", err);
        alert("فشل قراءة ملف النسخة الاحتياطية");
        resolve(null);
      }
    };
    reader.readAsText(file);
  });
}

/**
 * Currency Conversion Helper
 */
export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  currencies: CurrencyInfo[]
): number {
  if (from === to || amount === 0) return amount;

  const fromRate = currencies.find((c) => c.code === from)?.exchangeRateToUSD || 1;
  const toRate = currencies.find((c) => c.code === to)?.exchangeRateToUSD || 1;

  // Convert `from` to USD, then USD to `to`
  // Example: 530 YER_SANAA -> 1 USD -> 3.75 SAR
  const amountInUSD = amount / fromRate;
  const converted = amountInUSD * toRate;
  return Math.round(converted * 100) / 100;
}

/**
 * Format currency with symbols and nice commas
 */
export function formatMoney(amount: number, currency: CurrencyCode = "YER_SANAA", currencies: CurrencyInfo[] = INITIAL_CURRENCIES): string {
  const curr = currencies.find((c) => c.code === currency);
  const symbol = curr ? curr.symbol : currency;
  const formatted = new Intl.NumberFormat("ar-YE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ${symbol}`;
}

export function formatNumberOnly(amount: number): string {
  return new Intl.NumberFormat("ar-YE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Re-calculate GL Account Balances from all Posted Journal Entries
 */
export function recalculateAllAccountBalances(
  accounts: Account[],
  journalEntries: JournalEntry[],
  currencies?: CurrencyInfo[]
): Account[] {
  const accountMap = new Map<string, { debit: number; credit: number }>();

  // Initialize
  accounts.forEach((acc) => {
    accountMap.set(acc.id, { debit: 0, credit: 0 });
  });

  // Accumulate posted journal lines
  journalEntries
    .filter((entry) => entry.status === "POSTED" || entry.status === "APPROVED")
    .forEach((entry) => {
      entry.lines.forEach((line) => {
        const current = accountMap.get(line.accountId) || { debit: 0, credit: 0 };
        current.debit += Number(line.debit || 0);
        current.credit += Number(line.credit || 0);
        accountMap.set(line.accountId, current);
      });
    });

  // Calculate new balance based on Nature (Debit or Credit)
  return accounts.map((acc) => {
    if (acc.isHeader) {
      // Header balance is computed dynamically in tree view
      return acc;
    }
    const totals = accountMap.get(acc.id) || { debit: 0, credit: 0 };
    const netBalance = acc.nature === "DEBIT" ? totals.debit - totals.credit : totals.credit - totals.debit;

    return {
      ...acc,
      balanceDebit: totals.debit,
      balanceCredit: totals.credit,
      currentBalance: netBalance,
    };
  });
}
