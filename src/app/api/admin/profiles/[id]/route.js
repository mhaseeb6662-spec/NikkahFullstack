import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

// Moderation-only toggles (always allowed) plus full profile detail fields —
// used when the admin explicitly edits a member's profile on their behalf.
const ALLOWED_FIELDS = [
  "active",
  "verified",
  "adminNote",
  "name",
  "gender",
  "age",
  "city",
  "caste",
  "education",
  "collegeUniversity",
  "profession",
  "jobBusiness",
  "income",
  "maritalStatus",
  "height",
  "religion",
  "sect",
  "home",
  "homeSize",
  "nationality",
  "fatherOccupation",
  "motherOccupation",
  "brothers",
  "sisters",
  "about",
  "familyDetails",
  "expectations",
  "reqAgeLimit",
  "reqHeight",
  "reqCity",
  "reqCaste",
  "reqQualification",
  "reqOthers",
];

export async function PATCH(req, { params }) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  // Only allow whitelisted fields through — admin cannot be tricked into
  // overwriting protected internals (user ref, profileId, photos) via this endpoint.
  const update = {};
  for (const key of ALLOWED_FIELDS) {
    if (key in body) update[key] = body[key];
  }

  await connectDB();
  const profile = await Profile.findByIdAndUpdate(id, update, { new: true });
  if (!profile) return NextResponse.json({ error: "Profile nahi mili." }, { status: 404 });

  return NextResponse.json({ profile });
}

// Admin permanently deletes a profile listing (member account itself stays
// intact unless deleted separately from User Management).
export async function DELETE(req, { params }) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();

  const profile = await Profile.findByIdAndDelete(id);
  if (!profile) return NextResponse.json({ error: "Profile nahi mili." }, { status: 404 });

  await User.findByIdAndUpdate(profile.user, { profileComplete: false });

  return NextResponse.json({ ok: true });
}
