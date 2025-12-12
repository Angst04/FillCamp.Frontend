import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 365, // 1 year
  path: "/"
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, role } = body;
    const telegramId = request.headers.get("X-Telegram-Id");

    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    if (!telegramId) {
      return NextResponse.json({ error: "Telegram ID is required" }, { status: 400 });
    }

    if (!role || typeof role !== "string") {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    
    cookieStore.set("number", phoneNumber, COOKIE_OPTIONS);
    cookieStore.set("telegramId", telegramId, COOKIE_OPTIONS);
    cookieStore.set("role", role, COOKIE_OPTIONS);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to set login cookie" }, { status: 500 });
  }
}
