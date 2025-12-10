"use client";

import { useTelegram } from "@/context/TelegramProvider";
import { useState, useEffect, useRef } from "react";
import PageHeader from "@/components/PageHeader";
import CoinsDisplay from "@/app/game/(components)/CoinsDisplay";
import GameButton from "@/app/game/(components)/GameButton";
import EnergyDisplay from "@/app/game/(components)/EnergyDisplay";
import { motion } from "motion/react";
import { pageVariants } from "@/lib/animations";

const COINS_PER_TAP = 1;
const CLICK_ANIMATION_DURATION = 1000;

interface ClickAnimation {
  id: number;
  x: number;
  y: number;
}

export const GamePage = () => {
  const { webApp } = useTelegram();
  const [coins, setCoins] = useState(1250);
  const [energy, setEnergy] = useState(1000);
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

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    webApp?.HapticFeedback.impactOccurred("medium");
    setCoins((prev) => prev + COINS_PER_TAP);
    setEnergy((prev) => prev - COINS_PER_TAP);
    addClickAnimation(clickX, clickY);
  };

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

        <CoinsDisplay coins={coins} />

        <GameButton onClick={handleTap} disabled={energy < COINS_PER_TAP} clicks={clicks} coinsPerTap={COINS_PER_TAP} />

        <EnergyDisplay energy={energy} maxEnergy={maxEnergy} />
      </div>
    </motion.div>
  );
};
