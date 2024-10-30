"use client";

import type { DeleteDialogState } from "../types";

import { useRouter } from "next/navigation";
import React from "react";

import { listApi } from "@/app/api/list";

export const useListHandlers = (
  setLists: (lists: any[]) => void,
  setError: (error: string | null) => void,
  deleteItemDialog: DeleteDialogState,
  setDeleteItemDialog: (state: DeleteDialogState) => void,
  setIsAddingItem: (isAdding: boolean) => void,
) => {
  const router = useRouter();

  const fetchLists = async () => {
    setError(null);
    try {
      const data = await listApi.getList();

      setLists(data);
    } catch (error) {
      setError("Failed to fetch lists");
    }
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
    try {
      await listApi.editList(listId, { name: newName, content });
      await fetchLists();
    } catch (error) {
      setError("Failed to edit list");
    }
  };

  const handleAddItemConfirm = async (listId: string, newValue: string) => {
    try {
      await listApi.addItem(listId, newValue);
      setIsAddingItem(false);
      await fetchLists();
    } catch (error) {
      setError("Failed to add item");
    }
  };

  const handleDeleteList = async (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    try {
      await listApi.deleteList(listId);
      await fetchLists();
    } catch (error) {
      setError("Failed to delete list");
    }
  };

  const handleDeleteItem = (listId: string, itemIndex: number) => {
    setDeleteItemDialog({ isOpen: true, listId, itemIndex });
  };

  const handleDeleteItemConfirm = async () => {
    try {
      const { listId, itemIndex } = deleteItemDialog;

      await listApi.deleteItem(listId, itemIndex);
      setDeleteItemDialog({ isOpen: false, listId: "", itemIndex: -1 });
      await fetchLists();
    } catch (error) {
      setError("Failed to delete item");
      setDeleteItemDialog({ isOpen: false, listId: "", itemIndex: -1 });
    }
  };

  const handleDeleteDialogChange = (isOpen: boolean) => {
    setDeleteItemDialog({ isOpen, listId: "", itemIndex: -1 });
  };

  const handleQuickCreate = async (name: string) => {
    try {
      await listApi.addList({ name });
      await fetchLists();
    } catch (error) {
      setError("Failed to create list");
    }
  };

  const handleEditItem = async (
    listId: string,
    itemIndex: number,
    editValue: string,
  ) => {
    await listApi.editItem(listId, itemIndex, editValue);
    await fetchLists();
  };

  return {
    fetchLists,
    handleGroup,
    handleAddItem,
    handleEditList,
    handleAddItemConfirm,
    handleDeleteList,
    handleDeleteItem,
    handleDeleteItemConfirm,
    handleEditItem,
    handleDeleteDialogChange,
    handleQuickCreate,
  };
};
