import { Group, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ActionButtonsProps } from "@/app/dashboard/types";

export function ActionButtons({
  onGroupClick,
  onDeleteClick,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        className="h-8"
        size="sm"
        variant="outline"
        onClick={onGroupClick}
      >
        <Group className="h-4 w-4 mr-2" />
        Group
      </Button>
      <Button
        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
        size="sm"
        variant="ghost"
        onClick={onDeleteClick}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
}
