"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export const RouteBackground = () => {
  const pathname = usePathname();
  const isGamePage = pathname === "/game";

  useEffect(() => {
    if (isGamePage) {
      document.documentElement.style.background = "linear-gradient(126deg, #0048F2 0%, #F0F0E9 80%)";
      document.body.style.background = "linear-gradient(126deg, #0048F2 0%, #F0F0E9 80%)";
    } else {
      document.documentElement.style.background = "";
      document.body.style.background = "";
    }

    return () => {
      document.documentElement.style.background = "";
      document.body.style.background = "";
    };
  }, [isGamePage]);

  return null;
};

