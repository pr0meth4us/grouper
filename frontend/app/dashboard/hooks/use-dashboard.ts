"use client";

import { useListState } from "./use-list-states";
import { useListHandlers } from "./use-list-handlers";

export const useDashboard = () => {
  const {
    lists,
    setLists,
    error,
    setError,
    deleteItemDialog,
    setDeleteItemDialog,
    isAddingItem,
    setIsAddingItem,
  } = useListState();

  const handlers = useListHandlers(
    setLists,
    setError,
    deleteItemDialog,
    setDeleteItemDialog,
    setIsAddingItem,
  );

  return {
    lists,
    error,
    deleteItemDialog,
    isAddingItem,
    ...handlers,
  };
};
