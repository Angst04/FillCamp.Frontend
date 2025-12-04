"use client";

import { createContext, useContext, useEffect, useMemo, ReactNode } from "react";

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

export function TelegramProvider({ children }: { children: ReactNode }) {
  const state = useMemo<TelegramContextType>(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      return {
        webApp: tg,
        user: tg.initDataUnsafe?.user ?? null,
        isReady: true
      };
    }

    console.warn("Telegram WebApp не доступен. Используем моковые данные для разработки.");
    return { webApp: null, user: MOCK_USER, isReady: true };
  }, []);

  useEffect(() => {
    const tg = state.webApp;
    if (!tg) return;

    try {
      tg.ready();
      tg.expand();
      tg.requestFullscreen();
    } catch (e) {
      console.warn(`Ошибка инициализации Telegram WebApp: ${e}`);
    }
  }, [state.webApp]);

  return <TelegramContext.Provider value={state}>{children}</TelegramContext.Provider>;
}
