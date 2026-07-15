import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

// Account Settings endpoint — only handles the two things that page still
// offers: updating the phone number, and changing the password. Sent
// separately from the profile-details save (/api/profiles/me) since these
// live on the User model, not the Profile model.
export async function PATCH(req) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Login required." }, { status: 401 });

  try {
    const { phone, currentPassword, newPassword } = await req.json();

    await connectDB();
    const user = await User.findById(session.id);
    if (!user) return NextResponse.json({ error: "User nahi mila." }, { status: 404 });

    const wantsPasswordChange = currentPassword || newPassword;

    if (wantsPasswordChange) {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: "Password change ke liye current aur new password dono required hain." },
          { status: 400 }
        );
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Naya password kam az kam 6 characters ka hona chahiye." },
          { status: 400 }
        );
      }
      const matches = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!matches) {
        return NextResponse.json({ error: "Current password ghalat hai." }, { status: 400 });
      }
      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    if (typeof phone === "string") {
      user.phone = phone.trim();
    }

    await user.save();

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
    console.error("Account update error:", err);
    return NextResponse.json({ error: err.message || "Account update nahi ho saka." }, { status: 500 });
  }
}
