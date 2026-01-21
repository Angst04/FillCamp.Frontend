"use client";

import { useEffect } from "react";
import { useTelegram } from "@/context/TelegramProvider";

export const OrderSuccessHandler = () => {
  const { webApp, isReady } = useTelegram();

  useEffect(() => {
    if (!isReady || !webApp) return;

    const startParam = webApp.initDataUnsafe?.start_param;
    if (!startParam?.startsWith("order_")) return;

    const extractedOrderId = startParam.replace("order_", "");

    // Показываем встроенный попап Telegram каждый раз при наличии параметра
    webApp.showPopup({
      title: "Успех! 🎉",
      message: `Заказ #${extractedOrderId} успешно оплачен!`
    });
  }, [isReady, webApp]);

  return null; // Компонент не рендерит ничего
};
