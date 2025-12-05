"use client";

import Button from "@/components/ui/Button";
import { motion } from "motion/react";

interface AboutCampButtonProps {
  url?: string;
}

const AboutCampButton: React.FC<AboutCampButtonProps> = ({ url = "https://your-camp-website.com" }) => {
  const handleLearnMore = () => {
    window.open(url, "_blank");
  };

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
