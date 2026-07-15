/**
 * Create (or promote) an admin account.
 *
 * Public /register always creates role="user" on purpose — nobody should be
 * able to make themselves an admin through the website. Run this script
 * locally / on the server instead, whenever you need an admin login.
 *
 * Usage:
 *   node scripts/createAdmin.js admin@example.com "StrongPassword123" "Admin Name"
 *
 * If a user with that email already exists, it will be promoted to admin
 * and activated instead of creating a duplicate.
 */

require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI;

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

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function main() {
  const [, , email, password, name] = process.argv;

  if (!email || !password) {
    console.error("Usage: node scripts/createAdmin.js <email> <password> [\"Admin Name\"]");
    process.exit(1);
  }
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set. Add it to your .env file first (see .env.example).");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);

  const passwordHash = await bcrypt.hash(password, 10);
  const normalizedEmail = email.toLowerCase();

  let user = await User.findOne({ email: normalizedEmail });

  if (user) {
    user.role = "admin";
    user.status = "active";
    user.passwordHash = passwordHash;
    if (name) user.name = name;
    await user.save();
    console.log(`Existing user promoted to admin: ${user.email}`);
  } else {
    user = await User.create({
      name: name || "Admin",
      email: normalizedEmail,
      passwordHash,
      role: "admin",
      status: "active",
      profileComplete: true,
      paymentStatus: "paid",
    });
    console.log(`Admin account created: ${user.email}`);
  }

  console.log("You can now log in at /login with this email and password.");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Failed to create admin:", err);
  process.exit(1);
});
