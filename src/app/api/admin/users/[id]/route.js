import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Profile from "@/models/Profile";
import Payment from "@/models/Payment";
import AccessRequest from "@/models/AccessRequest";
import { getCurrentUser } from "@/lib/auth";

const EDITABLE_FIELDS = ["name", "email", "phone", "status", "paymentStatus"];

export async function PATCH(req, { params }) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  await connectDB();

  // Whitelist so an admin edit can never touch passwordHash / role directly.
  const update = {};
  for (const key of EDITABLE_FIELDS) {
    if (key in body) update[key] = body[key];
  }
  if (update.email) update.email = update.email.toLowerCase();

  // Approving a user's account (marking it "active") is meant to fully unlock
  // the site for them. The homepage/dashboard only treat a member as approved
  // once BOTH status === "active" AND paymentStatus === "paid" — so if an
  // admin approves from here without also marking payment as paid, the member
  // stays stuck on the "pending verification" screen even though the admin
  // sees them as Active. Keep the two in sync unless the admin explicitly set
  // paymentStatus themselves in this same request.
  if (update.status === "active" && !("paymentStatus" in body)) {
    update.paymentStatus = "paid";
  }

  const user = await User.findByIdAndUpdate(id, update, { new: true }).select("-passwordHash");
  if (!user) return NextResponse.json({ error: "User nahi mila." }, { status: 404 });

  // Keep the member's public Profile listing (Active/Inactive toggle on the
  // Profiles & Photos page) in sync too, so admins don't see one page saying
  // "Active" and another saying the profile is still off.
  if (update.status === "active") {
    await Profile.findOneAndUpdate({ user: id }, { active: true });
  } else if (update.status === "suspended") {
    await Profile.findOneAndUpdate({ user: id }, { active: false });
  }

  return NextResponse.json({ user });
}

// Admin permanently deletes a user profile/account. Cascades to remove their
// matrimonial Profile, payment history, and any access requests so no orphan
// records are left behind.
export async function DELETE(req, { params }) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();

  const user = await User.findById(id);
  if (!user) return NextResponse.json({ error: "User nahi mila." }, { status: 404 });

  if (user.role === "admin") {
    return NextResponse.json({ error: "Admin account delete nahi ho sakta." }, { status: 400 });
  }

  await Promise.all([
    Profile.deleteOne({ user: id }),
    Payment.deleteMany({ user: id }),
    AccessRequest.deleteMany({ $or: [{ user: id }] }),
    User.findByIdAndDelete(id),
  ]);

  return NextResponse.json({ ok: true });
}
