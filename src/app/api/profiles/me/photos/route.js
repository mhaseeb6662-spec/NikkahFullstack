import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Profile from "@/models/Profile";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";
import { saveDataUrlAsFile } from "@/lib/uploadImage";

const MAX_PHOTOS = 8;
// Rough cap so someone can't upload an absurdly huge image file.
const MAX_DATA_URL_LENGTH = 6_000_000; // ~4.5MB image

export async function POST(req) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Login required." }, { status: 401 });

  try {
    const { dataUrl } = await req.json();
    if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "Sirf image file upload karein." }, { status: 400 });
    }
    if (dataUrl.length > MAX_DATA_URL_LENGTH) {
      return NextResponse.json({ error: "Image bohat bari hai. Chota size try karein." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ error: "User nahi mila." }, { status: 404 });

    let profile = await Profile.findOne({ user: session.id });
    if (!profile) {
      profile = await Profile.create({ user: session.id, profileId: user.profileId, name: user.name, photos: [] });
    }

    if (profile.photos.length >= MAX_PHOTOS) {
      return NextResponse.json({ error: `Zyada se zyada ${MAX_PHOTOS} photos allowed hain.` }, { status: 400 });
    }

    // Store the image as an actual file on disk; only the lightweight URL
    // path goes into MongoDB (instead of the full base64 blob).
    const url = await saveDataUrlAsFile(dataUrl, `profiles/${session.id}`);

    profile.photos.push({ url, hiddenByUser: false, hiddenByAdmin: false });
    if (!profile.photo) profile.photo = url;
    await profile.save();

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Photo upload error:", err);
    return NextResponse.json({ error: err.message || "Photo upload nahi ho saki." }, { status: 500 });
  }
}
