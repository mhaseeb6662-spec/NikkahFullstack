import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";

function genProfileId() {
  return "MAT-" + Math.floor(10000 + Math.random() * 89999);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email aur password required hain." }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "Is email se pehle hi account bana hua hai." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let profileId = genProfileId();
    // ensure uniqueness (very low collision chance, but check anyway)
    while (await User.findOne({ profileId })) {
      profileId = genProfileId();
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      profileId,
      role: "user",
      status: "pending",
    });

    const token = signToken({ id: user._id.toString(), role: user.role, email: user.email });
    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileId: user.profileId,
        status: user.status,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json({ error: err.message || "Register nahi ho saka." }, { status: 500 });
  }
}
