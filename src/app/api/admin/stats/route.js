import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Payment from "@/models/Payment";
import Profile from "@/models/Profile";
import AccessRequest from "@/models/AccessRequest";
import SuccessStory from "@/models/SuccessStory";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  await connectDB();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    activeProfiles,
    inactiveProfiles,
    pendingProfiles,
    pendingPayments,
    approvedPayments,
    pendingAccessRequests,
    paidUsers,
    successfulRishtas,
    recentRegistrations,
    totalRevenueAgg,
  ] = await Promise.all([
    User.countDocuments(),
    Profile.countDocuments({ active: true }),
    Profile.countDocuments({ active: false }),
    User.countDocuments({ status: "pending" }),
    Payment.countDocuments({ status: "pending" }),
    Payment.countDocuments({ status: "approved" }),
    AccessRequest.countDocuments({ status: "pending" }),
    User.countDocuments({ paymentStatus: "paid" }),
    SuccessStory.countDocuments(),
    User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    Payment.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  return NextResponse.json({
    stats: {
      totalUsers,
      activeProfiles,
      inactiveProfiles,
      pendingProfiles,
      pendingPayments,
      approvedPayments,
      pendingAccessRequests,
      paidUsers,
      successfulRishtas,
      recentRegistrations,
      totalRevenue: totalRevenueAgg[0]?.total || 0,
    },
  });
}
