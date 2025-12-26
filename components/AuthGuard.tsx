"use client";
import { useUserQuery } from "@/api/hooks/user/useUserQuery";
import { useTelegram } from "@/context/TelegramProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/Loading";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isReady } = useTelegram();
  const { isLoading, isFetched, isAuthenticated, isNotRegistered } = useUserQuery();
  const router = useRouter();

  useEffect(() => {
    if (isReady && isFetched && (isNotRegistered || !isAuthenticated)) {
      router.replace("/login");
    }
  }, [isReady, isFetched, isAuthenticated, isNotRegistered, router]);

  if (!isReady || isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Loading />;
  }

  return <>{children}</>;
};

