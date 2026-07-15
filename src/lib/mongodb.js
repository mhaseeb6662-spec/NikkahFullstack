import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dns from "dns"

const MONGODB_URI = process.env.MONGODB_URI;
dns.setServers(["1.1.1.1", "8.8.8.8"]); 

// Default admin account — auto-created on first connection so nobody has to
// run a separate script. Change these via env vars if you want a different
// email/password; otherwise these defaults are used.
const DEFAULT_ADMIN_EMAIL = (process.env.DEFAULT_ADMIN_EMAIL || "rishtacenter@gmail.com").toLowerCase();
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || "rishta123";

// Cache the connection across hot-reloads in dev and across serverless
// invocations so we don't open a new connection on every request.
let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null, adminSeeded: false };
}

export async function connectDB() {
  if (cached.conn) {
    await ensureDefaultAdmin();
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to your .env file (see .env.example) — bas connection string laga dein."
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  await ensureDefaultAdmin();
  return cached.conn;
}

// Runs once per server process (guarded by cached.adminSeeded). Creates the
// admin account if it doesn't exist yet — no manual script needed.
async function ensureDefaultAdmin() {
  if (cached.adminSeeded) return;
  cached.adminSeeded = true; // set first so concurrent requests don't race

  try {
    // Lazy import to avoid any circular-import issues at module load time.
    const { default: User } = await import("@/models/User");

    const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });
    if (existingAdmin) {
      // Make sure it always stays an active admin, in case it was ever changed.
      if (existingAdmin.role !== "admin" || existingAdmin.status !== "active") {
        existingAdmin.role = "admin";
        existingAdmin.status = "active";
        await existingAdmin.save();
      }
      return;
    }

    const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);
    await User.create({
      name: "Rishta Center Admin",
      email: DEFAULT_ADMIN_EMAIL,
      passwordHash,
      role: "admin",
      status: "active",
      profileComplete: true,
      paymentStatus: "paid",
    });
    console.log(`Default admin account created: ${DEFAULT_ADMIN_EMAIL}`);
  } catch (err) {
    // Don't crash the app if seeding fails for some reason — just log it.
    cached.adminSeeded = false;
    console.error("Default admin seeding failed:", err.message);
  }
}

export default connectDB;
