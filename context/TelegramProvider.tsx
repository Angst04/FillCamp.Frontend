"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

interface TelegramContextType {
  user: TelegramUser | null;
  webApp: WebApp | null;
  isReady: boolean;
}

const getMockUserFromCookies = async (): Promise<TelegramUser> => {
  try {
    const response = await fetch("/api/getTelegramId");
    if (!response.ok) {
      throw new Error("Failed to fetch telegram ID");
    }

    const data = await response.json();

    if (data.telegramId) {
      const parsedId = parseInt(data.telegramId, 10);
      if (!isNaN(parsedId)) {
        const role = data.role || "child";
        return {
          id: parsedId,
          first_name: role === "parent" ? "Test Parent" : "Test Child",
          last_name: role === "parent" ? "Parentov" : "Childov",
          username: role === "parent" ? "test_parent" : "test_child"
        };
      }
    }
  } catch (error) {
    console.error("Error fetching telegram ID from cookies:", error);
  }

  // Default fallback if no cookie found or error
  return {
    id: 1,
    first_name: "Тестовый",
    last_name: "Пользователь",
    username: "testuser"
  };
};

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  webApp: null,
  isReady: false
});

export const useTelegram = () => useContext(TelegramContext);

const isMobileDevice = (): boolean => {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TelegramContextType>({
    user: null,
    webApp: null,
    isReady: false
  });

  const initTelegram = useCallback(async () => {
    if (typeof window === "undefined") return;

    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (isMobileDevice()) tg.requestFullscreen();

      // Use real Telegram user if available
      // Only use mock data if we're NOT in Telegram (for development)
      const realUser = tg.initDataUnsafe?.user;
      let user: TelegramUser | null = null;

      if (realUser) {
        // We have real Telegram user data
        user = realUser;
      } else {
        // We're in Telegram but user data is not available
        // This can happen if user is not authenticated or data is still loading
        // Don't use mock data here - return null instead
        user = null;
      }

      setState({
        webApp: tg,
        user,
        isReady: true
      });
    } else {
      // Not in Telegram WebApp - use mock data for development
      const mockUser = await getMockUserFromCookies();
      setState({
        webApp: null,
        user: mockUser,
        isReady: true
      });
    }
  }, []);

  useEffect(() => {
    initTelegram();

    // Listen for a custom event we'll dispatch after login/logout
    const handleAuthChange = () => {
      initTelegram();
    };

    window.addEventListener("auth-changed", handleAuthChange);

    return () => {
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, [initTelegram]);

  return <TelegramContext.Provider value={state}>{children}</TelegramContext.Provider>;
}
