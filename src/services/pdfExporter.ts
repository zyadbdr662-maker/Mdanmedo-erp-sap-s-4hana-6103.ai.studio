import html2pdf from "html2pdf.js";
import { CurrencyCode, CurrencyInfo } from "../types/erp";
import { formatMoney, formatNumberOnly } from "./erpStorage";
import {
  formatCalendarDate,
  getActiveCalendarType,
  formatDualDate,
  formatGregorianDate,
  formatHijriDate,
} from "../utils/calendarUtils";

/**
 * Export a DOM element to PDF file
 */
export async function exportElementToPdf(elementId: string, filename: string): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with ID '${elementId}' not found, falling back to browser print`);
    window.print();
    return false;
  }

  const cleanFilename = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;

  const opt = {
    margin: [8, 8, 8, 8],
    filename: cleanFilename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  try {
    // @ts-ignore
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (err) {
    console.error("PDF export error:", err);
    // Fallback to native print
    window.print();
    return false;
  }
}

/**
 * Gets today's formatted date string according to the active calendar setting (Hijri / Gregorian / Dual)
 */
export function getTodayFormattedDate(): string {
  const activeType = getActiveCalendarType();
  return formatCalendarDate(new Date(), activeType);
}

/**
 * Export Invoice / Voucher Document directly to PDF
 */
export async function exportInvoiceToPdf(
  documentType: "JOURNAL" | "RECEIPT" | "PAYMENT" | "INVOICE",
  documentData: any,
  currencies: CurrencyInfo[],
  filenameOverride?: string
): Promise<boolean> {
  const docNum =
    documentData.invoiceNumber ||
    documentData.voucherNumber ||
    documentData.entryNumber ||
    "JV-INV-SALES-2026-0004";
  const defaultFilename = `مستند_${documentType}_${docNum}_${new Date().toISOString().split("T")[0]}.pdf`;
  const filename = filenameOverride || defaultFilename;

  // Check if printable canvas already exists in DOM
  const existingCanvas = document.getElementById("printable-document-canvas");
  if (existingCanvas) {
    return exportElementToPdf("printable-document-canvas", filename);
  }

  // Otherwise dynamically construct offscreen printable DOM container
  const container = document.createElement("div");
  container.id = "temp-pdf-export-container";
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "790px"; // A4 width equivalent at 96 DPI
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#1A2B4C";
  container.style.padding = "24px";
  container.style.fontFamily = "'Noto Naskh Arabic', 'Amiri', 'Droid Arabic Naskh', 'Traditional Arabic', sans-serif";
  container.style.direction = "rtl";

  const todayDate = getTodayFormattedDate();

  let docTitle = "سند قيد محاسبي عام (Journal)";
  if (documentType === "JOURNAL") docTitle = "سند قيد محاسبي عام (Journal)";
  else if (documentType === "RECEIPT") docTitle = "سند قبض مالي رسمي (Receipt Voucher)";
  else if (documentType === "PAYMENT") docTitle = "سند صرف مالي رسمي (Payment Voucher)";
  else if (documentType === "INVOICE") {
    if (documentData.type === "SALES_RETURN") docTitle = "فاتورة مرتجع مبيعات رسمية (Sales Return Invoice)";
    else if (documentData.type === "PURCHASE") docTitle = "فاتورة مشتريات تجارية (Purchase Bill)";
    else if (documentData.type === "PURCHASE_RETURN") docTitle = "فاتورة مرتجع مشتريات (Purchase Return Invoice)";
    else docTitle = "فاتورة مبيعات ضريبية (Tax Sales Invoice)";
  }

  let tableHtml = "";
  if (documentType === "INVOICE" && documentData.items) {
    tableHtml = `
      <table style="width:100%; border-collapse:collapse; margin-top:16px; font-size:14px; text-align:right; border:1px solid #E0E6ED;">
        <thead>
          <tr style="background-color:#0A2540; color:#FFFFFF;">
            <th style="padding:10px 14px; border:1px solid #0A2540; text-align:center; font-weight:700; font-size:14px;">#</th>
            <th style="padding:10px 14px; border:1px solid #0A2540; font-weight:700; font-size:14px;">بيان الصنف / الخدمة</th>
            <th style="padding:10px 14px; border:1px solid #0A2540; text-align:left; font-weight:700; font-size:14px;">الكمية</th>
            <th style="padding:10px 14px; border:1px solid #0A2540; text-align:left; font-weight:700; font-size:14px;">سعر الوحدة</th>
            <th style="padding:10px 14px; border:1px solid #0A2540; text-align:left; font-weight:700; font-size:14px;">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          ${documentData.items
            .map(
              (item: any, idx: number) => `
            <tr style="background-color:${idx % 2 === 1 ? "#F8FAFC" : "#FFFFFF"};">
              <td style="padding:9px 14px; border:1px solid #E0E6ED; text-align:center; font-family:monospace; color:#1A2B4C; font-size:14px; font-weight:700;">${idx + 1}</td>
              <td style="padding:9px 14px; border:1px solid #E0E6ED; color:#1A2B4C; font-size:14px; font-weight:700;">${item.description || item.itemName}</td>
              <td style="padding:9px 14px; border:1px solid #E0E6ED; text-align:left; font-family:monospace; color:#1A2B4C; font-size:14px; font-weight:700;">${item.quantity} ${item.unit || ""}</td>
              <td style="padding:9px 14px; border:1px solid #E0E6ED; text-align:left; font-family:monospace; color:#1A2B4C; font-size:14px; font-weight:700;">${formatNumberOnly(item.unitPrice)}</td>
              <td style="padding:9px 14px; border:1px solid #E0E6ED; text-align:left; font-family:monospace; font-weight:700; color:#1A2B4C; font-size:14px;">${formatNumberOnly(item.total)}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr style="background-color:#F1F5F9; font-weight:700;">
            <td colspan="4" style="padding:10px 14px; border:1px solid #E0E6ED; color:#0A2540; font-size:14px;">الإجمالي العام:</td>
            <td style="padding:10px 14px; border:1px solid #E0E6ED; text-align:left; font-family:monospace; color:#0A2540; font-size:15px; font-weight:700;">
              ${formatMoney(documentData.totalAmount || documentData.grandTotal, documentData.currency, currencies)}
            </td>
          </tr>
        </tfoot>
      </table>
    `;
  } else if (documentType === "JOURNAL" && documentData.lines) {
    tableHtml = `
      <table style="width:100%; border-collapse:collapse; margin-top:16px; font-size:14px; text-align:right; border:1px solid #E0E6ED;">
        <thead>
          <tr style="background-color:#0A2540; color:#FFFFFF;">
            <th style="padding:10px 14px; border:1px solid #0A2540; font-weight:700; font-size:14px;">رمز الحساب</th>
            <th style="padding:10px 14px; border:1px solid #0A2540; font-weight:700; font-size:14px;">اسم الحساب</th>
            <th style="padding:10px 14px; border:1px solid #0A2540; text-align:left; font-weight:700; font-size:14px;">مدين</th>
            <th style="padding:10px 14px; border:1px solid #0A2540; text-align:left; font-weight:700; font-size:14px;">دائن</th>
            <th style="padding:10px 14px; border:1px solid #0A2540; font-weight:700; font-size:14px;">شرح السطر</th>
          </tr>
        </thead>
        <tbody>
          ${documentData.lines
            .map(
              (line: any, idx: number) => `
            <tr style="background-color:${idx % 2 === 1 ? "#F8FAFC" : "#FFFFFF"};">
              <td style="padding:9px 14px; border:1px solid #E0E6ED; font-family:monospace; font-weight:700; color:#1A2B4C; font-size:14px;">${line.accountCode}</td>
              <td style="padding:9px 14px; border:1px solid #E0E6ED; font-weight:700; color:#1A2B4C; font-size:14px;">${line.accountNameAr}</td>
              <td style="padding:9px 14px; border:1px solid #E0E6ED; text-align:left; font-family:monospace; font-weight:700; color:#1A2B4C; font-size:14px;">
                ${line.debit > 0 ? formatNumberOnly(line.debit) : ""}
              </td>
              <td style="padding:9px 14px; border:1px solid #E0E6ED; text-align:left; font-family:monospace; font-weight:700; color:#1A2B4C; font-size:14px;">
                ${line.credit > 0 ? formatNumberOnly(line.credit) : ""}
              </td>
              <td style="padding:9px 14px; border:1px solid #E0E6ED; color:#4A5B6F; font-size:14px; font-weight:700;">${line.memo || "-"}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
        <tfoot>
          <tr style="background-color:#F1F5F9; font-weight:700;">
            <td colspan="2" style="padding:10px 14px; border:1px solid #E0E6ED; color:#0A2540; font-size:14px;">الإجمالي:</td>
            <td style="padding:10px 14px; border:1px solid #E0E6ED; text-align:left; font-family:monospace; color:#0A2540; font-size:15px; font-weight:700;">${formatNumberOnly(documentData.totalDebit)}</td>
            <td style="padding:10px 14px; border:1px solid #E0E6ED; text-align:left; font-family:monospace; color:#0A2540; font-size:15px; font-weight:700;">${formatNumberOnly(documentData.totalCredit)}</td>
            <td style="padding:10px 14px; border:1px solid #E0E6ED;"></td>
          </tr>
        </tfoot>
      </table>
    `;
  }

  const statementText =
    documentData.description ||
    documentData.notes ||
    (documentType === "INVOICE"
      ? `فاتورة مبيعات رقم ${docNum} للعميل ${documentData.customerName || "العميل النقدي"}`
      : "قيد محاسبي معتمد في نظام المحاسبة والإدارة المتكامل");

  container.innerHTML = `
    <!-- Header with Enterprise Logo -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #D4AF37; padding-bottom:14px; margin-bottom:16px;">
      <!-- Right Side: Arabic -->
      <div style="text-align:right;">
        <h1 style="margin:0; font-size:18px; font-weight:900; color:#0A2540; font-family:'Cairo', sans-serif;">🏢 مجموعة بن زياد التجارية المتحدة</h1>
        <div style="font-size:13px; font-weight:bold; color:#4A5B6F; margin-top:4px; font-family:'Cairo', sans-serif;">مواد بناء ومواد زراعية - العنوان: الكندوي، حمر، عمران</div>
        <div style="font-size:12px; color:#4A5B6F; margin-top:2px; font-family:'Cairo', sans-serif;">للتواصل: 0967773586047 + 715779976</div>
      </div>
      
      <!-- Middle: Logo -->
      <div style="text-align:center; flex-shrink:0;">
        <div style="background-color:#0A2540; color:#D4AF37; width:62px; height:62px; border-radius:12px; font-weight:900; font-size:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:0 auto; border:2px solid #D4AF37;">
          <span style="font-size:12px; font-family:monospace;">MDOtkBZ</span>
          <span style="font-size:8px; color:rgba(212, 175, 55, 0.9);">بن زياد</span>
        </div>
      </div>

      <!-- Left Side: English -->
      <div style="text-align:left; direction:ltr;">
        <h2 style="margin:0; font-size:14px; font-weight:900; color:#0A2540; font-family:'Cairo', sans-serif;">Bin Ziad United Commercial Group</h2>
        <div style="font-size:11px; color:#4A5B6F; margin-top:3px; font-family:'Cairo', sans-serif;">Building & Agricultural Materials</div>
        <div style="font-size:11px; color:#4A5B6F; margin-top:2px; font-family:'Cairo', sans-serif;">Tel: +967 773586047 | 715779976</div>
      </div>
    </div>

    <!-- Document Title & Reference Bar -->
    <div style="background-color:#F8FAFC; border:1px solid #E0E6ED; border-radius:10px; padding:12px 16px; display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <div>
        <div style="font-size:12px; color:#4A5B6F; font-weight:bold;">نوع المستند:</div>
        <div style="font-size:22px; font-weight:700; color:#0A2540; margin-top:2px; font-family:'Cairo', sans-serif;">📄 ${docTitle}</div>
      </div>
      <div style="text-align:left;" dir="ltr">
        <div style="font-size:16px; font-weight:700; color:#0A2540; font-family:monospace;">Reference No: ${docNum}</div>
        <div style="font-size:14px; font-weight:700; color:#4A5B6F; margin-top:2px;" dir="rtl">تاريخ الإصدار: <b>${formatCalendarDate(documentData.date || documentData.issueDate || new Date())}</b></div>
        <div style="font-size:14px; font-weight:700; color:#4A5B6F; margin-top:2px;" dir="rtl">تاريخ الطباعة: <b>${todayDate}</b></div>
      </div>
    </div>

    <!-- General Statement (البيان العام) -->
    <div style="background-color:#F8FAFC; border:1px solid #E0E6ED; border-radius:10px; padding:12px 16px; margin-bottom:14px; font-size:14px; font-weight:700; color:#1A2B4C; line-height:1.65;">
      <b style="color:#0A2540; font-weight:700;">البيان العام: </b> ${statementText}
    </div>

    <!-- Main Table -->
    ${tableHtml}

    <!-- Signatures Section -->
    <div style="margin-top:36px; border-top:2px solid #E0E6ED; padding-top:20px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; text-align:center; font-size:14px;">
      <div>
        <div style="font-weight:700; color:#0A2540;">المدقق المالي</div>
        <div style="margin-top:30px; border-bottom:1px dashed #94A3B8; padding-bottom:4px; color:#4A5B6F;">___________________</div>
      </div>
      <div>
        <div style="font-weight:700; color:#0A2540;">توقيع العميل / المدير (إلكتروني)</div>
        <div style="margin-top:30px; border-bottom:1px dashed #94A3B8; padding-bottom:4px; color:#4A5B6F;">___________________</div>
      </div>
      <div>
        <div style="font-weight:700; color:#0A2540;">الختم الرسمي للمؤسسة</div>
        <div style="margin-top:30px; font-weight:700; font-size:13px; color:#D4AF37;">مجموعة بن زياد التجارية المتحدة</div>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="margin-top:28px; text-align:center; font-size:12px; font-weight:600; color:#6B7A8F; border-top:1px solid #E0E6ED; padding-top:10px; line-height:1.6;">
      <div>© 2026 ميدو تك وبن زياد المتحدة | MeDo ERP</div>
      <div>نظام المحاسبة والإدارة المتكامل</div>
    </div>
  `;

  document.body.appendChild(container);
  const success = await exportElementToPdf("temp-pdf-export-container", filename);
  document.body.removeChild(container);

  return success;
}

/**
 * Export Financial Reports (Balance Sheet, Income Statement, Trial Balance, Cash Flow) to PDF
 */
export async function exportFinancialReportToPdf(
  reportType: "BALANCE_SHEET" | "INCOME_STATEMENT" | "TRIAL_BALANCE" | "CASH_FLOW",
  fiscalYear: string,
  reportData: {
    totalAssets: number;
    totalLiabilities: number;
    totalEquity: number;
    totalRevenues: number;
    totalExpenses: number;
    netProfit: number;
    trialTotalDebit: number;
    trialTotalCredit: number;
    assetAccounts?: any[];
    liabilityAccounts?: any[];
    equityAccounts?: any[];
    revenueAccounts?: any[];
    expenseAccounts?: any[];
    allAccounts?: any[];
  },
  currencies: CurrencyInfo[],
  displayCurrency: CurrencyCode
): Promise<boolean> {
  const todayDate = getTodayFormattedDate();

  let reportTitle = "التقرير المالي الختامي";
  if (reportType === "BALANCE_SHEET") reportTitle = "قائمة المركز المالي - الميزانية العمومية (Balance Sheet)";
  else if (reportType === "INCOME_STATEMENT") reportTitle = "قائمة الدخل والأرباح والخسائر (Income Statement / P&L)";
  else if (reportType === "TRIAL_BALANCE") reportTitle = "ميزان المراجعة بالأرصدة (Trial Balance)";
  else if (reportType === "CASH_FLOW") reportTitle = "قائمة التدفقات النقدية (Cash Flow Statement)";

  const filename = `التقرير_المالي_${reportType}_${fiscalYear}_${new Date().toISOString().split("T")[0]}.pdf`;

  // Existing report canvas check
  const existingReportCanvas = document.getElementById("financial-report-canvas");
  if (existingReportCanvas) {
    return exportElementToPdf("financial-report-canvas", filename);
  }

  // Create clean formatted DOM structure
  const container = document.createElement("div");
  container.id = "temp-report-pdf-container";
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "790px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#1A2B4C";
  container.style.padding = "24px";
  container.style.fontFamily = "'Noto Naskh Arabic', 'Amiri', 'Droid Arabic Naskh', 'Traditional Arabic', sans-serif";
  container.style.direction = "rtl";

  let bodyContentHtml = "";

  if (reportType === "BALANCE_SHEET") {
    bodyContentHtml = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px; font-size:14.5px;">
        <div style="border:1px solid #E0E6ED; border-radius:10px; padding:14px; background-color:#F8FAFC;">
          <h3 style="margin:0 0 10px 0; font-size:15px; font-weight:bold; color:#0A2540; border-bottom:2px solid #0A2540; padding-bottom:6px;">
            1. الأصول والموجودات (Assets)
          </h3>
          ${(reportData.assetAccounts || [])
            .map(
              (acc) => `
            <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #E0E6ED; font-size:14.5px;">
              <span>${acc.code} - ${acc.nameAr}</span>
              <span style="font-family:monospace; font-weight:bold; color:#1A2B4C;">${formatMoney(acc.currentBalance, acc.currency || displayCurrency, currencies)}</span>
            </div>
          `
            )
            .join("")}
          <div style="display:flex; justify-content:space-between; margin-top:14px; padding-top:8px; border-top:2px solid #0A2540; font-weight:bold; font-size:15px; color:#0A2540;">
            <span>إجمالي الأصول:</span>
            <span style="font-family:monospace;">${formatMoney(reportData.totalAssets, displayCurrency, currencies)}</span>
          </div>
        </div>

        <div style="border:1px solid #E0E6ED; border-radius:10px; padding:14px; background-color:#F8FAFC;">
          <h3 style="margin:0 0 10px 0; font-size:15px; font-weight:bold; color:#0A2540; border-bottom:2px solid #0A2540; padding-bottom:6px;">
            2. الالتزامات وحقوق الملكية (Liabilities & Equity)
          </h3>
          <div style="font-weight:bold; color:#4A5B6F; margin-bottom:6px; font-size:14.5px;">أ. الالتزامات (Liabilities)</div>
          ${(reportData.liabilityAccounts || [])
            .map(
              (acc) => `
            <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #E0E6ED; font-size:14.5px;">
              <span>${acc.code} - ${acc.nameAr}</span>
              <span style="font-family:monospace; font-weight:bold; color:#1A2B4C;">${formatMoney(acc.currentBalance, acc.currency || displayCurrency, currencies)}</span>
            </div>
          `
            )
            .join("")}
          
          <div style="font-weight:bold; color:#4A5B6F; margin:10px 0 6px 0; font-size:14.5px;">ب. حقوق الملكية وصافي ربح العام (Equity & Profit)</div>
          ${(reportData.equityAccounts || [])
            .map(
              (acc) => `
            <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #E0E6ED; font-size:14.5px;">
              <span>${acc.code} - ${acc.nameAr}</span>
              <span style="font-family:monospace; font-weight:bold; color:#1A2B4C;">${formatMoney(acc.currentBalance, acc.currency || displayCurrency, currencies)}</span>
            </div>
          `
            )
            .join("")}
          <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #E0E6ED; color:#0A2540; font-weight:bold; font-size:14.5px;">
            <span>صافي أرباح/خسائر الفترة الحالية:</span>
            <span style="font-family:monospace;">${formatMoney(reportData.netProfit, displayCurrency, currencies)}</span>
          </div>

          <div style="display:flex; justify-content:space-between; margin-top:14px; padding-top:8px; border-top:2px solid #0A2540; font-weight:bold; font-size:15px; color:#0A2540;">
            <span>إجمالي الالتزامات وحقوق الملكية:</span>
            <span style="font-family:monospace;">${formatMoney(reportData.totalLiabilities + reportData.totalEquity + reportData.netProfit, displayCurrency, currencies)}</span>
          </div>
        </div>
      </div>
    `;
  } else if (reportType === "INCOME_STATEMENT") {
    bodyContentHtml = `
      <div style="border:1px solid #E0E6ED; border-radius:10px; padding:16px; background-color:#F8FAFC; font-size:14.5px; margin-bottom:20px;">
        <h3 style="margin:0 0 12px 0; font-size:16px; font-weight:bold; color:#0A2540; border-bottom:2px solid #0A2540; padding-bottom:6px;">
          قائمة الأرباح والخسائر عن السنة المالية ${fiscalYear}
        </h3>

        <div style="margin-bottom:16px;">
          <div style="font-weight:bold; font-size:14.5px; color:#0A2540; margin-bottom:6px;">أولاً: الإيرادات التشغيلية والتجارية (Revenues)</div>
          ${(reportData.revenueAccounts || [])
            .map(
              (acc) => `
            <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #E0E6ED;">
              <span>${acc.code} - ${acc.nameAr}</span>
              <span style="font-family:monospace; font-weight:bold; color:#1A2B4C;">${formatMoney(acc.currentBalance, acc.currency || displayCurrency, currencies)}</span>
            </div>
          `
            )
            .join("")}
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-top:2px solid #0A2540; font-weight:bold; font-size:15px; color:#0A2540;">
            <span>إجمالي الإيرادات:</span>
            <span style="font-family:monospace;">${formatMoney(reportData.totalRevenues, displayCurrency, currencies)}</span>
          </div>
        </div>

        <div style="margin-bottom:16px;">
          <div style="font-weight:bold; font-size:14.5px; color:#0A2540; margin-bottom:6px;">ثانياً: المصروفات والتكاليف التشغيلية (Expenses)</div>
          ${(reportData.expenseAccounts || [])
            .map(
              (acc) => `
            <div style="display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #E0E6ED;">
              <span>${acc.code} - ${acc.nameAr}</span>
              <span style="font-family:monospace; font-weight:bold; color:#1A2B4C;">${formatMoney(acc.currentBalance, acc.currency || displayCurrency, currencies)}</span>
            </div>
          `
            )
            .join("")}
          <div style="display:flex; justify-content:space-between; padding:8px 0; border-top:2px solid #0A2540; font-weight:bold; font-size:15px; color:#0A2540;">
            <span>إجمالي المصروفات:</span>
            <span style="font-family:monospace;">${formatMoney(reportData.totalExpenses, displayCurrency, currencies)}</span>
          </div>
        </div>

        <div style="padding:12px; background-color:#FFFFFF; border:1px solid #E0E6ED; border-radius:8px; display:flex; justify-content:space-between; font-weight:bold; font-size:16px; color:#0A2540;">
          <span>صافي الربح / الخسارة التشغيلي:</span>
          <span style="font-family:monospace;">${formatMoney(reportData.netProfit, displayCurrency, currencies)}</span>
        </div>
      </div>
    `;
  } else if (reportType === "TRIAL_BALANCE") {
    bodyContentHtml = `
      <div style="margin-bottom:20px;">
        <table style="width:100%; border-collapse:collapse; font-size:14.5px; text-align:right; border:1px solid #E0E6ED;">
          <thead>
            <tr style="background-color:#0A2540; color:#FFFFFF;">
              <th style="padding:10px 14px; border:1px solid #0A2540; font-weight:700;">رمز الحساب</th>
              <th style="padding:10px 14px; border:1px solid #0A2540; font-weight:700;">اسم الحساب المالي</th>
              <th style="padding:10px 14px; border:1px solid #0A2540; text-align:left; font-weight:700;">إجمالي المدين</th>
              <th style="padding:10px 14px; border:1px solid #0A2540; text-align:left; font-weight:700;">إجمالي الدائن</th>
            </tr>
          </thead>
          <tbody>
            ${(reportData.allAccounts || [])
              .map(
                (acc, idx) => `
              <tr style="background-color:${idx % 2 === 1 ? "#F8FAFC" : "#FFFFFF"};">
                <td style="padding:9px 14px; border:1px solid #E0E6ED; font-family:monospace; font-weight:bold; color:#1A2B4C;">${acc.code}</td>
                <td style="padding:9px 14px; border:1px solid #E0E6ED; font-weight:600; color:#1A2B4C;">${acc.nameAr}</td>
                <td style="padding:9px 14px; border:1px solid #E0E6ED; text-align:left; font-family:monospace; color:#1A2B4C;">
                  ${acc.currentBalance >= 0 ? formatNumberOnly(acc.currentBalance) : "-"}
                </td>
                <td style="padding:9px 14px; border:1px solid #E0E6ED; text-align:left; font-family:monospace; color:#1A2B4C;">
                  ${acc.currentBalance < 0 ? formatNumberOnly(Math.abs(acc.currentBalance)) : "-"}
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr style="background-color:#F1F5F9; font-weight:700; font-size:15px;">
              <td colspan="2" style="padding:10px 14px; border:1px solid #E0E6ED; color:#0A2540;">الإجمالي المالي الموزون:</td>
              <td style="padding:10px 14px; border:1px solid #E0E6ED; text-align:left; font-family:monospace; color:#0A2540;">${formatNumberOnly(reportData.trialTotalDebit)}</td>
              <td style="padding:10px 14px; border:1px solid #E0E6ED; text-align:left; font-family:monospace; color:#0A2540;">${formatNumberOnly(reportData.trialTotalCredit)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  }

  container.innerHTML = `
    <!-- Header with Enterprise Logo -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #D4AF37; padding-bottom:14px; margin-bottom:16px;">
      <!-- Right Side: Arabic -->
      <div style="text-align:right;">
        <h1 style="margin:0; font-size:18px; font-weight:900; color:#0A2540; font-family:'Cairo', sans-serif;">🏢 مجموعة بن زياد التجارية المتحدة</h1>
        <div style="font-size:13px; font-weight:bold; color:#4A5B6F; margin-top:4px; font-family:'Cairo', sans-serif;">مواد بناء ومواد زراعية - العنوان: الكندوي، حمر، عمران</div>
        <div style="font-size:12px; color:#4A5B6F; margin-top:2px; font-family:'Cairo', sans-serif;">للتواصل: 0967773586047 + 715779976</div>
      </div>
      
      <!-- Middle: Logo -->
      <div style="text-align:center; flex-shrink:0;">
        <div style="background-color:#0A2540; color:#D4AF37; width:62px; height:62px; border-radius:12px; font-weight:900; font-size:14px; display:flex; flex-direction:column; align-items:center; justify-content:center; margin:0 auto; border:2px solid #D4AF37;">
          <span style="font-size:12px; font-family:monospace;">MDOtkBZ</span>
          <span style="font-size:8px; color:rgba(212, 175, 55, 0.9);">بن زياد</span>
        </div>
      </div>

      <!-- Left Side: English -->
      <div style="text-align:left; direction:ltr;">
        <h2 style="margin:0; font-size:14px; font-weight:900; color:#0A2540; font-family:'Cairo', sans-serif;">Bin Ziad United Commercial Group</h2>
        <div style="font-size:11px; color:#4A5B6F; margin-top:3px; font-family:'Cairo', sans-serif;"><b>Reference No:</b> ${reportType}-${fiscalYear}</div>
        <div style="font-size:11px; color:#4A5B6F; margin-top:2px; font-family:'Cairo', sans-serif;"><b>Date:</b> ${todayDate.split(" ")[0]}</div>
      </div>
    </div>

    <!-- Report Title Bar -->
    <div style="background-color:#0A2540; color:#FFFFFF; border-radius:10px; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <div>
        <div style="font-size:12px; color:#B0C4DE;">اسم التقرير المالي الختامي:</div>
        <div style="font-size:23px; font-weight:700; color:#FFFFFF; margin-top:2px; font-family:'Cairo', sans-serif;">${reportTitle}</div>
      </div>
      <div style="text-align:left;" dir="ltr">
        <div style="font-size:14px; color:#FFFFFF;">السنة المالية: <b>${fiscalYear}</b></div>
        <div style="font-size:12px; color:#D4AF37; margin-top:2px;" dir="rtl">تاريخ التصدير: <b>${todayDate}</b></div>
      </div>
    </div>

    ${bodyContentHtml}

    <!-- Official Signatures Footer -->
    <div style="margin-top:36px; border-top:2px solid #E0E6ED; padding-top:20px; display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px; text-align:center; font-size:14.5px;">
      <div>
        <div style="font-weight:600; color:#0A2540;">رئيس قسم المحاسبة العامة</div>
        <div style="margin-top:30px; border-bottom:1px dashed #94A3B8; padding-bottom:4px; color:#4A5B6F;">___________________</div>
      </div>
      <div>
        <div style="font-weight:600; color:#0A2540;">المدير المالي والتنفيذي (CFO)</div>
        <div style="margin-top:30px; border-bottom:1px dashed #94A3B8; padding-bottom:4px; color:#4A5B6F;">___________________</div>
      </div>
      <div>
        <div style="font-weight:600; color:#0A2540;">الختم الرسمي للمؤسسة</div>
        <div style="margin-top:30px; font-weight:bold; font-size:13px; color:#D4AF37;">مجموعة بن زياد التجارية المتحدة</div>
      </div>
    </div>
    
    <!-- Footer (11-12px Light) -->
    <div style="margin-top:28px; text-align:center; font-size:11.5px; font-weight:300; color:#6B7A8F; border-top:1px solid #E0E6ED; padding-top:10px; line-height:1.6;">
      <div>© 2026 ميدو تك وبن زياد المتحدة | MeDo ERP</div>
      <div>نظام المحاسبة والإدارة المتكامل</div>
    </div>
  `;

  document.body.appendChild(container);
  const success = await exportElementToPdf("temp-report-pdf-container", filename);
  document.body.removeChild(container);

  return success;
}
