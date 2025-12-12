import { getProfile } from "@/api/requests/profile";
import { useQuery } from "@tanstack/react-query";
import { useTelegram } from "@/context/TelegramProvider";

export const useGetProfileQuery = () => {
  const { user } = useTelegram();
  const id = user?.id?.toString() ?? "1";
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => getProfile({ config: { headers: { "X-Telegram-Id": id } } }),
    enabled: !!user
  });
};
