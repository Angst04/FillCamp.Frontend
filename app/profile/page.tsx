"use client";

import { useTelegram } from "@/context/TelegramProvider";
import { useState } from "react";
import { User, Phone, Award } from "lucide-react";
import Card from "@/components/ui/Card";
import InfoItem from "@/components/InfoItem";
import Button from "@/components/ui/Button";
import RoleToggle from "./(components)/RoleToggle";
import ProfileHeader from "./(components)/ProfileHeader";
import StatsCard from "./(components)/StatsCard";
import ChildInfoCard from "./(components)/ChildInfoCard";
import ParentInfoCard from "./(components)/ParentInfoCard";
import { motion, AnimatePresence } from "motion/react";
import { pageVariants, fadeInVariants } from "@/lib/animations";

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

export default function ProfilePage() {
    const { user, webApp } = useTelegram();

    // Mock profile data (in real app would be loaded from API)
    const [profile] = useState<UserProfile>({
        id: user?.id || 123456789,
        firstName: user?.first_name || "Имя",
        lastName: user?.last_name || "Фамилия",
        username: user?.username,
        phone: "+7 (999) 123-45-67",
        role: "child",
        bonusBalance: 1250,
        gameProgress: 75,
        linkedAccount: {
            id: 987654321,
            name: "Иванов Иван",
            role: "parent",
        },
        children: [
            {
                id: 111222333,
                name: "Петров Петр",
                bonusBalance: 850,
            },
        ],
    });

    const [selectedRole, setSelectedRole] = useState<UserRole>(profile.role);

    const handleLogout = () => {
        webApp?.showConfirm(
            "Вы уверены, что хотите выйти?",
            (confirmed: boolean) => {
                if (confirmed) {
                    // Logout logic
                    console.log("Logout");
                }
            }
        );
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-2xl mx-auto px-5 py-6 pb-24 min-h-screen"
        >
            {/* Role Toggle */}
            <RoleToggle
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
            />

            {/* Profile Header */}
            <motion.div
                className="mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <ProfileHeader
                    firstName={profile.firstName}
                    lastName={profile.lastName}
                    username={profile.username}
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
                <StatsCard
                    bonusBalance={profile.bonusBalance}
                    gameProgress={profile.gameProgress}
                />
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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
            >
                <Card className="mb-6">
                    <div className="space-y-4">
                        <InfoItem
                            icon={User}
                            label="Telegram ID"
                            value={profile.id}
                            iconColor="text-blue-600"
                            iconBgColor="bg-blue-100"
                        />

                        <InfoItem
                            icon={Phone}
                            label="Телефон"
                            value={profile.phone || "Не указан"}
                            iconColor="text-green-600"
                            iconBgColor="bg-green-100"
                        />

                        <InfoItem
                            icon={Award}
                            label="Роль"
                            value={
                                selectedRole === "child"
                                    ? "Ребенок"
                                    : "Родитель"
                            }
                            iconColor="text-purple-600"
                            iconBgColor="bg-purple-100"
                        />
                    </div>
                </Card>
            </motion.div>

            {/* Linked Account - Child View */}
            <AnimatePresence mode="wait">
                {selectedRole === "child" && (
                    <motion.div
                        key="child-view"
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <h2 className="text-xl font-bold mb-4">Родитель</h2>
                        <div className="mb-6">
                            <ChildInfoCard
                                linkedAccount={profile.linkedAccount}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Children List - Parent View */}
                {selectedRole === "parent" && profile.children && (
                    <motion.div
                        key="parent-view"
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        <h2 className="text-xl font-bold mb-4">Мои дети</h2>
                        <div className="mb-6">
                            <ParentInfoCard childrenList={profile.children} />
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
                <Button variant="primary">Редактировать профиль</Button>
                <Button onClick={handleLogout} variant="secondary">
                    Выйти
                </Button>
            </motion.div>
        </motion.div>
    );
}
