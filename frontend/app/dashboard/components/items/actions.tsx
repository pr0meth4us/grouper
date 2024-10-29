import { Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ListItemActionsProps } from "@/app/dashboard/types";

export function Actions({
  listId,
  itemIndex,
  onEdit,
  onDelete,
}: ListItemActionsProps) {
  return (
    <div className="flex gap-1">
      <Button
        className="h-8 w-8 p-0"
        size="sm"
        variant="ghost"
        onClick={() => onEdit(listId, itemIndex)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
        size="sm"
        variant="ghost"
        onClick={() => onDelete(listId, itemIndex)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
