import React from "react";

export interface ListActionsProps {
  listId: string;
  listName: string;
  onDelete: (e: React.MouseEvent, listId: string) => void;
  onGroup: (e: React.MouseEvent, listId: string) => void;
  onEdit: (e: React.MouseEvent, listId: string) => void;
  onAdd: (e: React.MouseEvent, listId: string) => void;
  isEditingList: boolean;
}

export interface ErrorStateProps {
  error: string;
}

export interface ActionButtonsProps {
  onGroupClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onEditClick: (e: React.MouseEvent) => void;
  onAddClick: (e: React.MouseEvent) => void;
  isEditingList: boolean;
}

export interface ActionsProps {
  isEditing: boolean;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  isBulkEdit: boolean;
}

export interface ItemTableProps {
  items: string[];
  listId: string;
  onEditItem: (listId: string, index: number, newValue: string) => void;
  onDeleteItem: (listId: string, index: number) => void;
  isAddingItem: boolean;
  onAddItem: (listId: string, newValue: string) => void;
  isEditingList?: boolean;
  onSubmitList: (e: React.MouseEvent, content: string) => void;
}

export interface DeleteDialogState {
  isOpen: boolean;
  listId: string;
  itemIndex: number;
}

export interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateList: (name: string) => Promise<void>;
}

export interface DeleteDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

export interface DeleteListDialogProps {
  isOpen: boolean;
  listName: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (e: React.MouseEvent) => void;
}

export interface HeaderProps {
  setIsQuickAddOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}
