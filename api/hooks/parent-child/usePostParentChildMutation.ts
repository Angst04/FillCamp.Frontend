import { postParentChild, PostParentChildConfig } from "@/api/requests/parent-child";
import { useTelegram } from "@/context/TelegramProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePostParentChildMutation = () => {
  const { user } = useTelegram();
  const queryClient = useQueryClient();
  const telegramId = user?.id?.toString();

  return useMutation({
    mutationFn: async ({ params, config }: PostParentChildConfig) => {
      const response = await postParentChild({
        params,
        config: {
          ...config,
          headers: {
            ...config?.headers,
            "X-Telegram-Id": telegramId
          }
        }
      });

      if (!response.success || response.error) {
        const error = new Error(response.error?.detail as string);
        throw error;
      }

      return response.data;
    },
    onSuccess: () => {
      // Инвалидируем кэш запросов после успешной мутации
      queryClient.invalidateQueries({ queryKey: ["parent-child-requests"] });
    }
  });
};
