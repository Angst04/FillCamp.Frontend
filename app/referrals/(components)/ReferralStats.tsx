import { Users, Award } from "lucide-react";
import StatCard from "@/components/StatCard";

interface ReferralStatsProps {
    referralsCount: number;
    totalEarned: number;
}

export default function ReferralStats({
    referralsCount,
    totalEarned,
}: ReferralStatsProps) {
    return (
        <div className="grid grid-cols-2 gap-4 mb-6">
            <StatCard
                icon={Users}
                label="Друзей"
                value={referralsCount}
                iconColor="text-[#ED0000]"
            />
            <StatCard
                icon={Award}
                label="Заработано"
                value={totalEarned}
                iconColor="text-[#ED0000]"
            />
        </div>
    );
}

