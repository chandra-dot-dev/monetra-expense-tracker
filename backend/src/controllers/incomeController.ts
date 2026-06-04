import { Response } from "express";
import Income from "../models/incomeModel.js";
import { transactionSchema } from "../validators/transactionValidator.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import getDateRange from "../utils/dateFilter.js";

export const getIncomes = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authorized." });
  }

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    return res.status(200).json({ success: true, data: incomes, incomes });
  } catch (err) {
    console.error("Get incomes error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching incomes." });
  }
};

export const addIncome = async (req: AuthenticatedRequest, res: Response) => {
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
    const income = await Income.create({
      userId,
      description,
      amount,
      category,
      date: date ? new Date(date) : new Date(),
      type: "income",
    });

    return res.status(201).json({ success: true, data: income, income });
  } catch (err) {
    console.error("Add income error:", err);
    return res.status(500).json({ success: false, message: "Server error saving income." });
  }
};

export const updateIncome = async (req: AuthenticatedRequest, res: Response) => {
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
    const updated = await Income.findOneAndUpdate(
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
      return res.status(404).json({ success: false, message: "Income transaction not found." });
    }

    return res.status(200).json({ success: true, data: updated, income: updated });
  } catch (err) {
    console.error("Update income error:", err);
    return res.status(500).json({ success: false, message: "Server error updating income." });
  }
};

export const deleteIncome = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authorized." });
  }

  try {
    const deleted = await Income.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Income transaction not found." });
    }
    return res.status(200).json({ success: true, message: "Income transaction deleted." });
  } catch (err) {
    console.error("Delete income error:", err);
    return res.status(500).json({ success: false, message: "Server error deleting income." });
  }
};

export const incomeOverview = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authorized." });
  }

  const range = (req.query.range as string) || "monthly";

  try {
    const { start, end } = getDateRange(range);
    const incomes = await Income.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1 });

    const totalIncome = incomes.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
    const averageIncome = incomes.length > 0 ? totalIncome / incomes.length : 0;
    const numberOfTransactions = incomes.length;
    const recentTransactions = incomes.slice(0, 10);

    return res.status(200).json({
      success: true,
      data: {
        totalIncome,
        averageIncome,
        numberOfTransactions,
        recentTransactions,
        range,
      },
    });
  } catch (err) {
    console.error("Income overview calculation error:", err);
    return res.status(500).json({ success: false, message: "Server error compiling income overview." });
  }
};

export const downloadExcel = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authorized." });
  }

  try {
    const incomes = await Income.find({ userId }).sort({ date: -1 });
    
    // Construct CSV file data
    let csv = "Date,Description,Category,Amount\n";
    for (const inc of incomes) {
      const dateStr = new Date(inc.date).toLocaleDateString().replace(/,/g, "");
      const cleanDesc = inc.description.replace(/"/g, '""').replace(/,/g, " ");
      const cleanCat = inc.category.replace(/"/g, '""').replace(/,/g, " ");
      csv += `${dateStr},"${cleanDesc}","${cleanCat}",${inc.amount}\n`;
    }

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=income_details.csv");
    return res.status(200).send(csv);
  } catch (err) {
    console.error("Income report generation error:", err);
    return res.status(500).json({ success: false, message: "Server error generating Excel report." });
  }
};
