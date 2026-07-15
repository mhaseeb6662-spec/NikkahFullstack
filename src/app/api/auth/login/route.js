import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email aur password required hain." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Email ya password ghalat hai." }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Email ya password ghalat hai." }, { status: 401 });
    }

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
        paymentStatus: user.paymentStatus,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: err.message || "Login nahi ho saka." }, { status: 500 });
  }
}
