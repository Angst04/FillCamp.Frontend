'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramContextType {
  user: TelegramUser | null;
  webApp: any | null;
  isReady: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
  user: null,
  webApp: null,
  isReady: false,
});

export const useTelegram = () => useContext(TelegramContext);

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [webApp, setWebApp] = useState<any | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = window.Telegram?.WebApp;
      
      if (tg) {
        tg.ready();
        tg.expand();
        setWebApp(tg);
        
        const telegramUser = tg.initDataUnsafe?.user;
        if (telegramUser) {
          setUser(telegramUser);
        }
        
        setIsReady(true);
      } else {
        // Для тестирования вне Telegram
        console.warn('Telegram WebApp не доступен. Используем моковые данные для разработки.');
        setUser({
          id: 123456789,
          first_name: 'Тестовый',
          last_name: 'Пользователь',
          username: 'testuser',
        });
        setIsReady(true);
      }
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ user, webApp, isReady }}>
      {children}
    </TelegramContext.Provider>
  );
}

