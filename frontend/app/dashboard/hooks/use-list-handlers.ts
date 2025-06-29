"use client";

import { useRouter } from "next/navigation";
import React from "react";

import type { DeleteDialogState } from "../types";

import { listApi } from "@/app/api/list";

interface UserList {
  listId: string;
  name: string;
  items: string[];
  createdAt: string;
}

export const useListHandlers = (
  setLists: (lists: UserList[]) => void,
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
    } catch (_error) {
      setError(`Failed to fetch lists: ${_error}`);
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
    } catch (_error) {
      setError(`Failed to edit list${_error}`);
    }
  };

  const handleAddItemConfirm = async (listId: string, newValue: string) => {
    try {
      await listApi.addItem(listId, newValue);
      setIsAddingItem(false);
      await fetchLists();
    } catch (_error) {
      setError(`Failed to add item: ${_error}`);
    }
  };

  const handleDeleteList = async (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    try {
      await listApi.deleteList(listId);
      await fetchLists();
    } catch (_error) {
      setError(`Failed to delete list${_error}`);
    }
  };

  const handleDeleteItem = (listId: string, itemIndex: number) => {
    setDeleteItemDialog({ isOpen: true, listId, itemIndex });
  };

  const handleDeleteItemConfirm = async () => {
    try {
      const { listId, itemIndex } = deleteItemDialog;

      if (!listId || itemIndex < 0) {
        setError("Invalid item selection");
        return;
      }

      await listApi.deleteItem(listId, itemIndex);
      setDeleteItemDialog({ isOpen: false, listId: "", itemIndex: -1 });
      await fetchLists();
    } catch (error) {
      setError(
        `Failed to delete item: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
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
      setError(
        `Failed to create list: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
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
