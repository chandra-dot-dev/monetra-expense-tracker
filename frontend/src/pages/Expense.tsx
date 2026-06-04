import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Plus,
  DollarSign,
  Download,
  Eye,
  Calendar,
  TrendingDown,
  Filter,
  BarChart2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import api from "../utils/api";
import { exportToExcel } from "../utils/exportUtils";
import FinancialCard from "../components/FinancialCard";
import TimeFrameSelector from "../components/TimeFrame";
import TransactionItem from "../components/TransactionItem";
import AddTransactionModal, { NewTransactionState } from "../components/AddTransactionModal";
import { getTimeFrameRange, generateChartPoints, Transaction } from "../components/Helpers";
import { CATEGORY_ICONS } from "../assets/color";
import { expensePageStyles as styles } from "../assets/dummyStyles";
import { LayoutContextType } from "../components/Layout";
import { useTheme } from "../context/ThemeContext";

function toIsoWithClientTime(dateValue: string) {
  if (!dateValue) {
    return new Date().toISOString();
  }

  if (typeof dateValue === "string" && dateValue.length === 10) {
    const now = new Date();
    const hhmmss = now.toTimeString().slice(0, 8); // "HH:MM:SS"
    const combined = new Date(`${dateValue}T${hhmmss}`);
    return combined.toISOString();
  }

  try {
    return new Date(dateValue).toISOString();
  } catch (err) {
    return new Date().toISOString();
  }
}

interface ExpenseOverviewState {
  totalExpense: number;
  averageExpense: number;
  numberOfTransactions: number;
  recentTransactions: any[];
  range: string;
}

