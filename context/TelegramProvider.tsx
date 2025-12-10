"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

interface TelegramContextType {
  user: TelegramUser | null;
  webApp: WebApp | null;
  isReady: boolean;
}

const MOCK_USER: TelegramUser = {
  id: 123456789,
  first_name: "Тестовый",
  last_name: "Пользователь",
  username: "testuser"
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

  const initTelegram = useCallback(() => {
    if (typeof window === "undefined") return;

    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (isMobileDevice()) tg.requestFullscreen();
      setState({
        webApp: tg,
        user: tg.initDataUnsafe?.user ?? MOCK_USER,
        isReady: true
      });
    }
  }, []);

  useEffect(() => {
    initTelegram();
  }, [initTelegram]);

  return <TelegramContext.Provider value={state}>{children}</TelegramContext.Provider>;
}
