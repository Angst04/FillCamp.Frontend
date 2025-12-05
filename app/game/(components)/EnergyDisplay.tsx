interface EnergyDisplayProps {
  energy: number;
  maxEnergy: number;
}

export default function EnergyDisplay({ energy, maxEnergy }: EnergyDisplayProps) {
  const energyPercentage = (energy / maxEnergy) * 100;

  return (
    <div
      className="bg-white rounded-[23px] p-5 mb-6"
      style={{
        boxShadow: "3px 4px 8.9px rgba(0, 0, 0, 0.15)"
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg font-semibold font-heading" style={{ color: "#101010" }}>
          Энергия
        </span>
        <span className="text-lg font-semibold font-heading" style={{ color: "#101010" }}>
          {energy} / {maxEnergy}
        </span>
      </div>

      <div className="mb-2">
        <div
          className="w-full rounded-full overflow-hidden"
          style={{
            height: "20.54px",
            backgroundColor: "#F0F0F0"
          }}
        >
          <div
            className="h-full transition-all duration-300 rounded-full"
            style={{
              width: `${energyPercentage}%`,
              backgroundColor: "#E5AC00"
            }}
          />
        </div>
      </div>

      <p className="text-sm font-heading text-center" style={{ color: "#656565" }}>
        Энергия восстанавливается автоматически
      </p>
    </div>
  );
}
