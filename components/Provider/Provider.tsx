"use client";

import WebApp from "@twa-dev/sdk";
import { domAnimation, LazyMotion } from "motion/react";
import { useEffect, ReactNode } from "react";

export function Provider({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      WebApp.ready();
      WebApp.expand();
      WebApp.requestFullscreen();
      WebApp.disableClosingConfirmation();
      WebApp.disableVerticalSwipes();
    } catch (e) {
      console.warn(`Telegram WebApp не доступен: ${e}`);
    }
  }, []);

  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
