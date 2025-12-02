interface UpgradeCardProps {
    emoji: string;
    title: string;
    description: string;
    cost: number;
    backgroundColor: string;
    iconBackgroundColor: string;
    costColor: string;
    onClick?: () => void;
}

export default function UpgradeCard({
    emoji,
    title,
    description,
    cost,
    backgroundColor,
    iconBackgroundColor,
    costColor,
    onClick,
}: UpgradeCardProps) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between rounded-xl hover:shadow-md transition-shadow"
            style={{
                backgroundColor,
                height: "65px",
                padding: "0 16px",
            }}
        >
            <div className="flex items-center space-x-3">
                <div
                    className="rounded-md flex items-center justify-center text-2xl"
                    style={{
                        width: "42.39px",
                        height: "42.39px",
                        backgroundColor: iconBackgroundColor,
                    }}
                >
                    {emoji}
                </div>
                <div className="text-left">
                    <p
                        className="text-base font-semibold font-heading"
                        style={{ color: "#101010" }}
                    >
                        {title}
                    </p>
                    <p
                        className="text-sm font-heading"
                        style={{ color: "#656565" }}
                    >
                        {description}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <p
                    className="text-base font-semibold font-heading"
                    style={{ color: costColor }}
                >
                    {cost}
                </p>
                <p className="text-sm font-heading" style={{ color: "#656565" }}>
                    бонусов
                </p>
            </div>
        </button>
    );
}

