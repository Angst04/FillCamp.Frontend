import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const phoneNumber = cookieStore.get("number");
    const telegramId = cookieStore.get("telegramId");
    const role = cookieStore.get("role");

    // Check if all required cookies exist
    if (!phoneNumber?.value || !telegramId?.value || !role?.value) {
      return NextResponse.json({ isLoggedIn: false }, { status: 401 });
    }

    // Get current Telegram ID from query parameter (if provided)
    const { searchParams } = new URL(request.url);
    const currentTelegramId = searchParams.get("currentTelegramId");

    // If currentTelegramId is provided, validate it matches the stored cookie
    if (currentTelegramId) {
      if (currentTelegramId !== telegramId.value) {
        // IDs don't match - user switched accounts, clear cookies
        cookieStore.delete("number");
        cookieStore.delete("telegramId");
        cookieStore.delete("role");
        return NextResponse.json({ isLoggedIn: false }, { status: 401 });
      }
    }

    // IDs match (or validation skipped for backward compatibility)
    return NextResponse.json(
      {
        isLoggedIn: true,
        phoneNumber: phoneNumber.value,
        telegramId: telegramId.value,
        role: role.value
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ isLoggedIn: false, error: "Failed to check login status" }, { status: 500 });
  }
}
