// hooks/use-dashboard.ts
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { ListItem, listApi } from "@/app/api/list";
import { DeleteDialogState } from "@/app/dashboard/types";

export function useDashboard() {
  const router = useRouter();
  const [lists, setLists] = useState<ListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteItemDialog, setDeleteItemDialog] = useState<DeleteDialogState>({
    isOpen: false,
    listId: "",
    itemIndex: -1,
  });

  const fetchLists = async () => {
    setIsLoading(true);
    setError(null);
    const data = await listApi.getList();

    setLists(data);
    setIsLoading(false);
  };

  const handleGroup = async (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    router.push(`/lists/${listId}/group`);
  };

  const handleDeleteList = async (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    await listApi.deleteList(listId);
    await fetchLists();
  };

  const handleDeleteItem = (listId: string, itemIndex: number) => {
    setDeleteItemDialog({ isOpen: true, listId, itemIndex });
  };

  const handleDeleteItemConfirm = async () => {
    const { listId, itemIndex } = deleteItemDialog;

    await listApi.deleteItem(listId, itemIndex);
    await fetchLists();
  };

  const handleEditItem = async (
    listId: string,
    itemIndex: number,
    editValue: string,
  ) => {
    await listApi.editItem(listId, itemIndex, editValue);
    await fetchLists();
  };

  const handleDeleteDialogChange = (isOpen: boolean) => {
    setDeleteItemDialog({ isOpen, listId: "", itemIndex: -1 });
  };

  return {
    lists,
    error,
    isLoading,
    deleteItemDialog,
    fetchLists,
    handleGroup,
    handleDeleteList,
    handleDeleteItem,
    handleDeleteItemConfirm,
    handleEditItem,
    handleDeleteDialogChange,
  };
}
