import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import api from "../utils/api";
import { UserProfile } from "../context/AuthContext";
import { Transaction } from "./Helpers";
import { styles } from "../assets/dummyStyles";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  user: UserProfile | null;
  onLogout: () => void;
}

export interface LayoutContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Partial<Transaction>) => Promise<boolean>;
  editTransaction: (id: string, transaction: Partial<Transaction>) => Promise<boolean>;
  deleteTransaction: (id: string, type: "income" | "expense") => Promise<boolean>;
  refreshTransactions: () => Promise<void>;
  timeFrame: string;
  setTimeFrame: (timeFrame: string) => void;
  lastUpdated: Date;
}

const safeArrayFromResponse = (res: any) => {
  const body = res?.data;
  if (!body) return [];
  if (Array.isArray(body)) return body;
  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.incomes)) return body.incomes;
  if (Array.isArray(body.expenses)) return body.expenses;
  return [];
};

const Layout = ({ user, onLogout }: LayoutProps) => {
  const location = useLocation();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [mobileOpen, setMobileOpen] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const [incomeRes, expenseRes] = await Promise.all([
        api.get("/income/get"),
        api.get("/expense/get"),
      ]);

      const incomes = safeArrayFromResponse(incomeRes).map((i: any) => ({
        ...i,
        type: "income" as const,
        id: i._id || i.id,
      }));
      const expenses = safeArrayFromResponse(expenseRes).map((e: any) => ({
        ...e,
        type: "expense" as const,
        id: e._id || e.id,
      }));

      const allTransactions: Transaction[] = [...incomes, ...expenses]
        .map((t: any) => ({
          id: t._id || t.id || Math.random().toString(36).slice(2),
          description: t.description || t.title || t.note || "",
          amount: t.amount != null ? Number(t.amount) : Number(t.value) || 0,
          date: t.date || t.createdAt || new Date().toISOString(),
          category: t.category || t.type || "Other",
          type: t.type,
          raw: t,
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setTransactions(allTransactions);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error(
        "Failed to fetch transactions",
        err?.response || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Partial<Transaction>) => {
    try {
      const endpoint = transaction.type === "income" ? "/income/add" : "/expense/add";
      await api.post(endpoint, transaction);
      await fetchTransactions();
      return true;
    } catch (err) {
      console.error(
        "Failed to add transaction",
        err
      );
      throw err;
    }
  };

  const editTransaction = async (id: string, transaction: Partial<Transaction>) => {
    try {
      const endpoint = transaction.type === "income" ? `/income/update/${id}` : `/expense/update/${id}`;
      await api.put(endpoint, transaction);
      await fetchTransactions();
      return true;
    } catch (err) {
      console.error(
        "Failed to edit transaction",
        err
      );
      throw err;
    }
  };

  const deleteTransaction = async (id: string, type: "income" | "expense") => {
    try {
      const endpoint = type === "income" ? `/income/delete/${id}` : `/expense/delete/${id}`;
      await api.delete(endpoint);
      await fetchTransactions();
      return true;
    } catch (err) {
      console.error(
        "Failed to delete transaction",
        err
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const outletContext: LayoutContextType = {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    refreshTransactions: fetchTransactions,
    timeFrame,
    setTimeFrame,
    lastUpdated,
  };

  return (
    <div className={styles.layout.root}>
      <Navbar 
        user={user} 
        onLogout={onLogout} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex">
        <Sidebar
          user={user}
          isCollapsed={sidebarCollapsed}
          onLogout={onLogout}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        <main className={`${styles.layout.mainContainer(sidebarCollapsed)} flex-1 min-h-[calc(100vh-48px)] overflow-x-hidden`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full w-full"
            >
              <Outlet context={outletContext} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
