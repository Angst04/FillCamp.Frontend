"use client";

import { useTelegram } from "@/context/TelegramProvider";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import CoinsDisplay from "@/app/game/(components)/CoinsDisplay";
import GameButton from "@/app/game/(components)/GameButton";
import EnergyDisplay from "@/app/game/(components)/EnergyDisplay";
import { motion } from "motion/react";
import { pageVariants } from "@/lib/animations";
import { useGameWebSocket } from "@/api/hooks/game/useGameWebSocket";
import { useGetGameStateQuery } from "@/api/hooks/game/useGetGameStateQuery";
import { useUserQuery } from "@/api/hooks/user/useUserQuery";

const COINS_PER_TAP = 0.05;
const CLICK_ANIMATION_DURATION = 1000;
const MAX_ENERGY = Math.floor(250 / COINS_PER_TAP);

interface ClickAnimation {
  id: number;
  x: number;
  y: number;
}

export const GamePage = () => {
  const { user: telegramUser, webApp } = useTelegram();
  const { user } = useUserQuery();
  const { data: gameState, isLoading } = useGetGameStateQuery();
  const router = useRouter();

  // Redirect parents to home page
  useEffect(() => {
    if (user?.role === "parent") {
      router.replace("/");
    }
  }, [user?.role, router]);

  // Don't render game for parents
  if (user?.role === "parent") {
    return null;
  }

  const telegramId = telegramUser?.id ?? 1;

  // Wait for game state to load before initializing WebSocket
  const initialCoins = gameState?.data?.new_bonus_balance ?? 0;
  const initialEnergy = gameState?.data?.current_energy;

  const {
    connectionState,
    sendClick,
    coins,
    energy,
    error: wsError
  } = useGameWebSocket(!isLoading && gameState ? telegramId : undefined, initialCoins, initialEnergy);

  const [clicks, setClicks] = useState<ClickAnimation[]>([]);
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  const addClickAnimation = (x: number, y: number) => {
    const id = Date.now();
    setClicks((prev) => [...prev, { id, x, y }]);

    const timeoutId = setTimeout(() => {
      setClicks((prev) => prev.filter((click) => click.id !== id));
      timeoutsRef.current.delete(timeoutId);
    }, CLICK_ANIMATION_DURATION);

    timeoutsRef.current.add(timeoutId);
  };

  const handleTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (energy < COINS_PER_TAP) {
      webApp?.HapticFeedback.notificationOccurred("error");
      return;
    }

    if (connectionState !== "connected") {
      webApp?.HapticFeedback.notificationOccurred("error");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    webApp?.HapticFeedback.impactOccurred("medium");
    sendClick();
    addClickAnimation(clickX, clickY);
  };

  const isDisabled = energy < COINS_PER_TAP || connectionState !== "connected";

  if (isLoading) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen px-4 pb-20 pt-10 mt-[-20px] flex items-center justify-center"
        style={{
          background: "linear-gradient(126deg, #0048F2 0%, #F0F0E9 80%)"
        }}
      >
        <div className="text-white text-xl">Загрузка игры...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen px-4 pb-20 pt-10 mt-[-20px]"
    >
      <div className="max-w-2xl mx-auto">
        <PageHeader
          title="Игра"
          description="Нажимай и зарабатывай бонусы!"
          emoji="🎮"
          centered
          textColor="text-white"
        />

        {wsError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-white text-sm text-center"
          >
            {wsError}
            {connectionState === "connecting" && " Подключение..."}
          </motion.div>
        )}

        {connectionState === "connecting" && !wsError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg text-white text-sm text-center"
          >
            Подключение к серверу...
          </motion.div>
        )}

        <CoinsDisplay coins={coins} />

        <GameButton onClick={handleTap} disabled={isDisabled} clicks={clicks} coinsPerTap={COINS_PER_TAP} />

        <EnergyDisplay energy={energy} maxEnergy={MAX_ENERGY} />
      </div>
    </motion.div>
  );
};
