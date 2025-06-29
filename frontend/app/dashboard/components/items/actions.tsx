import { Edit, Trash2, Check, X } from "lucide-react";
import React from "react";

import { ActionsProps } from "@/app/dashboard/types";
import { Button } from "@/components/ui/button";

export const Actions: React.FC<ActionsProps> = ({
  isEditing,
  isBulkEdit = false,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}) => {
  const deleteButton = (
    <Button
      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
      size="sm"
      variant="ghost"
      onClick={onDelete}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );

  if (isEditing) {
    return (
      <div className="flex gap-1">
        <Button
          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
          size="sm"
          variant="ghost"
          onClick={onSave}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
          size="sm"
          variant="ghost"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  if (isBulkEdit) {
    return <div className="flex gap-1">{deleteButton}</div>;
  }

  return (
    <div className="flex gap-1">
      <Button
        className="h-8 w-8 p-0"
        size="sm"
        variant="ghost"
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
      </Button>
      {deleteButton}
    </div>
  );
};
