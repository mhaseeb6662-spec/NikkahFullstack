import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AccessRequest from "@/models/AccessRequest";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  await connectDB();
  const requests = await AccessRequest.find()
    .populate("user", "name email profileId")
    .populate("targetProfile", "name profileId")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ requests });
}

export async function POST(req) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const body = await req.json();
  if (!body.targetProfile) {
    return NextResponse.json({ error: "Target profile required hai." }, { status: 400 });
  }
  await connectDB();

  // Upsert so a member re-requesting after a denial (or clicking twice)
  // updates their one existing request instead of piling up duplicates.
  // A member can never set their own request straight to "approved" — only
  // the admin PATCH endpoint can do that — so this always resets to pending.
  const request = await AccessRequest.findOneAndUpdate(
    { user: session.id, targetProfile: body.targetProfile },
    { status: "pending", reason: body.reason },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return NextResponse.json({ request });
}
