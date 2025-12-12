import { postOrders, PostOrdersConfig } from "@/api/requests/shop";
import { useTelegram } from "@/context/TelegramProvider";
import { useMutation } from "@tanstack/react-query";

export const usePostOrderMutation = () => {
  const { webApp } = useTelegram();
  return useMutation({
    mutationFn: ({ params, config }: PostOrdersConfig) =>
      postOrders({
        params,
        config: {
          ...config,
          headers: {
            ...config?.headers,
            "X-Telegram-Id": webApp?.initDataUnsafe.user?.id?.toString() ?? "1"
          }
        }
      })
  });
};
