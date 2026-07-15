import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import User from "@/models/User";
import AccessRequest from "@/models/AccessRequest";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const query = mongoose.isValidObjectId(id) ? { _id: id } : { profileId: id };
    const profile = await Profile.findOne(query).lean();

    if (!profile || profile.active === false) {
      return NextResponse.json({ error: "Profile nahi mili." }, { status: 404 });
    }

    // Decide whether the current visitor is allowed to see this profile's
    // private contact number and any photos the member has hidden from the
    // public. Three ways in: it's their own profile, they're the admin, or
    // the admin has specifically approved an access grant for them on this
    // exact profile (see /admin/access).
    const session = await getCurrentUser();
    let granted = false;
    let myAccessStatus = null;

    if (session?.role === "admin") {
      granted = true;
      myAccessStatus = "admin";
    } else if (session && String(profile.user) === String(session.id)) {
      granted = true;
      myAccessStatus = "self";
    } else if (session) {
      const grant = await AccessRequest.findOne({ user: session.id, targetProfile: profile._id }).lean();
      if (grant) {
        myAccessStatus = grant.status;
        if (grant.status === "approved") granted = true;
      }
    }

    // Photos hidden by the admin (moderation) are never sent to the public
    // site no matter what — that's a permanent takedown, not something an
    // access grant can override. Photos the member hid themselves are only
    // revealed to a viewer the admin has explicitly granted access to;
    // everyone else just sees a hidden-photo count.
    const allPhotos = profile.photos || [];
    const everyonePhotos = allPhotos.filter((p) => !p.hiddenByAdmin && !p.hiddenByUser).map((p) => p.url);
    const memberHiddenPhotos = allPhotos.filter((p) => !p.hiddenByAdmin && p.hiddenByUser).map((p) => p.url);

    const visiblePhotos = granted ? [...everyonePhotos, ...memberHiddenPhotos] : everyonePhotos;
    const hiddenPhotoCount = granted ? 0 : memberHiddenPhotos.length;

    // The member's personal contact number lives on their User account, not
    // the Profile document, and is only ever attached to this response when
    // access has been granted — it is never sent to a random visitor.
    let phone = null;
    if (granted) {
      const owner = await User.findById(profile.user).select("phone").lean();
      phone = owner?.phone || null;
    }

    return NextResponse.json({
      profile: {
        ...profile,
        photos: visiblePhotos,
        hiddenPhotoCount,
        phone,
        myAccessStatus,
      },
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    return NextResponse.json({ error: err.message || "Profile load nahi ho saki." }, { status: 500 });
  }
}
