import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import AccessRequest from "@/models/AccessRequest";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(req, { params }) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json();
  await connectDB();

  const request = await AccessRequest.findByIdAndUpdate(id, { status }, { new: true });
  return NextResponse.json({ request });
}
