import { Check, User, X } from "lucide-react";
import Card from "@/components/ui/Card";
import { GetParentChildResponse } from "@/api/requests/parent-child";
import { Button } from "@/components/ui/Button";
import { usePostParentChildMutation } from "@/api/hooks/parent-child/usePostParentChildMutation";

interface PendingChildsProps {
  parentChildRequests: GetParentChildResponse[];
}

export default function PendingChilds({ parentChildRequests }: PendingChildsProps) {
  if (!parentChildRequests || parentChildRequests.length === 0) {
    return (
      <Card>
        <p className="text-sm text-gray-500 text-center">Нет запросов</p>
      </Card>
    );
  }

  const { mutate: approveParentChildMutation } = usePostParentChildMutation();

  const handleApprove = (id: number) => {
    approveParentChildMutation({
      params: {
        request_id: id,
        action: "approve"
      }
    });
  };

  const handleReject = (id: number) => {
    approveParentChildMutation({
      params: {
        request_id: id,
        action: "reject"
      }
    });
  };

  return (
    <Card>
      <div className="space-y-4">
        {parentChildRequests.map((child, index) => (
          <div key={child.id}>
            {index > 0 && <div className="border-t border-gray-100 my-4" />}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {[child.child.first_name, child.child.last_name].filter(Boolean).join(" ") || "Ребенок"}
                  </p>
                  <p className="text-xs text-gray-500">Telegram ID: {child.child?.telegram_id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center ">
                <Button variant="icon" onClick={() => handleApprove(child.id)}>
                  <Check size={20} className="text-green-500" strokeWidth={2} />
                </Button>
                <Button variant="icon" onClick={() => handleReject(child.id)}>
                  <X size={20} className="text-red-500" strokeWidth={2} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
