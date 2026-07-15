import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Login required." }, { status: 401 });

  await connectDB();

  if (session.role === "admin") {
    const payments = await Payment.find().populate("user", "name email profileId").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ payments });
  }

  const payments = await Payment.find({ user: session.id }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ payments });
}

export async function POST(req) {
  const session = await getCurrentUser();
  if (!session) return NextResponse.json({ error: "Login required." }, { status: 401 });

  try {
    const body = await req.json();
    await connectDB();

    const payment = await Payment.create({
      user: session.id,
      amount: body.amount,
      method: body.method,
      transactionId: body.transactionId,
      screenshot: body.screenshot,
      status: "pending",
    });

    await User.findByIdAndUpdate(session.id, { paymentStatus: "pending" });

    return NextResponse.json({ payment });
  } catch (err) {
    console.error("Payment create error:", err);
    return NextResponse.json({ error: err.message || "Payment save nahi ho saki." }, { status: 500 });
  }
}
