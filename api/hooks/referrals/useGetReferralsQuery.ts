import { getReferrals } from "@/api/requests/referrals";
import { useTelegram } from "@/context/TelegramProvider";
import { useQuery } from "@tanstack/react-query";

export const useGetReferralsQuery = () => {
  const { webApp } = useTelegram();
  return useQuery({
    queryKey: ["referrals"],
    queryFn: () =>
      getReferrals({ config: { headers: { "X-Telegram-Id": webApp?.initDataUnsafe.user?.id?.toString() ?? "1" } } })
  });
};
