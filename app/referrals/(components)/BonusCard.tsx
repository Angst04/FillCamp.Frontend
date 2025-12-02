import { Gift } from "lucide-react";

interface BonusCardProps {
    bonusPerReferral: number;
}

export default function BonusCard({ bonusPerReferral }: BonusCardProps) {
    return (
        <div
            className="rounded-[31px] p-6 mb-6 relative overflow-hidden"
            style={{
                background:
                    "linear-gradient(26deg, #ED0000 12%, #F0F0E9 100%)",
            }}
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-white text-lg mb-1">Бонус за друга</p>
                    <p className="text-white text-[36px] font-bold leading-tight">
                        {bonusPerReferral}
                    </p>
                </div>
                <div className="w-[78px] h-[78px] bg-white rounded-full flex items-center justify-center">
                    <Gift size={38} className="text-[#ED0000]" />
                </div>
            </div>
            <p className="text-white">
                Ты и твой друг получите по {bonusPerReferral} бонусов!
            </p>
        </div>
    );
}

