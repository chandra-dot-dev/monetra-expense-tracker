import React, { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { modalStyles } from "../assets/dummyStyles";

export interface NewTransactionState {
  type: "income" | "expense";
  description: string;
  amount: string;
  category: string;
  date: string;
}

interface AddTransactionModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  newTransaction: NewTransactionState;
  setNewTransaction: React.Dispatch<React.SetStateAction<NewTransactionState>>;
  handleAddTransaction: () => void;
  loading?: boolean;
  type?: "income" | "expense" | "both";
  title?: string;
  buttonText?: string;
  categories?: string[];
  color?: "teal" | "orange";
}

const AddTransactionModal = ({
  showModal,
  setShowModal,
  newTransaction,
  setNewTransaction,
  handleAddTransaction,
  loading = false,
  type = "both",
  title = "Add New Transaction",
  buttonText = "Add Transaction",
  categories = [
    "Food", "Housing", "Transport", "Shopping", "Entertainment",
    "Utilities", "Healthcare", "Salary", "Freelance", "Investment",
    "Bonus", "Other"
  ],
  color = "teal"
}: AddTransactionModalProps) => {
  if (!showModal) return null;

  // Get current date in YYYY-MM-DD format
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0];

  const colorClass = modalStyles.colorClasses[color] || modalStyles.colorClasses.teal;

  // Adjust categories list based on transaction type if it's dynamic
  const filteredCategories = useMemo(() => {
    const currentType = newTransaction.type || type;
    if (currentType === "income") {
      return ["Salary", "Freelance", "Investment", "Bonus", "Other"];
    } else if (currentType === "expense") {
      return ["Food", "Housing", "Transport", "Shopping", "Entertainment", "Utilities", "Healthcare", "Other"];
    }
    return categories;
  }, [newTransaction.type, type, categories]);

  // Set default category when type changes
  useEffect(() => {
    const currentType = newTransaction.type || type;
    if (currentType === "income" && !["Salary", "Freelance", "Investment", "Bonus", "Other"].includes(newTransaction.category)) {
      setNewTransaction(prev => ({ ...prev, category: "Salary" }));
    } else if (currentType === "expense" && !["Food", "Housing", "Transport", "Shopping", "Entertainment", "Utilities", "Healthcare", "Other"].includes(newTransaction.category)) {
      setNewTransaction(prev => ({ ...prev, category: "Food" }));
    }
  }, [newTransaction.type, type, setNewTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTransaction.description || !newTransaction.amount) {
      alert("Please fill in all required fields.");
      return;
    }
    handleAddTransaction();
  };

  return (
    <div className={modalStyles.overlay}>
      <div className={modalStyles.modalContainer}>
        {/* Modal Header */}
        <div className={modalStyles.modalHeader}>
          <h3 className={modalStyles.modalTitle}>{title}</h3>
          <button 
            type="button"
            onClick={() => setShowModal(false)}
            className={modalStyles.closeButton}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className={modalStyles.form}>
          {/* Transaction Type selection */}
          {type === "both" && (
            <div>
              <label className={modalStyles.label}>Type</label>
              <div className={modalStyles.typeButtonContainer}>
                <button 
                  type="button"
                  className={modalStyles.typeButton(
                    newTransaction.type === 'income', 
                    modalStyles.colorClasses.teal.typeButtonSelected
                  )}
                  onClick={() => setNewTransaction(prev => ({...prev, type: 'income', category: 'Salary'}))}
                >
                  Income
                </button>
                <button 
                  type="button"
                  className={modalStyles.typeButton(
                    newTransaction.type === 'expense', 
                    modalStyles.colorClasses.orange.typeButtonSelected
                  )}
                  onClick={() => setNewTransaction(prev => ({...prev, type: 'expense', category: 'Food'}))}
                >
                  Expense
                </button>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className={modalStyles.label}>Description *</label>
            <input
              type="text"
              required
              placeholder="e.g. Grocery shopping, Salary payout"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
              className={modalStyles.input(colorClass.ring)}
            />
          </div>

          {/* Amount */}
          <div>
            <label className={modalStyles.label}>Amount ($) *</label>
            <input
              type="number"
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
              className={modalStyles.input(colorClass.ring)}
            />
          </div>

          {/* Category */}
          <div>
            <label className={modalStyles.label}>Category</label>
            <select
              value={newTransaction.category}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
              className={modalStyles.input(colorClass.ring)}
            >
              {filteredCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className={modalStyles.label}>Date</label>
            <input
              type="date"
              max={currentDate}
              value={newTransaction.date}
              onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
              className={modalStyles.input(colorClass.ring)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={modalStyles.submitButton(colorClass.button)}
          >
            {loading ? "Saving..." : buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
