import React, { useState } from "react";

import { ListActionsProps } from "@/app/dashboard/types";
import { ActionButtons } from "@/app/dashboard/components/list/actions-buttons";
import { DeleteListDialog } from "@/app/dashboard/components/list/delete-dialog";

export function Actions({
  listId,
  listName,
  onDelete,
  onGroup,
}: ListActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(e, listId);
    setShowDeleteDialog(false);
  };

  const handleGroupClick = (e: React.MouseEvent) => {
    onGroup(e, listId);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <ActionButtons
        onDeleteClick={handleDeleteClick}
        onGroupClick={handleGroupClick}
      />

      <DeleteListDialog
        isOpen={showDeleteDialog}
        listName={listName}
        onConfirm={handleDeleteConfirm}
        onOpenChange={handleDialogOpenChange}
      />
    </>
  );
}
