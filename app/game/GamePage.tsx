"use client";

import { useTelegram } from "@/context/TelegramProvider";
import { useState, useEffect, useRef } from "react";
import PageHeader from "@/components/PageHeader";
import CoinsDisplay from "@/app/game/(components)/CoinsDisplay";
import GameButton from "@/app/game/(components)/GameButton";
import EnergyDisplay from "@/app/game/(components)/EnergyDisplay";
import { motion } from "motion/react";
import { pageVariants } from "@/lib/animations";
import { useGameWebSocket } from "@/api/hooks/game/useGameWebSocket";
import { useGetProfileQuery } from "@/api/hooks/profile/useGetProfileQuery";

const COINS_PER_TAP = 1;
const CLICK_ANIMATION_DURATION = 1000;

interface ClickAnimation {
  id: number;
  x: number;
  y: number;
}

export const GamePage = () => {
  const { webApp } = useTelegram();
  const { data: profile } = useGetProfileQuery();

  const telegramId = webApp?.initDataUnsafe.user?.id ?? 1;
  const initialCoins = profile?.data?.bonus_balance ?? 0;

  const {
    connectionState,
    sendClick,
    coins,
    energy,
    error: wsError
  } = useGameWebSocket(
    telegramId,
    initialCoins,
    1000 // Initial energy, will be synced from WebSocket
  );

  const [maxEnergy] = useState(1000);
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

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen px-4 pb-20 pt-10 mt-[-20px]"
      style={{
        background: "linear-gradient(126deg, #0048F2 0%, #F0F0E9 80%)"
      }}
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

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-2 bg-black/20 rounded text-white text-xs">
            <div>Connection: {connectionState}</div>
            <div>Energy: {energy}</div>
            <div>Coins: {coins}</div>
            <div>Disabled: {isDisabled ? "Yes" : "No"}</div>
            <div>Telegram ID: {telegramId || "Not available"}</div>
          </div>
        )}

        <GameButton onClick={handleTap} disabled={isDisabled} clicks={clicks} coinsPerTap={COINS_PER_TAP} />

        <EnergyDisplay energy={energy} maxEnergy={maxEnergy} />
      </div>
    </motion.div>
  );
};
