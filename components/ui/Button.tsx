"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
import { buttonVariants } from "@/lib/animations";

type ButtonVariant = "primary" | "secondary" | "gradient" | "icon";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[var(--color-primary)] text-white hover:opacity-90 hover:shadow-lg",
  secondary: "bg-[var(--color-secondary)] text-[var(--color-background)] hover:opacity-90 hover:shadow-lg",
  gradient:
    "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white  hover:opacity-90 hover:shadow-lg",
  icon: "bg-transparent border border-black text-black hover:opacity-90 p-3 rounded-full"
};

export const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  type = "button"
}: ButtonProps) => {
  const baseStyles = variant === "icon" 
    ? "font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
    : "py-4 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed";
  const widthClass = variant === "icon" ? "" : "w-full";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      className={`${baseStyles} ${variantStyles[variant]} ${widthClass} ${className}`}
    >
      {children}
    </motion.button>
  );
};
