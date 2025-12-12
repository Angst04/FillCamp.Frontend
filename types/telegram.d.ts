import { Telegram } from "@twa-dev/types";

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
  type WebApp = Telegram["WebApp"];

  type TelegramUser = Telegram["User"];
}
export {};
