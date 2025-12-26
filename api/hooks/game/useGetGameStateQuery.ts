import { getGameState } from "@/api/requests/game";
import { useQuery } from "@tanstack/react-query";
import { useTelegram } from "@/context/TelegramProvider";

export const useGetGameStateQuery = () => {
  const { webApp } = useTelegram();
  const id = webApp?.initDataUnsafe.user?.id?.toString() ?? "1";
  
  return useQuery({
    queryKey: ["gameState", id],
    queryFn: () =>
      getGameState({ 
        config: { 
          headers: { 
            "X-Telegram-Id": id
          } 
        } 
      }),
    enabled: !!webApp,
  });
};

