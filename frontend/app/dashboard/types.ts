import React from "react";

export interface ListActionsProps {
  listId: string;
  listName: string;
  onDelete: (e: React.MouseEvent, listId: string) => void;
  onGroup: (e: React.MouseEvent, listId: string) => void;
}

export interface DeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
}

export interface ErrorStateProps {
  error: string;
}

export interface ActionButtonsProps {
  onGroupClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
}

export interface DeleteListDialogProps {
  isOpen: boolean;
  listName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (e: React.MouseEvent) => void;
}

export interface ListItemActionsProps {
  listId: string;
  itemIndex: number;
  onEdit: (listId: string, itemIndex: number) => void;
  onDelete: (listId: string, itemIndex: number) => void;
}

export interface ListTableProps {
  items: string[];
  listId: string;
  onEditItem: (listId: string, itemIndex: number) => void;
  onDeleteItem: (listId: string, itemIndex: number) => void;
}

export interface DeleteDialogState {
  isOpen: boolean;
  listId: string;
  itemIndex: number;
}
