"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "motion/react";
import { useTelegram } from "@/context/TelegramProvider";
import { useCallback } from "react";

const AboutCampButton = () => {
  const { webApp } = useTelegram();
  const handleLearnMore = useCallback(() => {
    webApp?.openLink("https://fillcamp.ru/about_us");
  }, [webApp]);

  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Button onClick={handleLearnMore}>Узнать больше о лагере 🏕️</Button>
    </motion.div>
  );
};

export default AboutCampButton;
