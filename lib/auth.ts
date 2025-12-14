import { cookies } from "next/headers";

export interface AuthSession {
  isLoggedIn: boolean;
  telegramId: string | null;
  phoneNumber: string | null;
  role: string | null;
}

/**
 * Get authentication session data from cookies
 * Use this in Server Components to access user session
 * @param currentTelegramId - Optional current Telegram user ID to validate against stored cookie
 */
export const getAuthSession = async (currentTelegramId?: string | null): Promise<AuthSession> => {
  const cookieStore = await cookies();
  const telegramId = cookieStore.get("telegramId")?.value ?? null;
  const phoneNumber = cookieStore.get("number")?.value ?? null;
  const role = cookieStore.get("role")?.value ?? null;

  // If currentTelegramId is provided, validate it matches the stored cookie
  if (currentTelegramId && telegramId) {
    if (currentTelegramId !== telegramId) {
      // IDs don't match - user switched accounts, clear cookies
      cookieStore.delete("number");
      cookieStore.delete("telegramId");
      cookieStore.delete("role");
      return {
        isLoggedIn: false,
        telegramId: null,
        phoneNumber: null,
        role: null
      };
    }
  }

  return {
    isLoggedIn: Boolean(telegramId && phoneNumber && role),
    telegramId,
    phoneNumber,
    role
  };
};

/**
 * Get Telegram ID from cookies
 * Use this in Server Components to get the Telegram ID for API requests
 */
export const getTelegramId = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  return cookieStore.get("telegramId")?.value ?? null;
};

/**
 * Check if user is authenticated
 * Use this in Server Components to protect routes
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const session = await getAuthSession();
  return session.isLoggedIn;
};

/**
 * Get headers with Telegram ID for server-side API requests
 * Use this when making fetch calls from Server Components
 */
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const telegramId = await getTelegramId();
  
  if (!telegramId) {
    return {};
  }

  return {
    "X-Telegram-Id": telegramId
  };
};

