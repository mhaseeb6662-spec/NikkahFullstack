import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profileId: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ["pending", "active", "suspended"], default: "pending" },
    profileComplete: { type: Boolean, default: false },
    paymentStatus: { type: String, enum: ["unpaid", "pending", "paid"], default: "unpaid" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
