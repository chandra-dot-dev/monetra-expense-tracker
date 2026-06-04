import mongoose, { Schema, Document } from "mongoose";

export interface IIncome extends Document {
  description: string;
  amount: number;
  category: string;
  date: Date;
  userId: mongoose.Types.ObjectId;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

const incomeSchema = new Schema<IIncome>(
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
      default: "income",
    },
  },
  {
    timestamps: true,
  }
);

const Income = mongoose.models.income || mongoose.model<IIncome>("income", incomeSchema);
export default Income;
