import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Group, Trash2, Edit, Plus, MoreVertical } from "lucide-react";

import { ActionButtonsProps } from "@/app/dashboard/types";
import { Button } from "@/components/ui/button";

export function ActionButtons({
  onGroupClick,
  onDeleteClick,
  onEditClick,
  onAddClick,
  isEditingList,
}: ActionButtonsProps) {
  if (isEditingList) {
    return "";
  }

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Actions"
            className="h-8 p-2"
            size="sm"
            variant="ghost"
          >
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onEditClick}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDeleteClick}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
