import { getReferrals } from "@/api/requests/referrals";
import { useTelegram } from "@/context/TelegramProvider";
import { useQuery } from "@tanstack/react-query";

export const useGetReferralsQuery = () => {
  const { webApp } = useTelegram();
  const id = webApp?.initDataUnsafe.user?.id?.toString() ?? "1";
  return useQuery({
    queryKey: ["referrals", id],
    queryFn: () =>
      getReferrals({ config: { headers: { "X-Telegram-Id": id } } })
  });
};
