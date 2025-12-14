"use client";

import { useTelegram } from "@/context/TelegramProvider";
import { useQuery } from "@tanstack/react-query";

interface AuthResponse {
  isLoggedIn: boolean;
  phoneNumber?: string;
  telegramId?: string;
  role?: string;
}

const fetchAuthStatus = async (currentTelegramId: string | null): Promise<AuthResponse> => {
  const url = new URL("/api/isLoggedIn", window.location.origin);
  if (currentTelegramId) {
    url.searchParams.set("currentTelegramId", currentTelegramId);
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Failed to fetch auth status");
  }
  return response.json();
};

export const useAuth = () => {
  const { user } = useTelegram();
  const currentTelegramId = user?.id?.toString() ?? null;
  const id = currentTelegramId ?? "1";
  
  return useQuery({
    queryKey: ["auth", id],
    queryFn: () => fetchAuthStatus(currentTelegramId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    enabled: !!user
  });
};
