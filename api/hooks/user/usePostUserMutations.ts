import { postUser, PostUserConfig } from "@/api/requests/user";
import { useTelegram } from "@/context/TelegramProvider";
import { useMutation } from "@tanstack/react-query";

export const usePostUserMutations = () => {
  const { user } = useTelegram();
  return useMutation({
    mutationFn: ({ params, config }: PostUserConfig) => {
      // Only set default X-Telegram-Id if not already provided in config
      const telegramId = config?.headers?.["X-Telegram-Id"] 
        ?? user?.id?.toString() 
        ?? "1";
      
      return postUser({
        params,
        config: {
          ...config,
          headers: {
            ...config?.headers,
            "X-Telegram-Id": telegramId
          }
        }
      });
    }
  });
};

