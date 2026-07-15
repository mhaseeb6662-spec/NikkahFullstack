import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SuccessStory from "@/models/SuccessStory";
import { getCurrentUser } from "@/lib/auth";

async function requireAdmin() {
  const session = await getCurrentUser();
  return session?.role === "admin" ? session : null;
}

export async function PATCH(req, { params }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  await connectDB();
  const story = await SuccessStory.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json({ story });
}

export async function DELETE(_req, { params }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { id } = await params;
  await connectDB();
  await SuccessStory.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
