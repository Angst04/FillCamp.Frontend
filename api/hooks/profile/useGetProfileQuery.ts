import { getProfile } from "@/api/requests/profile";
import { useQuery } from "@tanstack/react-query";
import { useTelegram } from "@/context/TelegramProvider";

export const useGetProfileQuery = () => {
  const { webApp } = useTelegram();
  const id = webApp?.initDataUnsafe.user?.id?.toString() ?? "1";
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => getProfile({ config: { headers: { "X-Telegram-Id": id } } })
  });
};
