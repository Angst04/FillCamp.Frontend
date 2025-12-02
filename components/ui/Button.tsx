'use client';

import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { buttonVariants } from '@/lib/animations';

type ButtonVariant = 'primary' | 'secondary' | 'gradient' | 'icon';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg',
  icon: 'bg-blue-600 text-white hover:bg-blue-700 p-3 rounded-full',
};

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'py-4 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed';
  const widthClass = variant === 'icon' ? '' : 'w-full';
  
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
}

