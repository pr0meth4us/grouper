// hooks/use-dashboard.ts
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { ListItem, listApi } from "@/app/api/list";
import { toast } from "@/hooks/use-toast";
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
    try {
      const data = await listApi.getList();

      setLists(data);
    } catch (err) {
      setError("Failed to fetch lists");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch lists. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGroup = async (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    router.push(`/lists/${listId}/group`);
  };

  const handleDeleteList = async (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    try {
      await listApi.deleteList(listId);
      await fetchLists();
      toast({
        title: "Success",
        description: "List deleted successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete list. Please try again.",
      });
    }
  };

  const handleDeleteItem = (listId: string, itemIndex: number) => {
    setDeleteItemDialog({ isOpen: true, listId, itemIndex });
  };

  const handleDeleteItemConfirm = async () => {
    try {
      const { listId, itemIndex } = deleteItemDialog;

      await listApi.deleteItem(listId, itemIndex);
      await fetchLists();
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete item. Please try again.",
      });
    } finally {
      setDeleteItemDialog({ isOpen: false, listId: "", itemIndex: -1 });
    }
  };

  const handleEditItem = (listId: string, itemIndex: number) => {
    router.push(`/lists/${listId}/items/${itemIndex}/edit`);
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
