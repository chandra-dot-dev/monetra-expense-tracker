import express from "express";
import { getExpenses, addExpense, updateExpense, deleteExpense, expenseOverview, downloadExcel } from "../controllers/expenseController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get", authMiddleware, getExpenses);
router.post("/add", authMiddleware, addExpense);
router.put("/update/:id", authMiddleware, updateExpense);
router.delete("/delete/:id", authMiddleware, deleteExpense);
router.get("/overview", authMiddleware, expenseOverview);
router.get("/downloadexcel", authMiddleware, downloadExcel);

export default router;
