import express from "express";
import { getIncomes, addIncome, updateIncome, deleteIncome, incomeOverview, downloadExcel } from "../controllers/incomeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get", authMiddleware, getIncomes);
router.post("/add", authMiddleware, addIncome);
router.put("/update/:id", authMiddleware, updateIncome);
router.delete("/delete/:id", authMiddleware, deleteIncome);
router.get("/overview", authMiddleware, incomeOverview);
router.get("/downloadexcel", authMiddleware, downloadExcel);

export default router;
