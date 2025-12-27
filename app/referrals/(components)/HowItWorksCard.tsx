import Card from "@/components/ui/Card";
import StepItem from "@/components/StepItem";

interface HowItWorksCardProps {
  bonusPerReferral: number;
}

export default function HowItWorksCard({ bonusPerReferral }: HowItWorksCardProps) {
  return (
    <Card className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Как это работает?</h2>
      <div className="space-y-6">
        <StepItem
          number={1}
          title="Поделись ссылкой"
          description="Отправь свою реферальную ссылку друзьям"
          color="text-[#0048F2]"
          bgColor="bg-[#B1C9FF]"
        />
        <StepItem
          number={2}
          title="Друг едет на смену"
          description="Твой друг покупает понравившуюся смену"
          color="text-[#0048F2]"
          bgColor="bg-[#DDB4FF]"
        />
        <StepItem
          number={3}
          title="Получаешь бонусы"
          description={`Вы оба получаете по ${bonusPerReferral} бонусов!`}
          color="text-[#0048F2]"
          bgColor="bg-[#BBFBBB]"
        />
      </div>
    </Card>
  );
}
