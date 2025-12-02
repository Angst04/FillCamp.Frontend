'use client';

import { LucideIcon } from "lucide-react";
import { motion } from 'motion/react';
import { cardVariants } from '@/lib/animations';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    iconColor?: string;
    className?: string;
}

export default function StatCard({
    icon: Icon,
    label,
    value,
    iconColor = "text-blue-600",
    className = "",
}: StatCardProps) {
    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            className={`bg-white rounded-2xl p-4 shadow-sm ${className}`}
        >
            <motion.div
                className={`flex items-center space-x-2 ${iconColor} mb-1`}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <Icon size={20} />
                <span className="text-sm font-medium">{label}</span>
            </motion.div>
            <motion.p
                className="text-2xl font-bold text-gray-900"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {value}
            </motion.p>
        </motion.div>
    );
}
