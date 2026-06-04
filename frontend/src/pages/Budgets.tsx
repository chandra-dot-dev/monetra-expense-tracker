import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Wallet, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { LayoutContextType } from "../components/Layout";
import FinancialCard from "../components/FinancialCard";

interface BudgetConfig {
  category: string;
  limit: number;
}

const DEFAULT_BUDGETS: BudgetConfig[] = [
  { category: "Food", limit: 400 },
  { category: "Housing", limit: 1200 },
  { category: "Transport", limit: 250 },
  { category: "Shopping", limit: 300 },
  { category: "Entertainment", limit: 200 },
  { category: "Utilities", limit: 150 },
  { category: "Healthcare", limit: 100 },
];

const BudgetsPage = () => {
  const { transactions = [] } = useOutletContext<LayoutContextType>();
  const [budgets, setBudgets] = useState<BudgetConfig[]>(DEFAULT_BUDGETS);
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: "Food", limit: "" });

  // Sum expenses in each category for the current period
  const expensesByCategory = useMemo(() => {
    const sums: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.type === "expense") {
        sums[t.category] = (sums[t.category] || 0) + t.amount;
      }
    });
    return sums;
  }, [transactions]);

  const budgetSummary = useMemo(() => {
    let totalLimits = 0;
    let totalSpent = 0;
    let limitCount = 0;
    let overLimitCount = 0;

    budgets.forEach((b) => {
      const spent = expensesByCategory[b.category] || 0;
      totalLimits += b.limit;
      totalSpent += spent;
      limitCount++;
      if (spent > b.limit) {
        overLimitCount++;
      }
    });

    return { totalLimits, totalSpent, limitCount, overLimitCount };
  }, [budgets, expensesByCategory]);

  const handleAddBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudget.limit || Number(newBudget.limit) <= 0) return;
    const limitNum = Number(newBudget.limit);

    setBudgets((prev) => {
      const index = prev.findIndex((b) => b.category === newBudget.category);
      if (index !== -1) {
        const copy = [...prev];
        copy[index] = { ...copy[index], limit: limitNum };
        return copy;
      }
      return [...prev, { category: newBudget.category, limit: limitNum }];
    });

    setNewBudget({ category: "Food", limit: "" });
    setShowAddBudget(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 text-text-app">
      {/* Header Container */}
      <div className="bg-surface-app rounded-2xl p-6 border border-border-app mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-text-app">Budgets</h1>
            <p className="text-xs text-muted-app mt-0.5">Configure and track monthly category expenditures</p>
          </div>
          <button
            onClick={() => setShowAddBudget(!showAddBudget)}
            className="flex items-center gap-2 bg-[var(--color-gold-hex)] hover:bg-[var(--color-gold-hover-hex)] text-[#FAF9F6] dark:text-[#0F0F11] px-4 py-2.5 rounded-xl transition-all duration-150 text-xs font-semibold cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <Plus size={14} /> Adjust Limits
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <FinancialCard
          label="Budget Allocated"
          value={`$${budgetSummary.totalLimits.toLocaleString()}`}
          additionalContent={<span>Aggregate threshold configured</span>}
        />
        <FinancialCard
          label="Total Expended"
          value={`$${budgetSummary.totalSpent.toLocaleString()}`}
          additionalContent={
            <div className="flex items-center gap-1 font-sans">
              <span>{Math.round((budgetSummary.totalSpent / (budgetSummary.totalLimits || 1)) * 100)}% consumed</span>
            </div>
          }
        />
        <FinancialCard
          label="Limit Triggers"
          value={budgetSummary.overLimitCount}
          additionalContent={
            <div className="flex items-center gap-1 font-sans">
              {budgetSummary.overLimitCount > 0 ? (
                <span className="text-[#9B5B57] flex items-center gap-1 font-semibold">
                  <AlertCircle size={12} /> {budgetSummary.overLimitCount} items exceeded
                </span>
              ) : (
                <span className="text-[#5E7A68] flex items-center gap-1 font-semibold">
                  <CheckCircle size={12} /> Under limits
                </span>
              )}
            </div>
          }
        />
      </div>

      {/* Adjust Budget form overlay */}
      {showAddBudget && (
        <div className="bg-surface-app rounded-2xl p-6 border border-border-app mb-6 shadow-xs animate-fadeIn">
          <h3 className="text-base font-serif font-semibold tracking-tight text-text-app mb-4 pb-2 border-b border-border-app">Set Budget Limit</h3>
          <form onSubmit={handleAddBudgetSubmit} className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-muted-app uppercase tracking-widest font-sans mb-1.5">Category</label>
              <select
                value={newBudget.category}
                onChange={(e) => setNewBudget((prev) => ({ ...prev, category: e.target.value }))}
                className="bg-bg-app border border-border-app rounded-xl px-4 py-2.5 text-xs text-text-app focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)] cursor-pointer min-w-[150px] font-sans font-medium"
              >
                {["Food", "Housing", "Transport", "Shopping", "Entertainment", "Utilities", "Healthcare", "Other"].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-muted-app uppercase tracking-widest font-sans mb-1.5">Monthly Limit ($)</label>
              <input
                type="number"
                placeholder="e.g. 500"
                required
                value={newBudget.limit}
                onChange={(e) => setNewBudget((prev) => ({ ...prev, limit: e.target.value }))}
                className="px-4 py-2.5 bg-bg-app border border-border-app rounded-xl text-xs text-text-app focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)] font-sans w-full max-w-[200px]"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[var(--color-gold-hex)] hover:bg-[var(--color-gold-hover-hex)] text-[#FAF9F6] dark:text-[#0F0F11] px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-all duration-150"
              >
                Apply Limit
              </button>
              <button
                type="button"
                onClick={() => setShowAddBudget(false)}
                className="px-4 py-2.5 border border-border-app text-text-app rounded-xl text-xs font-semibold hover:bg-bg-app cursor-pointer transition-all duration-150"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Progress limits */}
      <div className="bg-surface-app rounded-2xl p-6 border border-border-app shadow-xs">
        <h3 className="text-base font-serif font-semibold tracking-tight text-text-app mb-4 pb-2 border-b border-border-app flex items-center gap-2">
          <Wallet size={14} className="text-[var(--color-gold-hex)]" /> Category Spend Progress
        </h3>
        
        <div className="space-y-4">
          {budgets.map((b) => {
            const spent = expensesByCategory[b.category] || 0;
            const percentage = Math.min((spent / b.limit) * 100, 100);
            const isOver = spent > b.limit;

            return (
              <div key={b.category} className="space-y-2">
                <div className="flex justify-between items-center text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-app">{b.category}</span>
                    {isOver && (
                      <span className="px-2 py-0.5 bg-[#9B5B57]/10 text-[#9B5B57] border border-[#9B5B57]/20 text-[9px] font-bold rounded-md">
                        Limit Exceeded
                      </span>
                    )}
                  </div>
                  <div className="text-muted-app">
                    <span className="font-semibold text-text-app">${spent.toLocaleString()}</span>
                    <span> / ${b.limit} limit</span>
                  </div>
                </div>

                {/* Progress bar gauge */}
                <div className="w-full bg-bg-app border border-border-app h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${isOver ? "bg-[#9B5B57]" : "bg-[var(--color-gold-hex)]"}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetsPage;
