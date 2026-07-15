import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import User from "@/models/User";
import Profile from "@/models/Profile";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(req, { params }) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { status } = await req.json();
    await connectDB();

    const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true });
    if (!payment) return NextResponse.json({ error: "Payment nahi mili." }, { status: 404 });

    if (status === "approved") {
      await User.findByIdAndUpdate(payment.user, { paymentStatus: "paid", status: "active" });
      // Keep the member's public Profile listing in sync so the Profiles &
      // Photos page also shows them as Active — otherwise admins see the
      // payment approved here but the profile still looks inactive there.
      await Profile.findOneAndUpdate({ user: payment.user }, { active: true });
    } else if (status === "rejected") {
      await User.findByIdAndUpdate(payment.user, { paymentStatus: "unpaid" });
    }

    return NextResponse.json({ payment });
  } catch (err) {
    console.error("Payment update error:", err);
    return NextResponse.json({ error: err.message || "Payment update nahi ho saki." }, { status: 500 });
  }
}
