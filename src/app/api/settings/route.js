import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const settings = await Setting.find().lean();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return NextResponse.json({ settings: map });
}

export async function POST(req) {
  const session = await getCurrentUser();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const body = await req.json();
  await connectDB();

  const entries = Object.entries(body);
  await Promise.all(
    entries.map(([key, value]) => Setting.findOneAndUpdate({ key }, { value }, { upsert: true }))
  );

  return NextResponse.json({ ok: true });
}
