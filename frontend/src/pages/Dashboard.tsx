import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  TrendingUp, 
  ArrowDown, 
  DollarSign, 
  Plus, 
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  TrendingDown,
  Calendar,
  Layers
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell
} from "recharts";
import api from "../utils/api";
import FinancialCard from "../components/FinancialCard";
import AddTransactionModal, { NewTransactionState } from "../components/AddTransactionModal";
import TransactionItem from "../components/TransactionItem";
import { getTimeFrameRange, generateChartPoints, Transaction } from "../components/Helpers";
import { CATEGORY_ICONS, CATEGORY_ICONS_Inc } from "../assets/color";
import { dashboardStyles, styles } from "../assets/dummyStyles";
import { LayoutContextType } from "../components/Layout";
import { useTheme } from "../context/ThemeContext";

function toIsoWithClientTime(dateValue: string) {
  if (!dateValue) return new Date().toISOString();

  if (typeof dateValue === "string" && dateValue.length === 10) {
    const now = new Date();
    const hhmmss = now.toTimeString().slice(0, 8);
    const combined = new Date(`${dateValue}T${hhmmss}`);
    return combined.toISOString();
  }

  try {
    return new Date(dateValue).toISOString();
  } catch (err) {
    return new Date().toISOString();
  }
}

const Dashboard = () => {
  const { theme } = useTheme();
  const { 
    transactions: outletTransactions = [], 
    timeFrame = "monthly", 
    setTimeFrame = () => {},
    refreshTransactions 
  } = useOutletContext<LayoutContextType>();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [newTransaction, setNewTransaction] = useState<NewTransactionState>({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    type: "expense",
    category: "Food",
  });

  const [editForm, setEditForm] = useState({
    description: "",
    amount: "" as string | number,
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    type: "expense" as "income" | "expense",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const timeFrameRange = useMemo(() => getTimeFrameRange(timeFrame), [timeFrame]);
  const chartPoints = useMemo(() => generateChartPoints(timeFrame), [timeFrame]);

  const isDateInRange = useCallback((dateStr: string, start: Date, end: Date) => {
    const transactionDate = new Date(dateStr);
    const startDate = new Date(start);
    const endDate = new Date(end);
    transactionDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    return transactionDate >= startDate && transactionDate <= endDate;
  }, []);

  // Filtered transactions for the current period
  const periodTransactions = useMemo(
    () => (outletTransactions || []).filter((t) => 
      isDateInRange(t.date, timeFrameRange.start, timeFrameRange.end)
    ),
    [outletTransactions, timeFrameRange, isDateInRange]
  );

  // Compute values
  const totals = useMemo(() => {
    let income = 0;
    let expenses = 0;
    periodTransactions.forEach((t) => {
      if (t.type === "income") {
        income += t.amount;
      } else {
        expenses += t.amount;
      }
    });
    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [periodTransactions]);

  // Combined Search and Filter list
  const filteredTransactions = useMemo(() => {
    return periodTransactions.filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || t.category.toLowerCase() === categoryFilter.toLowerCase();
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [periodTransactions, searchQuery, typeFilter, categoryFilter]);

  // Unique categories in the current period for filtering
  const periodCategories = useMemo(() => {
    const cats = new Set<string>();
    periodTransactions.forEach((t) => cats.add(t.category));
    return Array.from(cats);
  }, [periodTransactions]);

  // Chart Data: Group incomes & expenses for each timeframe point
  const chartData = useMemo(() => {
    const data = chartPoints.map((point) => ({
      ...point,
      income: 0,
      expense: 0
    }));

    periodTransactions.forEach((transaction) => {
      const transDate = new Date(transaction.date);
      const point = data.find((d) =>
        timeFrame === "daily"
          ? d.hour === transDate.getHours()
          : timeFrame === "yearly"
            ? d.date.getMonth() === transDate.getMonth()
            : d.date.getDate() === transDate.getDate() &&
              d.date.getMonth() === transDate.getMonth()
      );
      if (point) {
        if (transaction.type === "income") {
          point.income += Math.round(Number(transaction.amount));
        } else {
          point.expense += Math.round(Number(transaction.amount));
        }
      }
    });

    return data;
  }, [periodTransactions, chartPoints, timeFrame]);

  // Generate sparkline trend datasets based on actual ledger history
  const sparklines = useMemo(() => {
    const defaultData = Array.from({ length: 8 }, (_, i) => ({ value: 10 + i * 2 }));
    if (outletTransactions.length === 0) {
      return { balance: defaultData, income: defaultData, expense: defaultData };
    }

    const sorted = [...outletTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const segments = 8;
    const segmentSize = Math.max(Math.ceil(sorted.length / segments), 1);
    
    const balancePoints: { value: number }[] = [];
    const incomePoints: { value: number }[] = [];
    const expensePoints: { value: number }[] = [];
    
    let cumBalance = 0;
    for (let i = 0; i < segments; i++) {
      const startIdx = i * segmentSize;
      const endIdx = Math.min(startIdx + segmentSize, sorted.length);
      const segmentTx = sorted.slice(startIdx, endIdx);
      
      let segIncome = 0;
      let segExpense = 0;
      
      segmentTx.forEach(tx => {
        if (tx.type === "income") {
          cumBalance += tx.amount;
          segIncome += tx.amount;
        } else {
          cumBalance -= tx.amount;
          segExpense += tx.amount;
        }
      });

      balancePoints.push({ value: cumBalance });
      incomePoints.push({ value: segIncome });
      expensePoints.push({ value: segExpense });
    }

    return {
      balance: balancePoints,
      income: incomePoints,
      expense: expensePoints
    };
  }, [outletTransactions]);

  const handleAddTransaction = async () => {
    if (!newTransaction.description || !newTransaction.amount) return;
    try {
      setLoading(true);
      const payload = {
        description: newTransaction.description.trim(),
        amount: parseFloat(newTransaction.amount),
        type: newTransaction.type,
        category: newTransaction.category,
        date: toIsoWithClientTime(newTransaction.date),
      };

      const endpoint = payload.type === "income" ? "/income/add" : "/expense/add";
      await api.post(endpoint, payload);
      await refreshTransactions();

      setNewTransaction({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: "",
        type: "expense",
        category: "Food",
      });
      setShowModal(false);
    } catch (err: any) {
      console.error("Dashboard add error:", err);
      alert(err.response?.data?.message || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = async () => {
    if (!editingId || !editForm.description || !editForm.amount) return;
    try {
      setLoading(true);
      const payload = {
        description: editForm.description.trim(),
        amount: parseFloat(String(editForm.amount)),
        category: editForm.category,
        date: toIsoWithClientTime(editForm.date),
      };

      const endpoint = editForm.type === "income" ? `/income/update/${editingId}` : `/expense/update/${editingId}`;
      await api.put(endpoint, payload);
      await refreshTransactions();
      setEditingId(null);
    } catch (err: any) {
      console.error("Dashboard edit error:", err);
      alert(err.response?.data?.message || "Failed to edit transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string, type: "income" | "expense") => {
    if (!id || !window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      setLoading(true);
      const endpoint = type === "income" ? `/income/delete/${id}` : `/expense/delete/${id}`;
      await api.delete(endpoint);
      await refreshTransactions();
    } catch (err: any) {
      console.error("Dashboard delete error:", err);
      alert(err.response?.data?.message || "Failed to delete transaction");
    } finally {
      setLoading(false);
    }
  };

  const gridColor = "var(--color-border-app)";
  const labelColor = "var(--color-muted-app)";

  return (
    <div className={dashboardStyles.container}>
      {/* Top Header Card */}
      <div className={dashboardStyles.headerContainer}>
        <div className={dashboardStyles.headerContent}>
          <div className="space-y-1">
            <h1 className="text-lg font-semibold tracking-tight text-text-app">Dashboard</h1>
            <p className="text-xs text-muted-app">Real-time ledger overview and analytics</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setLoading(true);
                refreshTransactions().finally(() => setLoading(false));
              }}
              className="p-1.5 bg-bg-app border border-border-app hover:bg-surface-app text-text-app rounded-md transition-all cursor-pointer flex items-center justify-center"
              title="Refresh Stats"
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setShowModal(true)}
              className={dashboardStyles.addButton}
              disabled={loading}
            >
              <Plus size={14} /> Add Transaction
            </button>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className={dashboardStyles.timeFrameContainer}>
          <div className={dashboardStyles.timeFrameWrapper}>
            {["daily", "weekly", "monthly", "yearly"].map((frame) => (
              <button
                key={frame}
                onClick={() => setTimeFrame(frame)}
                className={dashboardStyles.timeFrameButton(timeFrame === frame)}
              >
                {frame.charAt(0).toUpperCase() + frame.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <FinancialCard
          label="Net Cashflow"
          value={`$${totals.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sparklineData={sparklines.balance}
          percentageChange="6.4%"
          trendType={totals.balance >= 0 ? "positive" : "negative"}
          additionalContent={
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--color-gold-hex)]" />
              <span>For the selected {timeFrame} period</span>
            </div>
          }
          icon={<Layers className="w-4 h-4 text-[var(--color-gold-hex)]" />}
        />
        <FinancialCard
          label="Total Revenue"
          value={`$${totals.income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sparklineData={sparklines.income}
          percentageChange="11.2%"
          trendType="positive"
          additionalContent={
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#5E7A68]" />
              <span>Earnings ledger summation</span>
            </div>
          }
          icon={<TrendingUp className="w-4 h-4 text-[#5E7A68]" />}
        />
        <FinancialCard
          label="Total Spent"
          value={`$${totals.expenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          sparklineData={sparklines.expense}
          percentageChange="3.8%"
          trendType="negative"
          additionalContent={
            <div className="flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-[#9B5B57]" />
              <span>Outbound cost summaries</span>
            </div>
          }
          icon={<TrendingDown className="w-4 h-4 text-[#9B5B57]" />}
        />
      </div>

      {/* Visual Chart Component */}
      <div className="bg-surface-app border border-border-app rounded-2xl p-6 mb-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 border-b border-border-app pb-3">
          <h3 className="text-base font-serif font-semibold tracking-tight text-text-app flex items-center gap-2">
            Activity Summary
            <span className="text-[10px] lowercase font-normal font-sans text-muted-app">({timeFrameRange.label})</span>
          </h3>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              barGap={4}
            >
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5E7A68" stopOpacity={0.95}/>
                  <stop offset="100%" stopColor="#5E7A68" stopOpacity={0.35}/>
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9B5B57" stopOpacity={0.95}/>
                  <stop offset="100%" stopColor="#9B5B57" stopOpacity={0.35}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: labelColor, fontSize: 10 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: labelColor, fontSize: 10 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={dashboardStyles.tooltipContent}
                itemStyle={{ fontSize: 11, padding: '2px 0' }}
                cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconSize={8}
                iconType="circle"
                wrapperStyle={{ fontSize: 10, paddingBottom: 15, color: labelColor }}
              />
              <Bar 
                dataKey="income" 
                name="Income" 
                fill="url(#incomeGrad)" 
                radius={[4, 4, 0, 0]} 
                barSize={10}
              />
              <Bar 
                dataKey="expense" 
                name="Expenses" 
                fill="url(#expenseGrad)" 
                radius={[4, 4, 0, 0]} 
                barSize={10}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Unified Transactions Table List */}
      <div className="bg-surface-app border border-border-app rounded-lg p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-3 border-b border-border-app">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-app">Ledger Journal</h3>
            <p className="text-[10px] text-muted-app mt-0.5">Filter and search compiled expenses and revenues</p>
          </div>
          
          {/* Controls: Search and filter selectors */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:flex-none">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-muted-app">
                <Search size={12} />
              </span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-44 pl-7 pr-3 py-1.5 bg-bg-app border border-border-app rounded-md text-xs text-text-app placeholder-muted-app focus:outline-none focus:ring-1 focus:ring-zinc-400 focus:border-zinc-400"
              />
            </div>

            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={(e: any) => setTypeFilter(e.target.value)}
              className="bg-bg-app border border-border-app rounded-md px-2.5 py-1.5 text-xs text-text-app focus:outline-none focus:ring-1 focus:ring-zinc-400"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>

            {/* Category selector */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-bg-app border border-border-app rounded-md px-2.5 py-1.5 text-xs text-text-app focus:outline-none focus:ring-1 focus:ring-zinc-400"
            >
              <option value="all">All Categories</option>
              {periodCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Transactions Stack */}
        <div className="space-y-2">
          {filteredTransactions
            .slice(0, showAllTransactions ? filteredTransactions.length : 6)
            .map((transaction) => {
              const icons = transaction.type === "income" ? CATEGORY_ICONS_Inc : CATEGORY_ICONS;
              return (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  isEditing={editingId === transaction.id}
                  editForm={editForm}
                  setEditForm={setEditForm as any}
                  onSave={handleEditTransaction}
                  onCancel={() => setEditingId(null)}
                  onDelete={(id) => handleDeleteTransaction(id, transaction.type)}
                  type={transaction.type}
                  categoryIcons={icons}
                  setEditingId={setEditingId}
                />
              );
            })}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-xs text-muted-app bg-bg-app border border-border-app rounded-md">
              No transactions match the selected filters or timeframe.
            </div>
          )}

          {filteredTransactions.length > 6 && (
            <div className="pt-3 border-t border-border-app mt-2">
              <button 
                onClick={() => setShowAllTransactions(!showAllTransactions)}
                className="w-full flex items-center justify-center gap-1.5 py-2 border border-border-app hover:bg-bg-app text-muted-app hover:text-text-app text-[11px] font-medium rounded-md transition-all cursor-pointer"
              >
                {showAllTransactions ? "Show Less" : `View All Transactions (${filteredTransactions.length})`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AddTransactionModal
        showModal={showModal}
        setShowModal={setShowModal}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        handleAddTransaction={handleAddTransaction}
        loading={loading}
        type="both"
        title="New Transaction"
        buttonText="Create Transaction"
      />
    </div>
  );
};

export default Dashboard;