const ExpensePage = () => {
  const { theme } = useTheme();
  const { 
    transactions: outletTransactions = [], 
    timeFrame = "monthly", 
    setTimeFrame = () => {},
    refreshTransactions 
  } = useOutletContext<LayoutContextType>();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState<{
    description: string;
    amount: string | number;
    category: string;
    date: string;
    type: "income" | "expense";
  }>({
    description: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
  });
  const [newTransaction, setNewTransaction] = useState<NewTransactionState>({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    type: "expense",
    category: "Food",
  });
  const [overview, setOverview] = useState<ExpenseOverviewState>({
    totalExpense: 0,
    averageExpense: 0,
    numberOfTransactions: 0,
    recentTransactions: [],
    range: "monthly",
  });

  const fetchOverview = useCallback(async (range = timeFrame ?? "monthly") => {
    try {
      const res = await api.get("/expense/overview", {
        params: { range },
      });
      const payload = res.data?.data ?? {};
      setOverview({
        totalExpense: payload.totalExpense ?? 0,
        averageExpense: payload.averageExpense ?? 0,
        numberOfTransactions: payload.numberOfTransactions ?? 0,
        recentTransactions: payload.recentTransactions ?? [],
        range: payload.range ?? range,
      });
    } catch (err) {
      console.error("Failed to fetch expense overview:", err);
    }
  }, [timeFrame]);

  useEffect(() => {
    fetchOverview(timeFrame);
  }, [fetchOverview, timeFrame]);

  useEffect(() => {
    if (filter === "month" && !timeFrame) setTimeFrame("monthly");
    fetchOverview(timeFrame);
  }, [timeFrame, selectedMonth, filter, setTimeFrame, fetchOverview]);

  const timeFrameRange = useMemo(
    () => getTimeFrameRange(timeFrame),
    [timeFrame]
  );
  const chartPoints = useMemo(
    () => generateChartPoints(timeFrame),
    [timeFrame]
  );

  const isDateInRange = useCallback((dateStr: string, start: Date, end: Date) => {
    const transactionDate = new Date(dateStr);
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    transactionDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    
    return transactionDate >= startDate && transactionDate <= endDate;
  }, []);

  const expenseTransactions = useMemo(
    () => (outletTransactions || [])
      .filter(t => t.type === "expense")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [outletTransactions]
  );

  const timeFrameTransactions = useMemo(
    () => expenseTransactions.filter(t => 
      isDateInRange(t.date, timeFrameRange.start, timeFrameRange.end)
    ),
    [expenseTransactions, timeFrameRange, isDateInRange]
  );

  const filteredTransactions = useMemo(() => {
    if (filter === "all") return timeFrameTransactions;

    const now = new Date();
    const yearFromSelectedMonth = selectedMonth ? new Date(selectedMonth).getFullYear() : null;
    const monthFromSelectedMonth = selectedMonth ? new Date(selectedMonth).getMonth() : null;
    const yearFromTimeFrame = timeFrameRange?.start ? new Date(timeFrameRange.start).getFullYear() : null;
    const monthFromTimeFrame = timeFrameRange?.start ? new Date(timeFrameRange.start).getMonth() : null;

    return timeFrameTransactions.filter(t => {
      const transDate = new Date(t.date);
      
      if (filter === "month") {
        const compareYear = yearFromSelectedMonth ?? yearFromTimeFrame ?? now.getFullYear();
        const compareMonth = monthFromSelectedMonth ?? monthFromTimeFrame ?? now.getMonth();
        return transDate.getFullYear() === compareYear && transDate.getMonth() === compareMonth;
      }

      if (filter === "year") {
        const compareYear = yearFromSelectedMonth ?? yearFromTimeFrame ?? now.getFullYear();
        return transDate.getFullYear() === compareYear;
      }

      return t.category.toLowerCase() === filter.toLowerCase();
    });
  }, [timeFrameTransactions, filter, selectedMonth, timeFrameRange]);

  const totalExpense = useMemo(
    () => filteredTransactions.reduce((sum, t) => sum + Math.round(Number(t.amount || 0)), 0),
    [filteredTransactions]
  );
  
  const averageExpense = useMemo(
    () => filteredTransactions.length ? Math.round(totalExpense / filteredTransactions.length) : 0,
    [filteredTransactions, totalExpense]
  );

  const chartData = useMemo(() => {
    const data = chartPoints.map(point => ({ ...point, expense: 0 }));

    filteredTransactions.forEach(transaction => {
      const transDate = new Date(transaction.date);
      const point = data.find(d =>
        timeFrame === "daily"
          ? d.hour === transDate.getHours()
          : timeFrame === "yearly"
          ? d.date.getMonth() === transDate.getMonth()
          : d.date.getDate() === transDate.getDate() && d.date.getMonth() === transDate.getMonth()
      );
      if (point) {
        point.expense += Math.round(Number(transaction.amount));
      }
    });

    return data;
  }, [filteredTransactions, chartPoints, timeFrame]);

  const handleApiRequest = async (method: "post" | "put" | "delete", url: string, data: any = null) => {
    try {
      setLoading(true);
      let response;
      if (method === "post") {
        response = await api.post(url, data);
      } else if (method === "put") {
        response = await api.put(url, data);
      } else {
        response = await api.delete(url);
      }
      
      await refreshTransactions();
      await fetchOverview(timeFrame);
      
      return response;
    } catch (err: any) {
      console.error(`${method} request error:`, err);
      const serverMsg = err?.response?.data?.message;
      alert(serverMsg || `Server error while ${method === 'post' ? 'adding' : method === 'put' ? 'updating' : 'deleting'} expense.`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.description || !newTransaction.amount) return;

    try {
      const payload = {
        description: newTransaction.description.trim(),
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        date: toIsoWithClientTime(newTransaction.date),
      };

      await handleApiRequest('post', '/expense/add', payload);

      const addedDate = new Date(payload.date || newTransaction.date);
      const addedDateInRange = addedDate >= timeFrameRange.start && addedDate <= timeFrameRange.end;

      if (!addedDateInRange) {
        setTimeFrame("monthly");
        setSelectedMonth(new Date(addedDate.getFullYear(), addedDate.getMonth(), 1));
      }

      setNewTransaction({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: "",
        type: "expense",
        category: "Food",
      });
      setShowModal(false);
    } catch (err) {
      // Error handled in handleApiRequest
    }
  };

  const handleEditTransaction = async () => {
    if (!editingId || !editForm.description || !editForm.amount) return;

    try {
      const payload = {
        description: editForm.description.trim(),
        amount: parseFloat(String(editForm.amount)),
        category: editForm.category,
        date: toIsoWithClientTime(editForm.date),
      };

      await handleApiRequest('put', `/expense/update/${editingId}`, payload);
      setEditingId(null);
    } catch (err) {
      // Error handled in handleApiRequest
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!id || !window.confirm("Are you sure you want to delete this expense?")) return;
    await handleApiRequest('delete', `/expense/delete/${id}`);
  };

  const handleExport = async () => {
    try {
      const res = await api.get("/expense/downloadexcel", {
        responseType: "blob",
      });

      const blob = new Blob([res.data], {
        type: res.headers["content-type"] ? String(res.headers["content-type"]) : "application/octet-stream",
      });
      const disposition = res.headers["content-disposition"] ? String(res.headers["content-disposition"]) : undefined;
      let filename = "expense_details.xlsx";
      
      if (disposition) {
        const match = disposition.match(/filename="?(.+)"?/);
        if (match && match[1]) filename = match[1];
      }
      
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export error, running fallback frontend excel exporter:", err);
      try {
        const exportData = filteredTransactions.map(t => ({
          Date: new Date(t.date).toLocaleDateString(),
          Description: t.description,
          Category: t.category,
          Amount: t.amount,
          Type: "Expense",
        }));
        exportToExcel(exportData, `expenses_${new Date().toISOString().slice(0, 10)}`);
      } catch (e) {
        console.error("Fallback export failed:", e);
        alert("Failed to export data.");
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <div className={styles.headerContainer}>
          <div>
            <h1 className={styles.headerTitle}>Expense Overview</h1>
            <p className={styles.headerSubtitle}>Track and manage your expenses</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={`${styles.addButton} cursor-pointer`}
            disabled={loading}
          >
            <Plus size={20} /> {loading ? "Processing..." : "Add Expense"}
          </button>
        </div>

        <div className={styles.timeframePositioning}>
          <TimeFrameSelector
            timeFrame={timeFrame}
            setTimeFrame={(frame) => {
              setTimeFrame(frame);
              setSelectedMonth(null);
            }}
            options={["daily", "weekly", "monthly", "yearly"]}
            color="orange"
          />
        </div>
      </div>

      <div className={styles.cardsGrid}>
        <FinancialCard
          icon={<DollarSign className="w-4 h-4 text-text-app" />}
          label="Total Expenses"
          value={`$${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          additionalContent={
            <div className="flex items-center text-xs text-muted-app">
              <Calendar className="w-3 h-3 mr-1" /> {timeFrameRange.label}
            </div>
          }
        />

        <FinancialCard
          icon={<BarChart2 className="w-4 h-4 text-text-app" />}
          label="Average Expense"
          value={`$${averageExpense.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          additionalContent={
            <div className="flex items-center text-xs text-muted-app">
              <Calendar className="w-3 h-3 mr-1" /> {filteredTransactions.length} transactions
            </div>
          }
        />

        <FinancialCard
          icon={<TrendingDown className="w-4 h-4 text-text-app" />}
          label="Transactions"
          value={filteredTransactions.length}
          additionalContent={
            <div className="flex items-center text-xs text-muted-app">
              <Calendar className="w-3 h-3 mr-1" /> {filter === "all" ? "All records" : "Filtered records"}
            </div>
          }
        />
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <h3 className={styles.chartTitle}>
            <BarChart2 className="w-6 h-6 text-orange-500" />
            {timeFrame === "daily" ? "Hourly" : timeFrame === "yearly" ? "Monthly" : "Daily"} Expense Trends
            <span className="text-sm text-gray-500 font-normal"> ({timeFrameRange.label})</span>
          </h3>

          <button
            onClick={handleExport}
            className={`${styles.chartExportButton} cursor-pointer`}
          >
            <Download size={18} /> Export Data
          </button>
        </div>

        <div className={styles.chartHeight}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff9800" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff9800" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === "dark" ? "rgba(244, 244, 245, 0.08)" : "rgba(24, 24, 27, 0.08)"}
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme === "dark" ? "#a1a1aa" : "#71717a", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: theme === "dark" ? "#a1a1aa" : "#71717a", fontSize: 12 }}
                width={60}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                formatter={(value) => [`$${Math.round(Number(value)).toLocaleString()}`, "Expense"]}
                contentStyle={{
                  backgroundColor: theme === "dark" ? "rgba(24, 24, 27, 0.95)" : "rgba(255, 255, 255, 0.95)",
                  border: theme === "dark" ? "1px solid rgba(63, 63, 70, 0.4)" : "1px solid rgba(228, 228, 231, 0.8)",
                  borderRadius: "0.75rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                  padding: "8px 12px",
                  color: theme === "dark" ? "#f4f4f5" : "#18181b",
                }}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#ff9800"
                fill="url(#expenseGradient)"
                strokeWidth={2}
                activeDot={{ r: 6, fill: "#ff9800" }}
              />
              {chartData.map(
                (point, index) =>
                  point.isCurrent && (
                    <ReferenceLine
                      key={index}
                      x={point.label}
                      stroke="#ff5722"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                    />
                  )
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.transactionsContainer}>
        <div className={styles.transactionsHeader}>
          <h3 className={styles.transactionsTitle}>
            <DollarSign className="w-6 h-6 -mx-1.5 lg:-mx-2 md:-mx-0 text-orange-500" />
            Expense Transactions
            <span className="text-sm text-gray-500 font-normal"> ({timeFrameRange.label})</span>
          </h3>

          <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Transactions</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
                <option value="Food">Food</option>
                <option value="Housing">Housing</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              className={`${styles.exportButton} cursor-pointer`}
            >
              <Download size={18} /> Export
            </button>
          </div>
        </div>

        <div className={styles.transactionsList}>
          {filteredTransactions
            .slice(0, showAll ? filteredTransactions.length : 8)
            .map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                isEditing={editingId === transaction.id}
                editForm={editForm}
                setEditForm={setEditForm}
                onSave={handleEditTransaction}
                onCancel={() => setEditingId(null)}
                onDelete={handleDeleteTransaction}
                type="expense"
                categoryIcons={CATEGORY_ICONS}
                setEditingId={setEditingId}
              />
            ))}

          {!showAll && filteredTransactions.length > 8 && (
            <button
              onClick={() => setShowAll(true)}
              className={styles.viewAllButton}
            >
              <Eye size={18} /> View All {filteredTransactions.length} Transactions
            </button>
          )}

          {filteredTransactions.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <DollarSign className="w-8 h-8 text-orange-400" />
              </div>
              <p className={styles.emptyStateText}>No expense transactions found</p>
              <p className={styles.emptyStateSubtext}>
                {filter === "all" ? "You haven't recorded any expenses yet" : `No ${filter} transactions found`}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className={`${styles.addButton} cursor-pointer`}
              >
                <Plus size={20} /> Add Expense
              </button>
            </div>
          )}
        </div>
      </div>

      <AddTransactionModal
        showModal={showModal}
        setShowModal={setShowModal}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        handleAddTransaction={handleAddTransaction}
        loading={loading}
        type="expense"
        title="Add New Expense"
        buttonText="Add Expense"
        categories={[
          "Food",
          "Housing",
          "Transport",
          "Shopping",
          "Entertainment",
          "Utilities",
          "Healthcare",
          "Other",
        ]}
        color="orange"
      />
    </div>
  );
};

export default ExpensePage;
