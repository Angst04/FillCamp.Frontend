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

// Development mode: when webApp is null, use mock data
const isDevelopment = process.env.NODE_ENV === "development";

export const LoginPage = () => {
  const [role, setRole] = useState<UserRole>("child");
  const [isError, setIsError] = useState<string | undefined>(undefined);
  const [parentTelegramId, setParentTelegramId] = useState<string>("");
  const { mutateAsync: postUser } = usePostUserMutations();
  const { webApp, user: telegramContextUser } = useTelegram();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleTelegramRegistration = async () => {
    // In development mode without Telegram, use mock user from context
    const isDevMode = isDevelopment && !webApp;
    const telegramUser = isDevMode ? telegramContextUser : webApp?.initDataUnsafe?.user;

    if (!telegramUser?.id) {
      setIsError("Не удалось получить данные пользователя из Telegram");
      return;
    }

    const telegramId = telegramUser.id.toString();

    // In development mode, skip contact request and use mock phone
    if (isDevMode) {
      const registeredUser = await postUser({
        params: {
          first_name: telegramUser.first_name ?? "Тестовый",
          last_name: telegramUser.last_name ?? "Тестовый",
          username: telegramUser.username ?? "test_user",
          phone: "+70000000000", // Mock phone for development
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
        await queryClient.invalidateQueries({ queryKey: ["user", telegramId] });
        router.push("/");
      } else {
        setIsError(`Ошибка при регистрации пользователя ${registeredUser.error?.detail}`);
      }
      return;
    }

    // Production mode: request contact from Telegram
    if (!webApp) {
      setIsError("Telegram WebApp не инициализирован");
      return;
    }

    webApp.requestContact(async (access: boolean, response?: RequestContactResponse) => {
      if (!access || response?.status !== "sent") {
        setIsError("Необходимо предоставить доступ к контакту для регистрации");
        return;
      }

      const phoneNumber = response.responseUnsafe.contact.phone_number;
      if (!phoneNumber) {
        setIsError("Не удалось получить номер телефона");
        return;
      }

      const registeredUser = await postUser({
        params: {
          first_name: telegramUser.first_name ?? "Тестовый",
          last_name: telegramUser.last_name ?? "Тестовый",
          username: telegramUser.username ?? "test_user",
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
        await queryClient.invalidateQueries({ queryKey: ["user", telegramId] });
        router.push("/");
      } else {
        setIsError(`Ошибка при регистрации пользователя ${registeredUser.error?.detail}`);
      }
    });
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setParentTelegramId("");
    setIsError(undefined);
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

    await handleTelegramRegistration();
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
          onClick={() => handleRoleChange("child")}
          className="rounded-[18px]  text-lg font-bold leading-[1.1] text-white flex items-center justify-center gap-2"
        >
          <User size={12} />
          <span>Ребенок</span>
        </Button>
        <Button
          variant={role === "parent" ? "primary" : "secondary"}
          onClick={() => handleRoleChange("parent")}
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
            className="w-full rounded-[18px] mb-2 text-lg font-bold text-black px-4 py-2 border border-black focus:outline-none"
            value={parentTelegramId}
            onChange={(e) => setParentTelegramId(e.target.value)}
          />
          <h2 className="text-center text-base font-normal text-[#656565] mb-6 leading-[1.1]">
            Telegram id ваш родитель может посмотреть на странице профиля
          </h2>
        </motion.div>
      )}
      <Button
        variant="secondary"
        onClick={handleContinue}
        className="rounded-[18px] py-4 px-20 mb-2 text-lg font-bold leading-[1.1] text-white flex items-center justify-center gap-2"
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
