"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { fadeInVariants, cardVariants } from "@/lib/animations";
import { Phone } from "lucide-react";
import { useTelegram } from "@/context/TelegramProvider";
import { RequestContactResponse } from "@twa-dev/types";
import { useRouter } from "next/navigation";
import Logo from "@/public/logo.png";

export const LoginPage = () => {
  const { webApp } = useTelegram();
  const router = useRouter();
  const handleContinue = async () => {
    try {
      webApp?.requestContact(async (access: boolean, response?: RequestContactResponse) => {
        if (response && response.status === "sent") {
          const phoneNumber = response.responseUnsafe.contact.phone_number?.toString();
          const setCookieResponse = await fetch("/api/logIn", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ phoneNumber: phoneNumber })
          });
          if (setCookieResponse.ok) {
            router.push("/");
          }
        }
      });
    } catch (error) {
      const setCookieResponse = await fetch("/api/logIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phoneNumber: "+79999999999" })
      });
      if (setCookieResponse.ok) {
        router.push("/");
      }
    }
  };

  return (
    <>
      {/* Authorization Section */}
      <motion.div
        variants={cardVariants}
        initial="initial"
        animate="animate"
        className="w-full max-w-[400px] bg-[#D9D9D9] rounded-2xl p-6 shadow-[2px_1px_6.7px_0px_rgba(0,0,0,0.1)] mb-12"
      >
        <h2 className="text-center text-base font-normal text-[#656565] mb-6 leading-[1.1]">
          Поделитесь номером телефона, чтобы получить доступ к вашему аккаунту
        </h2>
        <Button
          variant="secondary"
          onClick={handleContinue}
          className="rounded-[18px] py-4 px-20 text-lg font-bold leading-[1.1] text-white flex items-center justify-center gap-2"
        >
          <Phone size={18} />
          <span>Поделиться</span>
        </Button>
      </motion.div>
    </>
  );
};
