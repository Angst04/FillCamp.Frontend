import { postOrders, PostOrdersConfig } from "@/api/requests/shop";
import { useTelegram } from "@/context/TelegramProvider";
import { useMutation } from "@tanstack/react-query";

export const usePostOrderMutation = () => {
  const { user } = useTelegram();
  return useMutation({
    mutationFn: async ({ params, config }: PostOrdersConfig) => {
      const response = await postOrders({
        params,
        config: {
          ...config,
          headers: {
            ...config?.headers,
            "X-Telegram-Id": user?.id?.toString() ?? "1"
          }
        }
      });

      if (!response.success || response.error) {
        const error = new Error(response.error?.detail as string);
        throw error;
      }

      return response.data;
    }
  });
};
