import { getProfile } from "@/api/requests/profile";
import { useQuery } from "@tanstack/react-query";
import { useTelegram } from "@/context/TelegramProvider";

export const useGetProfileQuery = () => {
  const { webApp } = useTelegram();
  return useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      getProfile({ config: { headers: { "X-Telegram-Id": webApp?.initDataUnsafe.user?.id?.toString() ?? "1" } } })
  });
};
