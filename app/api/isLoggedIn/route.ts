import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const phoneNumber = cookieStore.get("number");
    const telegramId = cookieStore.get("telegramId");
    const role = cookieStore.get("role");

    if (phoneNumber?.value && telegramId?.value && role?.value) {
      return NextResponse.json(
        {
          isLoggedIn: true,
          phoneNumber: phoneNumber.value,
          telegramId: telegramId.value,
          role: role.value
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ isLoggedIn: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false, error: "Failed to check login status" }, { status: 500 });
  }
}
