import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    profileId: { type: String, unique: true, sparse: true },
    name: { type: String, trim: true },
    gender: { type: String, enum: ["male", "female"] },
    age: { type: Number },
    city: { type: String, trim: true },
    province: { type: String, trim: true },
    caste: { type: String, trim: true },
    education: { type: String, trim: true },
    collegeUniversity: { type: String, trim: true },
    profession: { type: String, trim: true },
    jobBusiness: { type: String, trim: true },
    income: { type: String, trim: true },
    maritalStatus: { type: String, trim: true },
    height: { type: String, trim: true },
    religion: { type: String, trim: true, default: "Islam" },
    sect: { type: String, trim: true },
    home: { type: String, trim: true },
    homeSize: { type: String, trim: true },
    nationality: { type: String, trim: true, default: "Pakistani" },
    fatherOccupation: { type: String, trim: true },
    motherOccupation: { type: String, trim: true },
    brothers: { type: Number },
    sisters: { type: Number },
    reqAgeLimit: { type: String, trim: true },
    reqHeight: { type: String, trim: true },
    reqCity: { type: String, trim: true },
    reqCaste: { type: String, trim: true },
    reqQualification: { type: String, trim: true },
    reqOthers: { type: String, trim: true },
    about: { type: String, trim: true },
    familyDetails: { type: String, trim: true },
    expectations: { type: String, trim: true },
    photo: { type: String },
    photos: [
      {
        url: { type: String, required: true },
        hiddenByUser: { type: Boolean, default: false },
        hiddenByAdmin: { type: Boolean, default: false },
        // "everyone": visible to all visitors. "approvedOnly": only visible to
        // users whose access request for this profile has been approved.
        visibility: { type: String, enum: ["everyone", "approvedOnly"], default: "everyone" },
      },
    ],
    verified: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    adminNote: { type: String, trim: true },
  },
  { timestamps: true }
);

ProfileSchema.index({ active: 1, createdAt: -1 });

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);