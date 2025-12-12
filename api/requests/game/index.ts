import { api } from "@/api/instance";

export const getGameState = async ({ config }: FetchRequestConfig) =>
  api.get<GameStateResponse>("/game/state", config?.headers);
