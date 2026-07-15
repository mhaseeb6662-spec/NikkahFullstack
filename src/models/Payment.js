import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    method: { type: String, trim: true },
    transactionId: { type: String, trim: true },
    screenshot: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
