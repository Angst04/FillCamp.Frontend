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

      // Use real Telegram user if available, otherwise fetch from cookies
      const user = tg.initDataUnsafe?.user ?? (await getMockUserFromCookies());

      setState({
        webApp: tg,
        user,
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
