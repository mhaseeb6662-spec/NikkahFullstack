import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AccessRequest from "@/models/AccessRequest";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Admin can type either the full profile ID ("MAT-12345") or just the
// number ("12345") — normalize so both work the same way.
function normalizeProfileId(raw) {
  const v = (raw || "").trim();
  if (!v) return "";
  return /^\d+$/.test(v) ? `MAT-${v}` : v;
}

// Admin directly grants one member (the "viewer") permission to see another
// member's ("target") phone number and any photos that member has hidden.
// This does NOT require the viewer to have submitted a request first — it's
// for cases where the admin is authorizing access themselves (e.g. after a
// phone call, or proactively matching two profiles).
export async function POST(req) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await req.json();
  const viewerId = normalizeProfileId(body.viewerProfileId);
  const targetId = normalizeProfileId(body.targetProfileId);

  if (!viewerId || !targetId) {
    return NextResponse.json({ error: "Viewer aur target, dono ki profile ID dein." }, { status: 400 });
  }

  await connectDB();

  const viewerUser = await User.findOne({
    profileId: new RegExp(`^${escapeRegex(viewerId)}$`, "i"),
  });
  if (!viewerUser) {
    return NextResponse.json({ error: `Viewer profile ID "${body.viewerProfileId}" nahi mili.` }, { status: 404 });
  }

  const targetProfile = await Profile.findOne({
    profileId: new RegExp(`^${escapeRegex(targetId)}$`, "i"),
  });
  if (!targetProfile) {
    return NextResponse.json({ error: `Target profile ID "${body.targetProfileId}" nahi mili.` }, { status: 404 });
  }

  if (String(targetProfile.user) === String(viewerUser._id)) {
    return NextResponse.json({ error: "Ek profile ko khud ke liye access grant nahi kiya ja sakta." }, { status: 400 });
  }

  // Upsert: if a request/grant already exists for this exact viewer+target
  // pair, just move it to "approved" instead of creating a duplicate.
  const grant = await AccessRequest.findOneAndUpdate(
    { user: viewerUser._id, targetProfile: targetProfile._id },
    { status: "approved", reason: (body.note || "").trim() || "Admin ne direct grant ki." },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
    .populate("user", "name email profileId")
    .populate("targetProfile", "name profileId");

  return NextResponse.json({ grant });
}
