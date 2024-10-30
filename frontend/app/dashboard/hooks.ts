// hooks/use-dashboard.ts
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { ListItem, listApi } from "@/app/api/list";
import { DeleteDialogState } from "@/app/dashboard/types";

export function useDashboard() {
  const router = useRouter();
  const [lists, setLists] = useState<ListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deleteItemDialog, setDeleteItemDialog] = useState<DeleteDialogState>({
    isOpen: false,
    listId: "",
    itemIndex: -1,
  });
  const [isAddingItem, setIsAddingItem] = useState(false);

  const fetchLists = async () => {
    setError(null);
    const data = await listApi.getList();

    setLists(data);
  };

  const handleGroup = async (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    router.push(`/lists/${listId}/group`);
  };

  const handleAddItem = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingItem(true);
  };

  const handleEditList = async (
    e: React.SyntheticEvent,
    listId: string,
    newName: string,
    content: string,
  ) => {
    e.stopPropagation();
    await listApi.editList(listId, { name: newName, content: content });
    await fetchLists();
  };

  const handleAddItemConfirm = async (listId: string, newValue: string) => {
    await listApi.addItem(listId, newValue);
    setIsAddingItem(false);
    await fetchLists();
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

  const handleQuickCreate = async (name: string) => {
    await listApi.addList({ name });
    await fetchLists();
  };

  return {
    lists,
    error,
    deleteItemDialog,
    isAddingItem,
    handleAddItem,
    fetchLists,
    handleGroup,
    handleDeleteList,
    handleDeleteItem,
    handleDeleteItemConfirm,
    handleEditItem,
    handleDeleteDialogChange,
    handleAddItemConfirm,
    handleQuickCreate,
    handleEditList,
  };
}
