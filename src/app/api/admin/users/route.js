import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Profile from "@/models/Profile";
import Payment from "@/models/Payment";
import { getCurrentUser } from "@/lib/auth";

function genProfileId() {
  return "MAT-" + Math.floor(10000 + Math.random() * 89999);
}

export async function GET() {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  await connectDB();
  const users = await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean();

  // Attach each member's most recent payment (transaction ID + screenshot)
  // so the admin can see bank transfer proof right here while approving —
  // without needing to separately open the Payments page.
  const payments = await Payment.find({ user: { $in: users.map((u) => u._id) } })
    .sort({ createdAt: -1 })
    .lean();
  const latestPaymentByUser = new Map();
  for (const p of payments) {
    const key = String(p.user);
    if (!latestPaymentByUser.has(key)) latestPaymentByUser.set(key, p);
  }
  const usersWithPayment = users.map((u) => ({
    ...u,
    latestPayment: latestPaymentByUser.get(String(u._id)) || null,
  }));

  return NextResponse.json({ users: usersWithPayment });
}

// Admin creates a user manually — e.g. after receiving payment offline, or on
// behalf of a family that isn't comfortable registering themselves. Optionally
// creates a matching (already-active) Profile in the same request so the
// member's listing goes live immediately.
export async function POST(req) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, password, status, activateProfile, profile } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email aur password required hain." }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Is email se pehle hi account bana hua hai." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let profileId = genProfileId();
    while (await User.findOne({ profileId })) {
      profileId = genProfileId();
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      profileId,
      role: "user",
      status: status || "active",
      paymentStatus: activateProfile ? "paid" : "unpaid",
      profileComplete: !!activateProfile,
    });

    let createdProfile = null;
    if (activateProfile) {
      createdProfile = await Profile.create({
        user: user._id,
        profileId,
        name,
        gender: profile?.gender,
        age: profile?.age || undefined,
        city: profile?.city,
        caste: profile?.caste,
        education: profile?.education,
        profession: profile?.profession,
        active: true,
      });
    }

    const userObj = user.toObject();
    delete userObj.passwordHash;

    return NextResponse.json({ user: userObj, profile: createdProfile });
  } catch (err) {
    console.error("Admin create user error:", err);
    return NextResponse.json({ error: err.message || "User create nahi ho saka." }, { status: 500 });
  }
}
