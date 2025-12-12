import { getGameState } from "@/api/requests/game";
import { useQuery } from "@tanstack/react-query";
import { useTelegram } from "@/context/TelegramProvider";

export const useGetGameStateQuery = () => {
  const { user } = useTelegram();
  const id = user?.id?.toString() ?? "1";
  
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
    enabled: !!user,
  });
};

