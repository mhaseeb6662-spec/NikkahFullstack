import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  await connectDB();
  const profiles = await Profile.find().sort({ createdAt: -1 }).lean();

  // The member's phone/email live on the User account, not the Profile
  // document. The admin needs to see them right here so they can actually
  // reach out to whoever registered/created a profile, without having to
  // cross-reference the separate Users page for every entry.
  const users = await User.find({ _id: { $in: profiles.map((p) => p.user) } })
    .select("phone email")
    .lean();
  const userById = new Map(users.map((u) => [String(u._id), u]));

  const profilesWithContact = profiles.map((p) => ({
    ...p,
    phone: userById.get(String(p.user))?.phone || null,
    email: userById.get(String(p.user))?.email || null,
  }));

  return NextResponse.json({ profiles: profilesWithContact });
}
