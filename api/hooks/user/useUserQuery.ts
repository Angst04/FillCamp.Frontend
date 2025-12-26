import { useTelegram } from "@/context/TelegramProvider";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/requests";

export const useUserQuery = () => {
  const { webApp, isReady } = useTelegram();
  const telegramId = webApp?.initDataUnsafe.user?.id?.toString() ?? "1";

  const query = useQuery({
    queryKey: ["user", telegramId],
    queryFn: () => getUser({ config: { headers: { "X-Telegram-Id": telegramId } } }),
    enabled: isReady,
    retry: (failureCount, error) => {
      // Don't retry on 404 (user not found)
      if (error instanceof Error && error.message.includes("404")) {
        return false;
      }
      return failureCount < 3;
    }
  });

  // Determine if user is not registered (404 response)
  const isNotRegistered = query.data?.success === false && query.data?.status === 404;
  const isAuthenticated = query.data?.success === true && query.data?.data !== undefined;
  const user = query.data?.data;

  return {
    ...query,
    telegramId,
    user,
    isAuthenticated,
    isNotRegistered
  };
};
