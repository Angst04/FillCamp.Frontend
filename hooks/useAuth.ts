"use client";

import { useTelegram } from "@/context/TelegramProvider";
import { useQuery } from "@tanstack/react-query";

interface AuthResponse {
  isLoggedIn: boolean;
  phoneNumber?: string;
  telegramId?: string;
  role?: string;
}

const fetchAuthStatus = async (): Promise<AuthResponse> => {
  const response = await fetch("/api/isLoggedIn");
  if (!response.ok) {
    throw new Error("Failed to fetch auth status");
  }
  return response.json();
};

export const useAuth = () => {
  const { user } = useTelegram();
  const id = user?.id?.toString() ?? "1";
  return useQuery({
    queryKey: ["auth", id],
    queryFn: fetchAuthStatus,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
    enabled: !!user
  });
};
