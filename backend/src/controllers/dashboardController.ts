import { Response } from "express";
import Expense from "../models/expenseModel.js";
import Income from "../models/incomeModel.js";
import { AuthenticatedRequest } from "../middleware/authMiddleware.js";
import getDateRange from "../utils/dateFilter.js";

export const getDashboardOverview = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "User not authorized." });
  }

  const range = (req.query.range as string) || "monthly";

  try {
    const { start, end } = getDateRange(range);

    const [incomes, expenses] = await Promise.all([
      Income.find({ userId, date: { $gte: start, $lte: end } }).lean(),
      Expense.find({ userId, date: { $gte: start, $lte: end } }).lean(),
    ]);

    const monthlyIncome = incomes.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
    const monthlyExpense = expenses.reduce((acc, cur) => acc + Number(cur.amount || 0), 0);
    const savings = monthlyIncome - monthlyExpense;
    const savingsRate = monthlyIncome === 0 ? 0 : Math.round((savings / monthlyIncome) * 100);

    const recentTransactions = [
      ...incomes.map((i) => ({
        id: i._id || i.id,
        description: i.description,
        amount: i.amount,
        category: i.category,
        date: i.date,
        type: "income",
        createdAt: i.createdAt,
      })),
      ...expenses.map((e) => ({
        id: e._id || e.id,
        description: e.description,
        amount: e.amount,
        category: e.category,
        date: e.date,
        type: "expense",
        createdAt: e.createdAt,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Sort descending (newest first)
    recentTransactions.reverse();

    const spendByCategory: Record<string, number> = {};
    for (const exp of expenses) {
      const cat = exp.category || "Other";
      spendByCategory[cat] = (spendByCategory[cat] || 0) + Number(exp.amount || 0);
    }

    const expenseDistribution = Object.entries(spendByCategory).map(([category, amount]) => ({
      category,
      amount,
      percent: monthlyExpense === 0 ? 0 : Math.round((amount / monthlyExpense) * 100),
    }));

    return res.status(200).json({
      success: true,
      data: {
        monthlyIncome,
        monthlyExpense,
        savings,
        savingsRate,
        recentTransactions: recentTransactions.slice(0, 10), // Return top 10
        spendByCategory,
        expenseDistribution,
      },
    });
  } catch (err) {
    console.error("Dashboard overview calculation error:", err);
    return res.status(500).json({ success: false, message: "Server error calculating dashboard overview." });
  }
};
