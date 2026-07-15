import mongoose from "mongoose";

const SuccessStorySchema = new mongoose.Schema(
  {
    coupleName: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    story: { type: String, trim: true },
    image: { type: String },
    published: { type: Boolean, default: false },
    // Set automatically when a profile is moved here from the Profiles &
    // Photos admin screen (Successful Rishta Management). Optional — stories
    // can also be added by hand with no source profile at all.
    sourceProfileId: { type: String, trim: true },
    sourceUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.SuccessStory || mongoose.model("SuccessStory", SuccessStorySchema);
