import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const filter = { active: true };
    const city = searchParams.get("city");
    const caste = searchParams.get("caste");
    const education = searchParams.get("education");
    const ageMin = searchParams.get("ageMin");
    const ageMax = searchParams.get("ageMax");
    const q = searchParams.get("q");

    if (city) filter.city = city;
    if (caste) filter.caste = caste;
    if (education) filter.education = { $regex: education, $options: "i" };
    if (ageMin || ageMax) {
      filter.age = {};
      if (ageMin) filter.age.$gte = Number(ageMin);
      if (ageMax) filter.age.$lte = Number(ageMax);
    }
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { profileId: { $regex: q, $options: "i" } },
      ];
    }

    // A logged-in member only ever sees opposite-gender profiles: a male
    // account is shown female profiles, and a female account is shown male
    // profiles. Admins are exempt and see everyone.
    const session = await getCurrentUser();
    if (session && session.role !== "admin") {
      const myProfile = await Profile.findOne({ user: session.id }).select("gender").lean();
      if (myProfile?.gender === "male") {
        filter.gender = "female";
      } else if (myProfile?.gender === "female") {
        filter.gender = "male";
      }
    }

    // Only select the lightweight fields a profile card needs. The old code
    // fetched every field (including the full `photos` array with every
    // photo's full base64 data) for up to 200 profiles on every page load —
    // that payload could reach hundreds of MB and is why listing pages were
    // slow or failing to load. We compute a single thumbnail server-side
    // instead of shipping the whole photos array to the client.
    const profiles = await Profile.find(filter)
      .select(
        "profileId name gender age city caste education profession about maritalStatus height religion verified active photo photos"
      )
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const trimmed = profiles.map((p) => {
      const thumbnail = p.photos?.find((ph) => !ph.hiddenByAdmin)?.url || p.photo || null;
      const { photos, ...rest } = p;
      return { ...rest, photo: thumbnail };
    });

    return NextResponse.json({ profiles: trimmed });
  } catch (err) {
    console.error("Profiles list error:", err);
    return NextResponse.json({ error: err.message || "Profiles load nahi ho sakin." }, { status: 500 });
  }
}
