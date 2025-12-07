"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Gamepad2, ShoppingCart, Users } from "lucide-react";
import { motion } from "motion/react";
import { navItemVariants, navIconVariants, spring } from "@/lib/animations";

const navItems = [
  { href: "/", label: "Новости", icon: Home },
  { href: "/game", label: "Игра", icon: Gamepad2 },
  { href: "/shop", label: "Магазин", icon: ShoppingCart },
  { href: "/referrals", label: "Друзья", icon: Users },
  { href: "/profile", label: "Профиль", icon: User }
];

export default function Navigation() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={spring}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-6"
    >
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className="flex-1">
              <motion.div
                variants={navItemVariants}
                animate={isActive ? "active" : "inactive"}
                whileTap="tap"
                className={`flex flex-col items-center justify-center h-full space-y-1 transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <motion.div variants={navIconVariants} animate={isActive ? "active" : "inactive"}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>
                <motion.span
                  className="text-xs font-medium"
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    fontWeight: isActive ? 600 : 500
                  }}
                  transition={spring}
                >
                  {label}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
