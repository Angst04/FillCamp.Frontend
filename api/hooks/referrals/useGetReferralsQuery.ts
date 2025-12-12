import { getReferrals } from "@/api/requests/referrals";
import { useTelegram } from "@/context/TelegramProvider";
import { useQuery } from "@tanstack/react-query";

export const useGetReferralsQuery = () => {
  const { user } = useTelegram();
  const id = user?.id?.toString() ?? "1";
  return useQuery({
    queryKey: ["referrals", id],
    queryFn: () =>
      getReferrals({ config: { headers: { "X-Telegram-Id": id } } }),
    enabled: !!user
  });
};
