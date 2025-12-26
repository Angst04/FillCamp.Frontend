import { getParentChildRequests } from "@/api/requests/parent-child";
import { useTelegram } from "@/context/TelegramProvider";
import { useQuery } from "@tanstack/react-query";

export const useGetParentChildRequestsQuery = () => {
  const { user } = useTelegram();
  const telegramId = user?.id?.toString();

  return useQuery({
    queryKey: ["parent-child-requests"],
    queryFn: async () => {
      const response = await getParentChildRequests({
        config: {
          headers: {
            "X-Telegram-Id": telegramId
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
