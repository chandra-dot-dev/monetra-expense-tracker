import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { FileText, Download, Printer, AlertTriangle } from "lucide-react";
import { LayoutContextType } from "../components/Layout";
import api from "../utils/api";
import { exportToExcel } from "../utils/exportUtils";

const ReportsPage = () => {
  const { transactions = [] } = useOutletContext<LayoutContextType>();
  const [downloading, setDownloading] = useState(false);

  const stats = useMemo(() => {
    let incomeSum = 0;
    let expenseSum = 0;
    let taxEstimate = 0;

    transactions.forEach((t) => {
      if (t.type === "income") {
        incomeSum += t.amount;
      } else {
        expenseSum += t.amount;
      }
    });

    // Mock 15% tax deduction estimate
    taxEstimate = incomeSum * 0.15;

    return {
      incomeSum,
      expenseSum,
      taxEstimate,
      savings: incomeSum - expenseSum
    };
  }, [transactions]);

  const handleDownloadExcel = async (type: "all" | "income" | "expense") => {
    try {
      setDownloading(true);
      const endpoint = type === "all" 
        ? "/income/downloadexcel" // fall back or unified endpoint
        : type === "income" 
          ? "/income/downloadexcel" 
          : "/expense/downloadexcel";

      const res = await api.get(endpoint, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: res.headers["content-type"] ? String(res.headers["content-type"]) : "application/octet-stream",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `monetra_report_${type}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error, running client fallbacks:", err);
      // Fallback exporter
      const dataToExport = transactions
        .filter((t) => type === "all" || t.type === type)
        .map((t) => ({
          Date: new Date(t.date).toLocaleDateString(),
          Description: t.description,
          Category: t.category,
          Amount: t.amount,
          Type: t.type === "income" ? "Income" : "Expense"
        }));
      exportToExcel(dataToExport, `monetra_${type}_report`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto p-4 md:p-6 text-text-app">
      {/* Header Container */}
      <div className="bg-surface-app rounded-lg p-5 border border-border-app mb-4">
        <h1 className="text-xl font-semibold tracking-tight text-text-app">Reports & Exports</h1>
        <p className="text-xs text-muted-app">Compile statements and export raw transaction data points</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Export triggers card */}
        <div className="lg:col-span-2 bg-surface-app border border-border-app rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 pb-2 border-b border-border-app flex items-center gap-2">
            <FileText size={14} /> Download Statements
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Unified Export */}
            <div className="bg-bg-app border border-border-app rounded-lg p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-xs text-text-app">Combined Cash Ledger</h4>
                <p className="text-[10px] text-muted-app mt-0.5">XLSX workbook of all transactions</p>
              </div>
              <button
                onClick={() => handleDownloadExcel("all")}
                disabled={downloading}
                className="mt-4 flex items-center justify-center gap-2 bg-text-app text-bg-app py-1.5 rounded-md text-xs font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                <Download size={12} /> {downloading ? "Compiling..." : "Export Excel"}
              </button>
            </div>

            {/* Income Workbook */}
            <div className="bg-bg-app border border-border-app rounded-lg p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-xs text-text-app">Inflows Workbook</h4>
                <p className="text-[10px] text-muted-app mt-0.5">XLSX workbook tracking income sources</p>
              </div>
              <button
                onClick={() => handleDownloadExcel("income")}
                className="mt-4 flex items-center justify-center gap-2 bg-bg-app border border-border-app text-text-app py-1.5 rounded-md text-xs font-medium hover:bg-surface-app cursor-pointer"
              >
                <Download size={12} /> Export Inflow
              </button>
            </div>

            {/* Expense Workbook */}
            <div className="bg-bg-app border border-border-app rounded-lg p-4 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-xs text-text-app">Outflows Workbook</h4>
                <p className="text-[10px] text-muted-app mt-0.5">XLSX workbook tracking category costs</p>
              </div>
              <button
                onClick={() => handleDownloadExcel("expense")}
                className="mt-4 flex items-center justify-center gap-2 bg-bg-app border border-border-app text-text-app py-1.5 rounded-md text-xs font-medium hover:bg-surface-app cursor-pointer"
              >
                <Download size={12} /> Export Outflow
              </button>
            </div>
          </div>
        </div>

        {/* Taxes/Summary box */}
        <div className="lg:col-span-1 bg-surface-app border border-border-app rounded-lg p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-3 pb-2 border-b border-border-app flex items-center gap-2">
              <Printer size={14} /> Briefing
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-app">Gross Earnings</span>
                <span className="font-semibold text-text-app">${stats.incomeSum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-app">Gross Expenditures</span>
                <span className="font-semibold text-text-app">${stats.expenseSum.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-border-app pt-2 font-medium">
                <span className="text-text-app">Net Cashflow</span>
                <span className="font-semibold text-text-app">${stats.savings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-border-app pt-2 text-[10px] text-muted-app">
                <span className="flex items-center gap-1"><AlertTriangle size={10} /> Tax Estimate (15%)</span>
                <span>${stats.taxEstimate.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full mt-6 bg-bg-app border border-border-app text-text-app py-2 rounded-md text-xs font-semibold hover:bg-surface-app flex items-center justify-center gap-2"
          >
            <Printer size={12} /> Print Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
