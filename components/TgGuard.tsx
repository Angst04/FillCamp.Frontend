"use client";

import { useTelegram } from "@/context/TelegramProvider";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/Button";

const isDevelopment = process.env.NODE_ENV === "development";
const telegramLink = process.env.NEXT_PUBLIC_TG_APP_LINK ?? "";

export const TgGuard = ({ children }: { children: React.ReactNode }) => {
  const { isReady, webApp } = useTelegram();

  if (!isReady) {
    return <Loading />;
  }

  if (!isDevelopment && !webApp) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center bg-[#D9D9D9] rounded-2xl p-6 shadow-[2px_1px_6.7px_0px_rgba(0,0,0,0.1)]">
          <h1 className="text-lg font-bold text-black mb-3">Откройте приложение в Telegram</h1>
          <p className="text-sm text-[#656565] mb-6">
            Доступ к мини‑приложению возможен только через Telegram. Перейдите по ссылке и откройте мини‑апп.
          </p>
          {telegramLink ? (
            <a href={`https://t.me/${telegramLink}`} target="_blank" rel="noreferrer">
              <Button variant="primary" className="rounded-[18px] px-6 py-3 text-white">
                Открыть в Telegram
              </Button>
            </a>
          ) : (
            <p className="text-xs text-[#656565]">
              Ссылка на мини‑апп не настроена. Укажите `NEXT_PUBLIC_TG_APP_LINK` в `.env`.
            </p>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
