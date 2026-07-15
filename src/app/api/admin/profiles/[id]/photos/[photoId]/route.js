import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { getCurrentUser } from "@/lib/auth";
import { deleteUploadedFile } from "@/lib/uploadImage";

// PATCH: admin toggles whether a specific photo is allowed to be shown at all.
// This is a hard override — if hiddenByAdmin is true, the photo never shows
// publicly no matter what the member sets on their side.
export async function PATCH(req, { params }) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id, photoId } = await params;
  const body = await req.json();

  const set = {};
  if ("hiddenByAdmin" in body) set["photos.$.hiddenByAdmin"] = !!body.hiddenByAdmin;
  if ("visibility" in body && ["everyone", "approvedOnly"].includes(body.visibility)) {
    set["photos.$.visibility"] = body.visibility;
  }

  await connectDB();
  const profile = await Profile.findOneAndUpdate(
    { _id: id, "photos._id": photoId },
    { $set: set },
    { new: true }
  );

  if (!profile) return NextResponse.json({ error: "Profile ya photo nahi mili." }, { status: 404 });
  return NextResponse.json({ profile });
}

// DELETE: admin permanently removes a photo (e.g. inappropriate content).
export async function DELETE(req, { params }) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id, photoId } = await params;

  await connectDB();
  const existing = await Profile.findOne({ _id: id, "photos._id": photoId }).select("photos").lean();
  const target = existing?.photos?.find((ph) => String(ph._id) === photoId);

  const profile = await Profile.findByIdAndUpdate(
    id,
    { $pull: { photos: { _id: photoId } } },
    { new: true }
  );

  if (!profile) return NextResponse.json({ error: "Profile nahi mili." }, { status: 404 });
  if (target?.url) await deleteUploadedFile(target.url);
  return NextResponse.json({ profile });
}
