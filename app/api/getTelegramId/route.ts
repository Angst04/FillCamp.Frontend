import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const telegramId = cookieStore.get("telegramId")?.value;
    const role = cookieStore.get("role")?.value;

    if (!telegramId) {
      return NextResponse.json({ telegramId: null, role: null }, { status: 200 });
    }

    return NextResponse.json({ telegramId, role }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get telegram ID" }, { status: 500 });
  }
}

