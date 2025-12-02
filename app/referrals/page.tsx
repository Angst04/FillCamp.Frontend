"use client";

import { useTelegram } from "@/context/TelegramProvider";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import BonusCard from "@/app/referrals/(components)/BonusCard";
import ReferralStats from "@/app/referrals/(components)/ReferralStats";
import ReferralLinkCard from "@/app/referrals/(components)/ReferralLinkCard";
import HowItWorksCard from "@/app/referrals/(components)/HowItWorksCard";
import FriendsList from "@/app/referrals/(components)/FriendsList";
import { motion } from "motion/react";
import { pageVariants } from "@/lib/animations";

interface Referral {
    id: number;
    name: string;
    username?: string;
    joinedDate: string;
    bonusEarned: number;
}

export default function ReferralsPage() {
    const { user, webApp } = useTelegram();
    const [copied, setCopied] = useState(false);

    // Генерация реферальной ссылки
    const referralLink = `https://t.me/your_bot?start=ref${
        user?.id || "123456"
    }`;

    // Моковые данные рефералов
    const [referrals] = useState<Referral[]>([
        {
            id: 1,
            name: "Иван Петров",
            username: "ivanpetrov",
            joinedDate: "2025-11-05",
            bonusEarned: 100,
        },
        {
            id: 2,
            name: "Мария Сидорова",
            username: "maria_s",
            joinedDate: "2025-11-03",
            bonusEarned: 100,
        },
        {
            id: 3,
            name: "Алексей Смирнов",
            joinedDate: "2025-11-01",
            bonusEarned: 100,
        },
    ]);

    const totalEarned = referrals.reduce(
        (sum, ref) => sum + ref.bonusEarned,
        0
    );
    const bonusPerReferral = 100;

    const handleCopyLink = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(referralLink);
            setCopied(true);
            webApp?.HapticFeedback.notificationOccurred("success");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = () => {
        const shareText = `Присоединяйся к нашему лагерю! Используй мою реферальную ссылку и получи бонусы: ${referralLink}`;

        if (webApp) {
            // Используем Telegram Share
            webApp.openTelegramLink(
                `https://t.me/share/url?url=${encodeURIComponent(
                    referralLink
                )}&text=${encodeURIComponent(shareText)}`
            );
        } else if (navigator.share) {
            navigator.share({
                title: "Приглашение в лагерь",
                text: shareText,
                url: referralLink,
            });
        }
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="max-w-2xl mx-auto px-4 py-6 pb-20  min-h-screen"
        >
            <PageHeader title="Пригласи друзей" emoji="🎁" centered />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <BonusCard bonusPerReferral={bonusPerReferral} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <ReferralStats
                    referralsCount={referrals.length}
                    totalEarned={totalEarned}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <ReferralLinkCard
                    referralLink={referralLink}
                    copied={copied}
                    onCopy={handleCopyLink}
                    onShare={handleShare}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <HowItWorksCard bonusPerReferral={bonusPerReferral} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <FriendsList referrals={referrals} />
            </motion.div>
        </motion.div>
    );
}
