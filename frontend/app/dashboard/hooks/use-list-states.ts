"use client";

import { useState } from "react";

import { DeleteDialogState } from "../types";

import { ListItem } from "@/app/types/list";

export const useListState = () => {
  const [lists, setLists] = useState<ListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deleteItemDialog, setDeleteItemDialog] = useState<DeleteDialogState>({
    isOpen: false,
    listId: "",
    itemIndex: -1,
  });
  const [isAddingItem, setIsAddingItem] = useState(false);

  return {
    lists,
    setLists,
    error,
    setError,
    deleteItemDialog,
    setDeleteItemDialog,
    isAddingItem,
    setIsAddingItem,
  };
};
