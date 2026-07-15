import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Login required." }, { status: 401 });

  await connectDB();
  const profile = await Profile.findOne({ user: session.id }).lean();
  return NextResponse.json({ profile });
}

export async function POST(req) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Login required." }, { status: 401 });

  try {
    const body = await req.json();
    await connectDB();

    // A member can never set moderation fields on themselves — active
    // (admin approval) and verified are admin-only, and profileId/user/_id
    // are protected identity fields. Strip them out before saving, no
    // matter what the client sends.
    const {
      active, verified, profileId, user: _user, _id, adminNote,
      fullName, ...safeBody
    } = body;

    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ error: "User nahi mila." }, { status: 404 });

    // The complete-profile form sends the member's name as "fullName" so it
    // doesn't clash with any other "name"-like field on the form. Accept
    // either key, and only fall back to the signup name if neither was sent.
    const resolvedName = fullName || safeBody.name || user.name;

    const profile = await Profile.findOneAndUpdate(
      { user: session.id },
      { $set: { ...safeBody, user: session.id, profileId: user.profileId, name: resolvedName } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Keep the account's display name in sync with the profile name the
    // member just entered/edited, so it shows up correctly everywhere
    // (welcome message, admin panel, etc.) — not just on the profile itself.
    if (resolvedName && resolvedName !== user.name) {
      user.name = resolvedName;
    }

    user.profileComplete = true;
    await user.save();

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Profile save error:", err);
    return NextResponse.json({ error: err.message || "Profile save nahi ho saki." }, { status: 500 });
  }
}

export async function PATCH(req) {
  return POST(req);
}
