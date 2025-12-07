import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;

    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set("number", phoneNumber, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365 * 100,
      path: "/"
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to set login cookie" }, { status: 500 });
  }
}
