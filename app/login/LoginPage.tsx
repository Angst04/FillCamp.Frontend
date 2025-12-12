"use client";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { cardVariants } from "@/lib/animations";
import { Phone, User } from "lucide-react";
import { useTelegram } from "@/context/TelegramProvider";
import { RequestContactResponse } from "@twa-dev/types";
import { useRouter } from "next/navigation";
import { usePostUserMutations } from "@/api/hooks/user/usePostUserMutations";
import { useState } from "react";

export const LoginPage = () => {
  const [role, setRole] = useState<UserRole>("child");
  const [isError, setIsError] = useState<string | undefined>(undefined);
  const [parentTelegramId, setParentTelegramId] = useState<string | undefined>(undefined);
  const { mutateAsync: postUser } = usePostUserMutations();
  const { webApp } = useTelegram();
  const router = useRouter();
  const handleContinue = async () => {
    if (role === "child" && !parentTelegramId) {
      setIsError("Введите id своего родителя");
      return;
    }
    if (parentTelegramId) {
      const parsedId = Number(parentTelegramId);
      if (isNaN(parsedId) || parsedId < 0) {
        setIsError("Введите корректный id своего родителя");
        return;
      }
    }
    try {
      webApp?.requestContact(async (access: boolean, response?: RequestContactResponse) => {
        if (response?.status === "sent") {
          const phoneNumber = response.responseUnsafe.contact.phone_number;
          const setCookieResponse = await fetch("/api/logIn", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Telegram-Id": webApp?.initDataUnsafe.user?.id?.toString() ?? "2"
            },
            body: JSON.stringify({ phoneNumber: phoneNumber })
          });
          if (setCookieResponse.ok) {
            const user = await postUser({
              params: {
                telegram_id: response.responseUnsafe.contact.user_id ?? 2,
                first_name: response.responseUnsafe.contact.first_name ?? "",
                last_name: response.responseUnsafe.contact.last_name ?? "",
                username: webApp?.initDataUnsafe.user?.username ?? "",
                phone_number: phoneNumber,
                parent_telegram_id: parentTelegramId ? Number(parentTelegramId) : undefined,
                is_child: role === "child"
              }
            });
            if (user.success) {
              router.push("/");
            }
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
        const user = await postUser({
          params: {
            telegram_id: webApp?.initDataUnsafe.user?.id ?? 2,
            first_name: webApp?.initDataUnsafe.user?.first_name ?? "",
            last_name: webApp?.initDataUnsafe.user?.last_name ?? "",
            username: webApp?.initDataUnsafe.user?.username ?? "",
            phone_number: "+79999999999",
            is_child: role === "child",
            parent_telegram_id: parentTelegramId ? Number(parentTelegramId) : undefined
          }
        });
        if (user.success) {
          router.push("/");
        }
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="w-full max-w-[400px] bg-[#D9D9D9] rounded-2xl p-6 shadow-[2px_1px_6.7px_0px_rgba(0,0,0,0.1)] mb-12"
    >
      <div className="flex flex-row items-center justify-center mb-4 gap-2">
        <Button
          variant={role === "child" ? "primary" : "secondary"}
          onClick={() => setRole("child")}
          className="rounded-[18px]  text-lg font-bold leading-[1.1] text-white flex items-center justify-center gap-2"
        >
          <User size={12} />
          <span>Ребенок</span>
        </Button>
        <Button
          variant={role === "parent" ? "primary" : "secondary"}
          onClick={() => setRole("parent")}
          className="rounded-[18px]  text-lg font-bold leading-[1.1] text-white flex items-center justify-center gap-2"
        >
          <User size={18} />
          <span>Родитель</span>
        </Button>
      </div>
      {role === "child" && (
        <motion.div
          variants={cardVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col items-center justify-center mb-4"
        >
          <input
            type="text"
            placeholder="Введи id своего родителя"
            className="w-full rounded-[18px] text-lg font-bold text-black px-4 py-2 border border-black focus:outline-none"
            value={parentTelegramId}
            onChange={(e) => setParentTelegramId(e.target.value)}
          />
        </motion.div>
      )}
      <Button
        variant="secondary"
        onClick={handleContinue}
        className="rounded-[18px] py-4 px-20 text-lg font-bold leading-[1.1] text-white flex items-center justify-center gap-2"
      >
        <Phone size={18} />
        <span>Поделиться</span>
      </Button>
      <h2 className="text-center text-base font-normal text-[#656565] mb-6 leading-[1.1]">
        Поделитесь номером телефона, чтобы получить доступ к вашему аккаунту
      </h2>
      {isError && <p className="text-red-500 text-sm text-center mb-4">{isError}</p>}
    </motion.div>
  );
};
