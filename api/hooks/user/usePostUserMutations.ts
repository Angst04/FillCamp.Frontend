import { postUser, PostUserConfig } from "@/api/requests/user";
import { useTelegram } from "@/context/TelegramProvider";
import { useMutation } from "@tanstack/react-query";

export const usePostUserMutations = () => {
  const { webApp } = useTelegram();
  return useMutation({
    mutationFn: ({ params, config }: PostUserConfig) =>
      postUser({
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
