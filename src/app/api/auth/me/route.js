import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) return NextResponse.json({ user: null });

    await connectDB();
    const user = await User.findById(session.id).lean();
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileId: user.profileId,
        status: user.status,
        paymentStatus: user.paymentStatus,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    console.error("Me error:", err);
    return NextResponse.json({ user: null });
  }
}
