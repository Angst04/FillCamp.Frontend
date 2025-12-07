import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const phoneNumber = cookieStore.get("number");

    if (phoneNumber && phoneNumber.value) {
      return NextResponse.json({ isLoggedIn: true, phoneNumber: phoneNumber.value }, { status: 200 });
    }

    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false, error: "Failed to check login status" }, { status: 500 });
  }
}
