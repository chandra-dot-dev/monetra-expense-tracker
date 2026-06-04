import React, { useState, useMemo, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { ArrowLeftRight, Search, Plus, Calendar } from "lucide-react";
import { LayoutContextType } from "../components/Layout";
import TransactionItem from "../components/TransactionItem";
import AddTransactionModal, { NewTransactionState } from "../components/AddTransactionModal";
import { CATEGORY_ICONS, CATEGORY_ICONS_Inc } from "../assets/color";
import { incomeStyles as styles } from "../assets/dummyStyles";

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

const TransactionsPage = () => {
  const {
    transactions = [],
    addTransaction,
    editTransaction,
    deleteTransaction,
    refreshTransactions
  } = useOutletContext<LayoutContextType>();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Search and Filters
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

  // Filter logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || t.type === typeFilter;
      const matchesCategory = categoryFilter === "all" || t.category.toLowerCase() === categoryFilter.toLowerCase();
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchQuery, typeFilter, categoryFilter]);

  // Unique categories list
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => set.add(t.category));
    return Array.from(set);
  }, [transactions]);

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

      await addTransaction(payload);

      setNewTransaction({
        date: new Date().toISOString().split("T")[0],
        description: "",
        amount: "",
        type: "expense",
        category: "Food",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Failed to add transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = async () => {
    if (!editingId || !editForm.description || !editForm.amount) return;
    try {
      setLoading(true);
      await editTransaction(editingId, {
        description: editForm.description.trim(),
        amount: parseFloat(String(editForm.amount)),
        category: editForm.category,
        date: toIsoWithClientTime(editForm.date),
        type: editForm.type
      });
      setEditingId(null);
    } catch (err) {
      console.error("Failed to update transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string, type: "income" | "expense") => {
    if (!id || !window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      setLoading(true);
      await deleteTransaction(id, type);
    } catch (err) {
      console.error("Failed to delete transaction:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Header Container */}
      <div className={styles.headerContainer}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>Transactions Ledger</h1>
            <p className={styles.headerSubtitle}>
              Unified cashflow ledger showing revenues and outlays
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={styles.addButton}
            disabled={loading}
          >
            <Plus size={14} /> Add Transaction
          </button>
        </div>
      </div>

      {/* Main ledger list box */}
      <div className={styles.listContainer}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-3 border-b border-border-app">
          <h3 className={styles.sectionTitle}>
            <ArrowLeftRight className="w-5 h-5 text-text-app" />
            Ledger Journal
            <span className="text-xs text-muted-app font-normal">
              {" "}
              ({filteredTransactions.length} records)
            </span>
          </h3>

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
                className="w-full sm:w-44 pl-7 pr-3 py-1.5 bg-bg-app border border-border-app rounded-md text-xs text-text-app placeholder-muted-app focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>

            {/* Type selector */}
            <select
              value={typeFilter}
              onChange={(e: any) => setTypeFilter(e.target.value)}
              className="bg-bg-app border border-border-app rounded-md px-2.5 py-1.5 text-xs text-text-app focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>

            {/* Category selector */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-bg-app border border-border-app rounded-md px-2.5 py-1.5 text-xs text-text-app focus:outline-none"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Unified stack list */}
        <div className="space-y-2">
          {filteredTransactions.map((transaction) => {
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
            <div className="text-center py-10 text-xs text-muted-app bg-bg-app border border-border-app rounded-md">
              No transactions match the criteria.
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
        type="both"
        title="New Transaction"
        buttonText="Create Transaction"
      />
    </div>
  );
};

export default TransactionsPage;
