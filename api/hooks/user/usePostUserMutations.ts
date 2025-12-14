import { postUser, PostUserConfig } from "@/api/requests/user";
import { useTelegram } from "@/context/TelegramProvider";
import { useMutation } from "@tanstack/react-query";

export const usePostUserMutations = () => {
  const { user, referralCode } = useTelegram();
  return useMutation({
    mutationFn: ({ params, config }: PostUserConfig) => {
      // Only set default X-Telegram-Id if not already provided in config
      const telegramId = config?.headers?.["X-Telegram-Id"] 
        ?? user?.id?.toString() 
        ?? "1";
      
      // Build headers object, adding referral code if available
      const headers: Record<string, string> = {
        ...config?.headers,
        "X-Telegram-Id": telegramId
      };

      // Add referral code header if present
      if (referralCode) {
        headers["X-Referral-Code"] = referralCode;
      }
      
      return postUser({
        params,
        config: {
          ...config,
          headers
        }
      });
    }
  });
};

