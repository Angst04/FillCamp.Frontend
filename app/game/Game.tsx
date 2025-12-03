"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CoinsDisplay from "@/app/game/(components)/CoinsDisplay";
import GameStatsCard from "@/app/game/(components)/GameStatsCard";
import GameButton from "@/app/game/(components)/GameButton";
import EnergyDisplay from "@/app/game/(components)/EnergyDisplay";
import UpgradesSection from "@/app/game/(components)/UpgradesSection";
import { motion } from "motion/react";
import { pageVariants } from "@/lib/animations";
import WebApp from "@twa-dev/sdk";

export default function Game() {
  const [coins, setCoins] = useState(1250); // Начальный баланс
  const [energy, setEnergy] = useState(1000); // Энергия
  const [maxEnergy] = useState(1000);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>(
    []
  );

  // Вычисляемые значения на основе coins
  const level = Math.floor(coins / 500) + 1;
  const coinsPerTap = 3; // Фиксированное значение +3 как в дизайне

  // Автоматическое восстановление энергии
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(prev + 1, maxEnergy));
    }, 1000); // +1 энергия в секунду

    return () => clearInterval(interval);
  }, [maxEnergy]);

  const handleTap = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (energy < coinsPerTap) {
      WebApp.HapticFeedback.notificationOccurred("error");
      return;
    }

    // Вибрация
    WebApp.HapticFeedback.impactOccurred("medium");

    // Добавляем монеты
    setCoins((prev) => prev + coinsPerTap);
    setEnergy((prev) => prev - coinsPerTap);

    // Анимация +1
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = Date.now();
    setClicks((prev) => [...prev, { id, x, y }]);

    // Удаляем анимацию через 1 секунду
    setTimeout(() => {
      setClicks((prev) => prev.filter((click) => click.id !== id));
    }, 1000);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen px-4 py-6 pb-20"
      style={{
        background: "linear-gradient(126deg, #0048F2 0%, #F0F0E9 80%)",
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

        <motion.div
          className="grid grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GameStatsCard icon={TrendingUp} label="Уровень" value={level} />
          <GameStatsCard
            icon={Zap}
            label="За клик"
            value={`+${coinsPerTap}`}
            backgroundColor="#F6F6F6"
          />
        </motion.div>

        <GameButton
          onClick={handleTap}
          disabled={energy < coinsPerTap}
          clicks={clicks}
          coinsPerTap={coinsPerTap}
        />

        <EnergyDisplay energy={energy} maxEnergy={maxEnergy} />

        <UpgradesSection />
      </div>
    </motion.div>
  );
}
