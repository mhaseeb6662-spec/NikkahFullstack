import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import User from "@/models/User";
import SuccessStory from "@/models/SuccessStory";
import { getCurrentUser } from "@/lib/auth";

// Successful Rishta Management: when a marriage is completed, admin moves the
// active profile into the public Success Stories section for record keeping,
// then removes it from the live/searchable profile pool.
export async function POST(req, { params }) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { partnerName, story, published } = body;

  await connectDB();

  const profile = await Profile.findById(id);
  if (!profile) return NextResponse.json({ error: "Profile nahi mili." }, { status: 404 });

  const coupleName = partnerName ? `${profile.name} & ${partnerName}` : profile.name;

  const successStory = await SuccessStory.create({
    coupleName,
    city: profile.city,
    story: story || "",
    image: profile.photo || profile.photos?.[0]?.url,
    published: !!published,
    sourceProfileId: profile.profileId,
    sourceUser: profile.user,
  });

  await Profile.findByIdAndDelete(id);
  await User.findByIdAndUpdate(profile.user, { profileComplete: false });

  return NextResponse.json({ ok: true, story: successStory });
}
