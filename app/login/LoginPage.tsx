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
import { useQueryClient } from "@tanstack/react-query";

// Test data for local development outside of Telegram
const getTestData = (role: UserRole) => ({
  telegramId: role === "parent" ? 1 : 2,
  firstName: role === "parent" ? "Test Parent" : "Test Child",
  lastName: role === "parent" ? "Parentov" : "Childov",
  username: role === "parent" ? "test_parent" : "test_child",
  phone: role === "parent" ? "+71111111111" : "+72222222222"
});

export const LoginPage = () => {
  const [role, setRole] = useState<UserRole>("child");
  const [isError, setIsError] = useState<string | undefined>(undefined);
  const [parentTelegramId, setParentTelegramId] = useState<string>("");
  const { mutateAsync: postUser } = usePostUserMutations();
  const { webApp, user } = useTelegram();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Check if we're running inside Telegram (real Telegram user has all these properties)
  const isInTelegram = Boolean(webApp?.initDataUnsafe?.user?.id);

  const handleTelegramRegistration = async () => {
    webApp?.requestContact(async (access: boolean, response?: RequestContactResponse) => {
      if (response?.status === "sent") {
        const phoneNumber = response.responseUnsafe.contact.phone_number;
        const telegramId = user?.id?.toString() ?? "1";
        const registeredUser = await postUser({
          params: {
            first_name: response.responseUnsafe.contact.first_name ?? "",
            last_name: response.responseUnsafe.contact.last_name ?? undefined,
            username: webApp?.initDataUnsafe.user?.username ?? undefined,
            phone: phoneNumber,
            parent_telegram_id: parentTelegramId ? Number(parentTelegramId) : undefined,
            is_child: role === "child"
          },
          config: {
            headers: {
              "X-Telegram-Id": telegramId
            }
          }
        });

        if (registeredUser.success && registeredUser.data) {
          const setCookieResponse = await fetch("/api/logIn", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Telegram-Id": telegramId
            },
            body: JSON.stringify({
              phoneNumber: phoneNumber,
              role: registeredUser.data.role
            })
          });

          if (setCookieResponse.ok) {
            // Clear cache on login to ensure fresh data for the new user
            queryClient.clear();
            // Notify TelegramProvider to update mock user
            window.dispatchEvent(new Event("auth-changed"));
            // Small delay to allow TelegramProvider to update before navigation
            await new Promise((resolve) => setTimeout(resolve, 1));
            router.push("/");
          }
        }
      }
    });
  };

  const handleLocalTestRegistration = async () => {
    const testData = getTestData(role);

    const user = await postUser({
      params: {
        first_name: testData.firstName,
        last_name: testData.lastName,
        username: testData.username,
        phone: testData.phone,
        is_child: role === "child",
        parent_telegram_id: parentTelegramId ? Number(parentTelegramId) : undefined
      },
      config: {
        headers: {
          "X-Telegram-Id": testData.telegramId.toString()
        }
      }
    });

    if (user.success && user.data) {
      const setCookieResponse = await fetch("/api/logIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Telegram-Id": testData.telegramId.toString()
        },
        body: JSON.stringify({
          phoneNumber: testData.phone,
          role: user.data.role
        })
      });

      if (setCookieResponse.ok) {
        // Clear cache on login to ensure fresh data for the new user
        queryClient.clear();
        // Notify TelegramProvider to update mock user
        window.dispatchEvent(new Event("auth-changed"));
        // Small delay to allow TelegramProvider to update before navigation
        await new Promise((resolve) => setTimeout(resolve, 1));
        router.push("/");
      }
    }
  };

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

    setIsError(undefined);

    if (isInTelegram) {
      await handleTelegramRegistration();
    } else {
      // Local testing fallback: Parent = ID 1, Child = ID 2
      console.log(`[DEV MODE] Registering as ${role} with Telegram ID: ${role === "parent" ? 1 : 2}`);
      await handleLocalTestRegistration();
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
