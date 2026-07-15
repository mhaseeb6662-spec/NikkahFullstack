import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { getCurrentUser } from "@/lib/auth";
import { deleteUploadedFile } from "@/lib/uploadImage";

// PATCH: member toggles their own hide/unhide preference. This can NEVER
// override an admin's hiddenByAdmin=true — that check happens wherever
// photos are rendered publicly, not here.
export async function PATCH(req, { params }) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const { photoId } = await params;
  const { hiddenByUser } = await req.json();

  await connectDB();
  const profile = await Profile.findOneAndUpdate(
    { user: session.id, "photos._id": photoId },
    { $set: { "photos.$.hiddenByUser": !!hiddenByUser } },
    { new: true }
  );

  if (!profile) return NextResponse.json({ error: "Photo nahi mili." }, { status: 404 });
  return NextResponse.json({ profile });
}

export async function DELETE(req, { params }) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const { photoId } = await params;

  await connectDB();
  const existing = await Profile.findOne({ user: session.id, "photos._id": photoId }).select("photos").lean();
  const target = existing?.photos?.find((ph) => String(ph._id) === photoId);

  const profile = await Profile.findOneAndUpdate(
    { user: session.id },
    { $pull: { photos: { _id: photoId } } },
    { new: true }
  );

  if (!profile) return NextResponse.json({ error: "Profile nahi mili." }, { status: 404 });
  if (target?.url) await deleteUploadedFile(target.url);
  return NextResponse.json({ profile });
}
