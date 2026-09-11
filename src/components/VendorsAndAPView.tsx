import React, { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  FileSpreadsheet,
  ArrowUpRight,
  Printer,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Truck,
  Phone,
  Share2,
} from "lucide-react";
import {
  Account,
  CurrencyCode,
  CurrencyInfo,
  Invoice,
  InvoiceItem,
  Vendor,
} from "../types/erp";
import { formatMoney, formatNumberOnly } from "../services/erpStorage";

interface VendorsAndAPViewProps {
  vendors: Vendor[];
  invoices: Invoice[];
  accounts: Account[];
  currencies: CurrencyInfo[];
  displayCurrency: CurrencyCode;
  onAddVendor: (vendor: Vendor) => void;
  onSaveInvoice: (invoice: Invoice) => void;
  onPrintDocument: (docType: "INVOICE", data: any) => void;
  onShareDocument?: (data: any) => void;
}

export const VendorsAndAPView: React.FC<VendorsAndAPViewProps> = ({
  vendors,
  invoices,
  accounts,
  currencies,
  displayCurrency,
  onAddVendor,
  onSaveInvoice,
  onPrintDocument,
  onShareDocument,
}) => {
  const [activeTab, setActiveTab] = useState<"VENDORS" | "PURCHASES">("VENDORS");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showAddPurchaseModal, setShowAddPurchaseModal] = useState(false);

  // New Vendor Form State
  const [venNameAr, setVenNameAr] = useState("");
  const [venNameEn, setVenNameEn] = useState("");
  const [venPhone, setVenPhone] = useState("");
  const [venCity, setVenCity] = useState("صنعاء");
  const [venCurrency, setVenCurrency] = useState<CurrencyCode>("USD");
  const [venCategory, setVenCategory] = useState("توريد بضائع ومواد");

  // New Purchase Bill Form State
  const [purVendorId, setPurVendorId] = useState(vendors[0]?.id || "");
  const [purDate, setPurDate] = useState(new Date().toISOString().split("T")[0]);
  const [purDueDate, setPurDueDate] = useState(
    new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [purCurrency, setPurCurrency] = useState<CurrencyCode>("USD");
  const [purItems, setPurItems] = useState<InvoiceItem[]>([
    {
      id: "item-p1",
      description: "توريد معدات وأجهزة شبكات وسيرفرات",
      quantity: 2,
      unitPrice: 1200,
      total: 2400,
    },
  ]);

  const addPurchaseItem = () => {
    setPurItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const updatePurchaseItem = (id: string, field: keyof InvoiceItem, val: any) => {
    setPurItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: val };
        if (field === "quantity" || field === "unitPrice") {
          const qty = field === "quantity" ? Number(val) : item.quantity;
          const price = field === "unitPrice" ? Number(val) : item.unitPrice;
          updated.total = qty * price;
        }
        return updated;
      })
    );
  };

  const removePurchaseItem = (id: string) => {
    if (purItems.length <= 1) return;
    setPurItems((prev) => prev.filter((i) => i.id !== id));
  };

  const purSubtotal = purItems.reduce((sum, item) => sum + item.total, 0);

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venNameAr) return;

    const nextCode = `VEND-${(vendors.length + 1).toString().padStart(4, "0")}`;
    const newVen: Vendor = {
      id: `vend-${Date.now()}`,
      code: nextCode,
      nameAr: venNameAr,
      nameEn: venNameEn,
      phone: venPhone,
      city: venCity,
      currency: venCurrency,
      currentBalance: 0,
      glAccountId: "210101",
      category: venCategory,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onAddVendor(newVen);
    setShowAddVendorModal(false);
    setVenNameAr("");
    setVenNameEn("");
    setVenPhone("");
  };

  const handleSavePurchaseBill = (e: React.FormEvent) => {
    e.preventDefault();
    const vend = vendors.find((v) => v.id === purVendorId);
    if (!vend || purSubtotal <= 0) return;

    const nextBillNum = `BILL-2026-${(invoices.length + 1).toString().padStart(4, "0")}`;
    const newBill: Invoice = {
      id: `bill-${Date.now()}`,
      invoiceNumber: nextBillNum,
      type: "PURCHASE",
      vendorId: vend.id,
      vendorName: vend.nameAr,
      date: purDate,
      dueDate: purDueDate,
      currency: purCurrency,
      exchangeRate: 1,
      items: purItems,
      subtotal: purSubtotal,
      taxRate: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalAmount: purSubtotal,
      paidAmount: 0,
      remainingAmount: purSubtotal,
      status: "ISSUED",
      notes: `فاتورة مشتريات من المورد ${vend.nameAr}`,
    };

    onSaveInvoice(newBill);
    setShowAddPurchaseModal(false);
  };

  const filteredVendors = vendors.filter((v) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return v.nameAr.toLowerCase().includes(q) || v.code.toLowerCase().includes(q);
    }
    return true;
  });

  const purchaseBills = invoices.filter((i) => i.type === "PURCHASE");

  return (
    <div className="space-y-5 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">إدارة الموردين والمشتريات (Accounts Payable - AP)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            دليل الموردين المحليين والدوليين، فواتير المشتريات ومتابعة استحقاقات الدفع
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddVendorModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>إضافة مورد جديد</span>
          </button>
          <button
            onClick={() => setShowAddPurchaseModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>تسجيل فاتورة مشتريات</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs w-fit">
        {[
          { id: "VENDORS", label: "دليل الموردين والدائنين" },
          { id: "PURCHASES", label: "فواتير المشتريات (Vendor Bills)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeTab === tab.id
                ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vendors Table */}
      {activeTab === "VENDORS" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="بحث باسم المورد أو الرمز..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <span className="text-xs text-slate-400 font-mono">إجمالي الموردين: {vendors.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 bg-slate-950/70">
                  <th className="py-3 px-4 font-semibold">رمز المورد</th>
                  <th className="py-3 px-4 font-semibold">اسم الشركة / المورد</th>
                  <th className="py-3 px-4 font-semibold">التصنيف</th>
                  <th className="py-3 px-4 font-semibold">المدينة / الدولة</th>
                  <th className="py-3 px-4 font-semibold">الهاتف</th>
                  <th className="py-3 px-4 font-semibold text-left">الرصيد الدائن المستحق</th>
                  <th className="py-3 px-4 font-semibold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{v.code}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-100">{v.nameAr}</div>
                      {v.nameEn && <div className="text-[10px] text-slate-400 font-mono">{v.nameEn}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {v.category || "عام"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{v.city}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{v.phone}</td>
                    <td className="py-3 px-4 text-left font-mono font-bold text-amber-400 text-sm">
                      {formatMoney(v.currentBalance, v.currency, currencies)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {onShareDocument && (
                          <button
                            onClick={() =>
                              onShareDocument({
                                type: "STATEMENT",
                                data: v,
                                recipientName: v.nameAr,
                                recipientPhone: v.phone,
                              })
                            }
                            className="p-1.5 rounded-lg bg-amber-950/80 text-amber-400 border border-amber-800/60 hover:bg-amber-800 hover:text-white transition-colors"
                            title="مشاركة كشف الحساب عبر واتساب / SMS"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() =>
                            onShareDocument?.({
                              type: "STATEMENT",
                              data: v,
                              recipientName: v.nameAr,
                              recipientPhone: v.phone,
                            })
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-colors"
                        >
                          كشف حساب
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Purchases Table */}
      {activeTab === "PURCHASES" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 bg-slate-950/70">
                  <th className="py-3 px-4 font-semibold">رقم الفاتورة</th>
                  <th className="py-3 px-4 font-semibold">المورد</th>
                  <th className="py-3 px-4 font-semibold">التاريخ</th>
                  <th className="py-3 px-4 font-semibold">تاريخ الاستحقاق</th>
                  <th className="py-3 px-4 font-semibold text-left">إجمالي الفاتورة</th>
                  <th className="py-3 px-4 font-semibold text-center">الحالة</th>
                  <th className="py-3 px-4 font-semibold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {purchaseBills.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      لا توجد فواتير مشتريات مسجلة
                    </td>
                  </tr>
                ) : (
                  purchaseBills.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">{b.invoiceNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-100">{b.vendorName}</td>
                      <td className="py-3 px-4 text-slate-300">{b.date}</td>
                      <td className="py-3 px-4 text-slate-400 font-mono">{b.dueDate}</td>
                      <td className="py-3 px-4 text-left font-mono font-bold text-amber-400">
                        {formatMoney(b.totalAmount, b.currency, currencies)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                          مستحق الدفع
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {onShareDocument && (
                            <button
                              onClick={() =>
                                onShareDocument({
                                  type: "INVOICE",
                                  data: b,
                                  recipientName: b.vendorName,
                                  recipientPhone: (b as any).vendorPhone || (b as any).partyPhone || vendors.find((v) => v.id === b.partyId)?.phone,
                                })
                              }
                              className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-800 hover:text-white transition-colors"
                              title="مشاركة عبر واتساب / SMS"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onPrintDocument("INVOICE", b)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                          >
                            طباعة
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 text-right animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>إضافة مورد / دائن جديد إلى الدليل</span>
              </h3>
              <button
                onClick={() => setShowAddVendorModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">اسم الشركة / المورد بالعربية *</label>
                <input
                  type="text"
                  required
                  value={venNameAr}
                  onChange={(e) => setVenNameAr(e.target.value)}
                  placeholder="مثال: شركة النظم والتقنيات الحديثة"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">المدينة / الدولة</label>
                  <input
                    type="text"
                    value={venCity}
                    onChange={(e) => setVenCity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">رقم الهاتف</label>
                  <input
                    type="text"
                    value={venPhone}
                    onChange={(e) => setVenPhone(e.target.value)}
                    placeholder="+967 1 234567"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">عملة الحساب</label>
                  <select
                    value={venCurrency}
                    onChange={(e) => setVenCurrency(e.target.value as CurrencyCode)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="YER_SANAA">ريال يمني (صنعاء)</option>
                    <option value="YER_ADEN">ريال يمني (عدن)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">تصنيف التوريد</label>
                  <input
                    type="text"
                    value={venCategory}
                    onChange={(e) => setVenCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddVendorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold transition-all"
                >
                  حفظ المورد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Purchase Bill Modal */}
      {showAddPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl p-6 text-right animate-in zoom-in-95 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                <span>تسجيل فاتورة مشتريات (Vendor Bill)</span>
              </h3>
              <button
                onClick={() => setShowAddPurchaseModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSavePurchaseBill} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">المورد *</label>
                  <select
                    value={purVendorId}
                    onChange={(e) => setPurVendorId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-bold focus:outline-none focus:border-amber-500"
                  >
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.nameAr} ({v.currency})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">تاريخ الفاتورة</label>
                  <input
                    type="date"
                    value={purDate}
                    onChange={(e) => setPurDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">تاريخ الاستحقاق</label>
                  <input
                    type="date"
                    value={purDueDate}
                    onChange={(e) => setPurDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Items */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <th className="py-2 px-3 font-semibold">بيان البضاعة / الخدمة *</th>
                      <th className="py-2 px-3 font-semibold w-24 text-left">الكمية</th>
                      <th className="py-2 px-3 font-semibold w-32 text-left">سعر الوحدة</th>
                      <th className="py-2 px-3 font-semibold w-32 text-left">الإجمالي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {purItems.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            required
                            value={item.description}
                            onChange={(e) => updatePurchaseItem(item.id, "description", e.target.value)}
                            placeholder="وصف البند المورد..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updatePurchaseItem(item.id, "quantity", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-left"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="0"
                            step="any"
                            value={item.unitPrice}
                            onChange={(e) => updatePurchaseItem(item.id, "unitPrice", e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 font-mono text-left font-bold text-amber-400"
                          />
                        </td>
                        <td className="py-2 px-3 text-left font-mono font-bold text-white">
                          {formatNumberOnly(item.total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center font-bold">
                <span className="text-slate-400">إجمالي فاتورة المشتريات:</span>
                <span className="text-amber-400 font-mono text-base">
                  {formatMoney(purSubtotal, purCurrency, currencies)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddPurchaseModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold transition-all"
                >
                  حفظ الفاتورة وترحيل القيد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
