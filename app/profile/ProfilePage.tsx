"use client";

import { useTelegram } from "@/context/TelegramProvider";
import { User, Phone, Award } from "lucide-react";
import Card from "@/components/ui/Card";
import InfoItem from "@/components/InfoItem";
import { Button } from "@/components/ui/Button";
import ProfileHeader from "./(components)/ProfileHeader";
import StatsCard from "./(components)/StatsCard";
import ChildInfoCard from "./(components)/ChildInfoCard";
import ParentInfoCard from "./(components)/ParentInfoCard";
import { motion, AnimatePresence } from "motion/react";
import { pageVariants, fadeInVariants } from "@/lib/animations";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/api/hooks/profile/useGetProfileQuery";
import { Suspense } from "react";

type UserRole = "child" | "parent";

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  username?: string;
  phone?: string;
  role: UserRole;
  bonusBalance: number;
  gameProgress: number;
  linkedAccount?: {
    id: number;
    name: string;
    role: UserRole;
  };
  children?: {
    id: number;
    name: string;
    bonusBalance: number;
  }[];
}

export const ProfilePage = () => {
  const { user } = useTelegram();
  const { data: profile } = useGetProfileQuery();

  const router = useRouter();
  // Mock profile data (in real app would be loaded from API)

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logOut", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-2xl mx-auto px-5 py-6 pb-24 min-h-screen"
    >
      {/* Profile Header */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ProfileHeader
          firstName={user?.first_name ?? ""}
          lastName={user?.last_name ?? ""}
          username={user?.username ?? ""}
          photoUrl={user?.photo_url}
        />
      </motion.div>

      {/* Stats Card */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <StatsCard bonusBalance={profile?.data?.bonus_balance ?? 0} />
        </Suspense>
      </motion.div>

      {/* Information Section */}
      <motion.h2
        className="text-xl font-bold mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        Информация
      </motion.h2>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Card className="mb-6">
            <div className="space-y-4">
              <InfoItem
                icon={User}
                label="Telegram ID"
                value={profile?.data?.telegram_id ?? 0}
                iconColor="text-blue-600"
                iconBgColor="bg-blue-100"
              />

              <InfoItem
                icon={Phone}
                label="Телефон"
                value={profile?.data?.phone_number ?? "Не указан"}
                iconColor="text-green-600"
                iconBgColor="bg-green-100"
              />

              <InfoItem
                icon={Award}
                label="Роль"
                value={profile?.data?.role ?? "Не указан"}
                iconColor="text-purple-600"
                iconBgColor="bg-purple-100"
              />
            </div>
          </Card>
        </Suspense>
      </motion.div>
      {/* 
      
      <AnimatePresence mode="wait">
        {profile?.data?.role === "child" && (
          <motion.div key="child-view" variants={fadeInVariants} initial="initial" animate="animate" exit="exit">
            <h2 className="text-xl font-bold mb-4">Родитель</h2>
            <div className="mb-6">
              <ChildInfoCard linkedAccount={profile?.data?.linked_child_tg_id ?? []} />
            </div>
          </motion.div>
        )}

        
        {selectedRole === "parent" && profile.children && (
          <motion.div key="parent-view" variants={fadeInVariants} initial="initial" animate="animate" exit="exit">
            <h2 className="text-xl font-bold mb-4">Мои дети</h2>
            <div className="mb-6">
              <ParentInfoCard childrenList={profile.children} />
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Action Buttons */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button variant="primary">Редактировать профиль</Button>
        <Button onClick={handleLogout} variant="secondary">
          Выйти
        </Button>
      </motion.div>
    </motion.div>
  );
};
