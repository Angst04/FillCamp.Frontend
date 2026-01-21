"use client";

import { motion } from "motion/react";
import { listItemVariants } from "@/lib/animations";

interface UserListItemProps {
  name: string;
  bonus: number;
  username?: string;
  avatarLetter?: string;
  avatarGradient?: string;
  rightContent?: React.ReactNode;
  className?: string;
}

export default function UserListItem({
  name,
  bonus,
  username,
  avatarLetter,
  avatarGradient = "from-blue-500 to-purple-600",
  className = ""
}: UserListItemProps) {
  return (
    <motion.div
      variants={listItemVariants}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl ${className}`}
    >
      <div className="flex items-center space-x-3">
        <motion.div
          className={`w-10 h-10 bg-gradient-to-br ${avatarGradient} rounded-full flex items-center justify-center text-white font-bold`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {avatarLetter || name.charAt(0)}
        </motion.div>
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          {username !== undefined && (
            <p className="text-sm text-gray-500">{username ? `@${username}` : "Без username"}</p>
          )}
        </div>

      </div>
      {bonus > 0 && <div className="text-right flex flex-col items-end gap-1">
        <p className="font-semibold text-green-400">+{bonus}</p>
      </div>}
    </motion.div>
  );
}
