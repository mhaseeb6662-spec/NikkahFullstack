import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SuccessStory from "@/models/SuccessStory";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all");

  const session = all ? await getCurrentUser() : null;
  const filter = all && session?.role === "admin" ? {} : { published: true };

  const stories = await SuccessStory.find(filter).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ stories });
}

export async function POST(req) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    await connectDB();
    const story = await SuccessStory.create(body);
    return NextResponse.json({ story });
  } catch (err) {
    console.error("Success story create error:", err);
    return NextResponse.json({ error: err.message || "Story save nahi ho saki." }, { status: 500 });
  }
}
