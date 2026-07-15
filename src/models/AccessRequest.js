import mongoose from "mongoose";

const AccessRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    reason: { type: String, trim: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.AccessRequest || mongoose.model("AccessRequest", AccessRequestSchema);
