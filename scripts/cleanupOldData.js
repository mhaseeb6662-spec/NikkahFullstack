/**
 * Deletes every user/profile from the database EXCEPT:
 *   - accounts created today
 *   - admin accounts (always kept, so you never lock yourself out)
 *
 * Also removes each deleted profile's related data: their Payment records,
 * AccessRequests (as requester or as target), and their uploaded photo
 * files on disk.
 *
 * SAFETY: by default this is a DRY RUN — it only prints what it WOULD
 * delete. Nothing is actually removed until you pass --yes.
 *
 * Usage:
 *   node scripts/cleanupOldData.js            # dry run, shows what would happen
 *   node scripts/cleanupOldData.js --yes       # actually deletes
 */

require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const fs = require("fs/promises");
const path = require("path");

const MONGODB_URI = process.env.MONGODB_URI;
const CONFIRM = process.argv.includes("--yes");

const UserSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const ProfileSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const PaymentSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const AccessRequestSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Profile = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
const AccessRequest = mongoose.models.AccessRequest || mongoose.model("AccessRequest", AccessRequestSchema);

async function main() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not set. Add it to your .env file first.");
    process.exit(1);
  }

  await mongoose.connect(MONGODB_URI);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const usersToDelete = await User.find({
    role: { $ne: "admin" },
    createdAt: { $lt: startOfToday },
  }).lean();

  const usersToKeep = await User.find({
    $or: [{ role: "admin" }, { createdAt: { $gte: startOfToday } }],
  }).lean();

  console.log(`Users created today or admins (KEPT): ${usersToKeep.length}`);
  console.log(`Users older than today (${CONFIRM ? "DELETING" : "would delete"}): ${usersToDelete.length}`);

  if (usersToDelete.length === 0) {
    console.log("Nothing to delete. Done.");
    await mongoose.disconnect();
    return;
  }

  const userIds = usersToDelete.map((u) => u._id);

  const profiles = await Profile.find({ user: { $in: userIds } }).lean();
  const profileIds = profiles.map((p) => p._id);

  console.log(`Profiles: ${profiles.length}`);
  const payments = await Payment.find({ user: { $in: userIds } }).lean();
  console.log(`Payments: ${payments.length}`);
  const accessRequests = await AccessRequest.find({
    $or: [{ user: { $in: userIds } }, { targetProfile: { $in: profileIds } }],
  }).lean();
  console.log(`Access requests: ${accessRequests.length}`);

  if (!CONFIRM) {
    console.log("\nDry run only — nothing was deleted. Re-run with --yes to actually delete this data.");
    await mongoose.disconnect();
    return;
  }

  // Delete uploaded photo files on disk for each removed user.
  for (const u of usersToDelete) {
    const dir = path.join(process.cwd(), "public", "uploads", "profiles", String(u._id));
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch {
      // ignore — folder may not exist
    }
  }

  await AccessRequest.deleteMany({
    $or: [{ user: { $in: userIds } }, { targetProfile: { $in: profileIds } }],
  });
  await Payment.deleteMany({ user: { $in: userIds } });
  await Profile.deleteMany({ user: { $in: userIds } });
  await User.deleteMany({ _id: { $in: userIds } });

  console.log("\nDone. Deleted:");
  console.log(`  ${usersToDelete.length} users`);
  console.log(`  ${profiles.length} profiles`);
  console.log(`  ${payments.length} payments`);
  console.log(`  ${accessRequests.length} access requests`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});
