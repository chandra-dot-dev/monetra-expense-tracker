import React, { useState } from "react";
import { Save, X, Edit, Trash2 } from "lucide-react";
import { colorClasses } from "../assets/color";
import { transactionItemStyles } from "../assets/dummyStyles";
import { Transaction } from "./Helpers";

interface EditFormState {
  description: string;
  amount: string | number;
  category: string;
  date: string;
  type: "income" | "expense";
}

interface TransactionItemProps {
  transaction: Transaction;
  isEditing: boolean;
  editForm: EditFormState;
  setEditForm: React.Dispatch<React.SetStateAction<EditFormState>>;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string, type: "income" | "expense") => void;
  type?: "income" | "expense";
  categoryIcons: Record<string, React.ReactNode>;
  setEditingId: (id: string | null) => void;
  amountClass?: string;
  iconClass?: string;
}

const TransactionItem = ({
  transaction,
  isEditing,
  editForm,
  setEditForm,
  onSave,
  onCancel,
  onDelete,
  type = "expense",
  categoryIcons,
  setEditingId,
  amountClass = "font-bold truncate block text-right",
  iconClass = "p-3 rounded-xl flex-shrink-0",
}: TransactionItemProps) => {
  const [errors, setErrors] = useState({ description: "", amount: "" });

  const classes = colorClasses[type] || colorClasses.expense;
  const sign = type === "income" ? "+" : "-";

  const validate = () => {
    const nextErrors = { description: "", amount: "" };
    const desc = String(editForm.description ?? "").trim();
    const amtRaw = editForm.amount;
    const amt = amtRaw === "" || amtRaw === null || amtRaw === undefined ? "" : String(amtRaw).trim();

    if (!desc) {
      nextErrors.description = "Description is required.";
    }

    if (amt === "") {
      nextErrors.amount = "Amount is required.";
    } else if (Number(amt) <= 0) {
      nextErrors.amount = "Amount must be greater than 0.";
    }

    setErrors(nextErrors);
    return !nextErrors.description && !nextErrors.amount;
  };

  const handleSaveClick = () => {
    if (validate()) {
      setErrors({ description: "", amount: "" });
      onSave();
    }
  };

  return (
    <div className={transactionItemStyles.container(isEditing, classes)}>
      {/* Left side: Icon + Content */}
      <div className={transactionItemStyles.mainContainer}>
        <div className={transactionItemStyles.iconContainer(iconClass, classes)}>
          {categoryIcons[transaction.category] || categoryIcons.Other || null}
        </div>
        
        <div className={transactionItemStyles.contentContainer}>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className={transactionItemStyles.input(
                  !!errors.description,
                  classes
                )}
                placeholder="Description"
              />
              {errors.description && (
                <p className={transactionItemStyles.errorText}>
                  {errors.description}
                </p>
              )}
              
              <select
                value={editForm.category}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, category: e.target.value }))
                }
                className={transactionItemStyles.input(false, classes)}
              >
                {type === "income"
                  ? ["Salary", "Freelance", "Investment", "Bonus", "Other"].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  : ["Food", "Housing", "Transport", "Shopping", "Entertainment", "Utilities", "Healthcare", "Other"].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
              </select>

              <input
                type="date"
                value={editForm.date ? editForm.date.split("T")[0] : ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, date: e.target.value }))
                }
                className={transactionItemStyles.input(false, classes)}
              />
            </div>
          ) : (
            <>
              <p className={transactionItemStyles.description}>
                {transaction.description}
              </p>
              <p className={transactionItemStyles.details}>
                {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right side: Amount + Actions */}
      <div className={transactionItemStyles.actionsContainer}>
        <div className={transactionItemStyles.amountContainer}>
          {isEditing ? (
            <div className="flex flex-col items-end">
              <input
                type="number"
                step="0.01"
                value={editForm.amount}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, amount: e.target.value }))
                }
                className={transactionItemStyles.amountInput(
                  !!errors.amount,
                  classes
                )}
              />
              {errors.amount && (
                <p
                  id={`amt-error-${transaction.id}`}
                  className={transactionItemStyles.errorText}
                >
                  {errors.amount}
                </p>
              )}
            </div>
          ) : (
            <span
              className={transactionItemStyles.amountText(amountClass, classes, type)}
            >
              {sign}${Number(transaction.amount).toLocaleString("en-US", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
            </span>
          )}
        </div>

        <div className={transactionItemStyles.buttonsContainer}>
          {isEditing ? (
            <>
              <button
                onClick={handleSaveClick}
                className={transactionItemStyles.saveButton(classes)}
                title="Save"
              >
                <Save size={16} />
              </button>

              <button
                onClick={() => {
                  setErrors({ description: "", amount: "" });
                  onCancel();
                }}
                className={transactionItemStyles.cancelButton}
                title="Cancel"
              >
                <X size={16} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditForm({
                    description: transaction.description ?? "",
                    amount: transaction.amount ?? "",
                    category: transaction.category ?? "",
                    date: transaction.date ?? "",
                    type: transaction.type ?? "expense",
                  });
                  setErrors({ description: "", amount: "" });
                  setEditingId(transaction.id);
                }}
                className={transactionItemStyles.editButton(classes)}
                title="Edit"
              >
                <Edit size={16} />
              </button>

              <button
                onClick={() => onDelete(transaction.id, type)}
                className={transactionItemStyles.deleteButton(classes)}
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
