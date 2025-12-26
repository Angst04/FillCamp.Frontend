"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { isMobileDevice } from "@/lib/utils";

interface TelegramContextType {
  user: TelegramUser | null;
  webApp: WebApp | null;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  webApp: null,
  isReady: false
});

export const useTelegram = () => useContext(TelegramContext);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TelegramContextType>({
    user: null,
    webApp: null,
    isReady: false
  });

  const initTelegram = useCallback(async () => {
    if (typeof window === "undefined") return;

    const tg = window.Telegram?.WebApp;
    const telegramUser = tg?.initDataUnsafe?.user;

    // Check if we have real Telegram user data (running inside Telegram)
    if (tg && telegramUser?.id) {
      tg.ready();
      tg.expand();
      if (isMobileDevice()) tg.requestFullscreen();

      setState({
        webApp: tg,
        user: telegramUser,
        isReady: true
      });
    } else {
      // Not in Telegram or no user data - use mock data for development
      const mockUser = {
        id: 1,
        first_name: "Test Parent",
        last_name: "Parentov",
        username: "test_parent"
      };

      setState({
        webApp: null, // Set to null to indicate dev mode
        user: mockUser,
        isReady: true
      });
    }
  }, []);

  useEffect(() => {
    initTelegram();
  }, [initTelegram]);

  return <TelegramContext.Provider value={state}>{children}</TelegramContext.Provider>;
}
