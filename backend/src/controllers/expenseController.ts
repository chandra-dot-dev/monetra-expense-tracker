import { Response } from "express";
import Expense from "../models/expenseModel.js";
import { transactionSchema } from "../validators/transactionValidator.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import getDateRange from "../utils/dateFilter.js";

export const getExpenses = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authorized." });
  }

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    return res.status(200).json({ success: true, data: expenses, expenses });
  } catch (err) {
    console.error("Get expenses error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching expenses." });
  }
};

export const addExpense = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authorized." });
  }

  const result = transactionSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      success: false, 
      errors: result.error.flatten().fieldErrors,
      message: "Validation failed."
    });
  }

  const { description, amount, category, date } = result.data;

  try {
    const expense = await Expense.create({
      userId,
      description,
      amount,
      category,
      date: date ? new Date(date) : new Date(),
      type: "expense",
    });

    return res.status(201).json({ success: true, data: expense, expense });
  } catch (err) {
    console.error("Add expense error:", err);
    return res.status(500).json({ success: false, message: "Server error saving expense." });
  }
};

export const updateExpense = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authorized." });
  }

  const result = transactionSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      success: false, 
      errors: result.error.flatten().fieldErrors,
      message: "Validation failed."
    });
  }

  const { description, amount, category, date } = result.data;

  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: id, userId },
      { 
        $set: { 
          description, 
          amount, 
          category, 
          date: date ? new Date(date) : undefined 
        } 
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Expense transaction not found." });
    }

    return res.status(200).json({ success: true, data: updated, expense: updated });
  } catch (err) {
    console.error("Update expense error:", err);
    return res.status(500).json({ success: false, message: "Server error updating expense." });
  }
};

export const deleteExpense = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authorized." });
  }

  try {
    const deleted = await Expense.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Expense transaction not found." });
    }
    return res.status(200).json({ success: true, message: "Expense transaction deleted." });
  } catch (err) {
    console.error("Delete expense error:", err);
    return res.status(500).json({ success: false, message: "Server error deleting expense." });
  }
};

export const expenseOverview = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authorized." });
  }

  const range = (req.query.range as string) || "monthly";

  try {
    const { start, end } = getDateRange(range);
    const expenses = await Expense.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    const totalExpense = expenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
    const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;
    const numberOfTransactions = expenses.length;
    const recentTransactions = expenses.slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        totalExpense,
        averageExpense,
        numberOfTransactions,
        recentTransactions,
        range,
      },
    });
  } catch (err) {
    console.error("Expense overview calculation error:", err);
    return res.status(500).json({ success: false, message: "Server error compiling expense overview." });
  }
};

export const downloadExcel = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authorized." });
  }

  try {
    const expenses = await Expense.find({ userId }).sort({ date: -1 });
    
    // Construct CSV file data
    let csv = "Date,Description,Category,Amount\n";
    for (const exp of expenses) {
      const dateStr = new Date(exp.date).toLocaleDateString().replace(/,/g, "");
      const cleanDesc = exp.description.replace(/"/g, '""').replace(/,/g, " ");
      const cleanCat = exp.category.replace(/"/g, '""').replace(/,/g, " ");
      csv += `${dateStr},"${cleanDesc}","${cleanCat}",${exp.amount}\n`;
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=expense_details.csv");
    return res.status(200).send(csv);
  } catch (err) {
    console.error("Expense report generation error:", err);
    return res.status(500).json({ success: false, message: "Server error generating Excel report." });
  }
};
