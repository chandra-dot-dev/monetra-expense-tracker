import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Base health route
app.get("/", (req, res) => {
  res.send("Monetra – Expense Analytics Dashboard API Server is running.");
});

// Run Database connection
connectDB().then(() => {
  // Start express API server
  app.listen(PORT, () => {
    console.log(`Server successfully started on port ${PORT}`);
  });
}).catch(err => {
  console.error("Database connection failure, starting server in offline mode failed.");
  process.exit(1);
});
