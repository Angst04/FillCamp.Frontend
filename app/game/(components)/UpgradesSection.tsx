import UpgradeCard from "./UpgradeCard";

interface UpgradesSectionProps {
    onMultitapClick?: () => void;
    onEnergyClick?: () => void;
}

export default function UpgradesSection({
    onMultitapClick,
    onEnergyClick,
}: UpgradesSectionProps) {
    return (
        <div className="mt-6">
            <h2
                className="text-lg font-semibold font-heading mb-4"
                style={{ color: "#101010" }}
            >
                Улучшения
            </h2>
            <div className="space-y-3">
                <UpgradeCard
                    emoji="⚡"
                    title="Мультитап"
                    description="+1 за клик"
                    cost={500}
                    backgroundColor="#ECD4FF"
                    iconBackgroundColor="#AC46FF"
                    costColor="#AC46FF"
                    onClick={onMultitapClick}
                />
                <UpgradeCard
                    emoji="🔋"
                    title="Больше энергии"
                    description="+100 к лимиту"
                    cost={300}
                    backgroundColor="#CCDBFF"
                    iconBackgroundColor="#0048F2"
                    costColor="#0048F2"
                    onClick={onEnergyClick}
                />
            </div>
        </div>
    );
}
