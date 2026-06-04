import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  description: string;
  amount: number;
  category: string;
  date: Date;
  userId: mongoose.Types.ObjectId;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const expenseSchema = new Schema<IExpense>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      default: "expense",
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.models.expense || mongoose.model<IExpense>("expense", expenseSchema);
export default Expense;
