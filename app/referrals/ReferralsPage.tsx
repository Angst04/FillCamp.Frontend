"use client";

import { useTelegram } from "@/context/TelegramProvider";
import PageHeader from "@/components/PageHeader";
import BonusCard from "@/app/referrals/(components)/BonusCard";
import ReferralStats from "@/app/referrals/(components)/ReferralStats";
import ReferralLinkCard from "@/app/referrals/(components)/ReferralLinkCard";
import HowItWorksCard from "@/app/referrals/(components)/HowItWorksCard";
import FriendsList from "@/app/referrals/(components)/FriendsList";
import { motion } from "motion/react";
import { pageVariants } from "@/lib/animations";
import { useGetReferralsQuery } from "@/api/hooks/referrals/useGetReferralsQuery";

export const ReferralsPage = () => {
  const { webApp } = useTelegram();
  const { data: referrals } = useGetReferralsQuery();

  const handleShare = () => {
    const shareText = `Присоединяйся к нашему лагерю! Используй мою реферальную ссылку и получи бонусы!}`;

    if (webApp) {
      // Используем Telegram Share
      webApp.openTelegramLink(
        `https://t.me/share/url?url=${encodeURIComponent(referrals?.data?.referral_link ?? "")}&text=${encodeURIComponent(shareText)}`
      );
    } else if (navigator.share) {
      navigator.share({
        title: "Приглашение в лагерь",
        text: shareText,
        url: referrals?.data?.referral_link ?? ""
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referrals?.data?.referral_link ?? "");
    webApp?.HapticFeedback.notificationOccurred("success");
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

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <BonusCard bonusPerReferral={2000} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <ReferralStats
          referralsCount={referrals?.data?.invited_count ?? 0}
          totalEarned={referrals?.data?.bonus_earned ?? 0}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <ReferralLinkCard
          referralLink={referrals?.data?.referral_link ?? ""}
          copied={false}
          onCopy={handleCopyLink}
          onShare={handleShare}
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <HowItWorksCard bonusPerReferral={2000} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <FriendsList referrals={referrals?.data?.invited_users ?? []} />
      </motion.div>
    </motion.div>
  );
};
