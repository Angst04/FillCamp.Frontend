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
import { pageVariants } from "@/lib/animations";
import { useRouter } from "next/navigation";
import { useGetProfileQuery } from "@/api/hooks/profile/useGetProfileQuery";
import { Suspense } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface ProfilePageProps {
  initialProfile?: GetProfileResponse;
}

export const ProfilePage = ({ initialProfile }: ProfilePageProps) => {
  const { user } = useTelegram();
  const { data: profile } = useGetProfileQuery();
  const queryClient = useQueryClient();

  // Use server-fetched data as fallback, client data takes priority
  const profileData = profile?.data ?? initialProfile;

  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logOut", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (response.ok) {
        // Clear all React Query cache on logout
        queryClient.clear();
        // Notify TelegramProvider to update mock user
        window.dispatchEvent(new Event("auth-changed"));
        // Small delay to allow TelegramProvider to update before navigation
        await new Promise((resolve) => setTimeout(resolve, 1));
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
          <StatsCard bonusBalance={profileData?.bonus_balance ?? 0} />
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
                value={profileData?.telegram_id ?? "Не указан"}
                iconColor="text-blue-600"
                iconBgColor="bg-blue-100"
              />

              <InfoItem
                icon={Phone}
                label="Телефон"
                value={profileData?.phone ?? "Не указан"}
                iconColor="text-green-600"
                iconBgColor="bg-green-100"
              />

              <InfoItem
                icon={Award}
                label="Роль"
                value={profileData?.role === "child" ? "Ребёнок" : "Родитель"}
                iconColor="text-purple-600"
                iconBgColor="bg-purple-100"
              />
            </div>
          </Card>
        </Suspense>
      </motion.div>

      {/* Parent/Child Relationships */}
      <AnimatePresence mode="wait">
        {profileData?.role === "child" && profileData?.linked_parent_info && (
          <motion.div
            key="child-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.45 }}
          >
            <h2 className="text-xl font-bold mb-4">Родитель</h2>
            <div className="mb-6">
              <Suspense fallback={<div>Loading...</div>}>
                <ChildInfoCard parentInfo={profileData.linked_parent_info} />
              </Suspense>
            </div>
          </motion.div>
        )}

        {profileData?.role === "parent" && (
          <motion.div
            key="parent-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.45 }}
          >
            <h2 className="text-xl font-bold mb-4">Мои дети</h2>
            <div className="mb-6">
              <Suspense fallback={<div>Loading...</div>}>
                <ParentInfoCard childrenList={profileData?.linked_children_info ?? []} />
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button onClick={handleLogout} variant="secondary">
          Выйти
        </Button>
      </motion.div>
    </motion.div>
  );
};
