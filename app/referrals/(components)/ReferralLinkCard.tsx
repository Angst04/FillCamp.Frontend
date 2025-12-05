import { Copy, Share2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ReferralLinkCardProps {
  referralLink: string;
  copied: boolean;
  onCopy: () => void;
  onShare: () => void;
}

export default function ReferralLinkCard({ referralLink, copied, onCopy, onShare }: ReferralLinkCardProps) {
  return (
    <Card className="mb-6 relative">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Твоя реферальная ссылка</h2>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          value={referralLink}
          readOnly
          className="w-full bg-[#D9D9D9] border border-gray-900/10 rounded-lg px-4 py-3 text-sm text-gray-900 pr-12"
        />
        <button
          onClick={onCopy}
          className=" bg-[#0048F2] text-white p-3 rounded-lg hover:bg-[#0048F2]/90 transition-colors z-10"
          aria-label="Копировать ссылку"
        >
          <Copy size={18} />
        </button>
      </div>
      <Button onClick={onShare} variant="gradient" className="flex items-center justify-center space-x-2 rounded-2xl">
        <Share2 size={21} />
        <span>Поделиться ссылкой</span>
      </Button>
      {copied && <p className="text-green-600 text-xs mt-2 text-center">Ссылка скопирована!</p>}
    </Card>
  );
}
