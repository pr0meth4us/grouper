"use client";

import React, { useState } from "react";

export const useListEditing = (handleEditList: any) => {
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingContent, setEditingContent] = useState("");

  const startEditing = (
    listId: string,
    currentName: string,
    currentItems: string[],
  ) => {
    setEditingListId(listId);
    setEditingName(currentName);
    setEditingContent(currentItems.join("\n"));
  };

  const stopEditing = (e: React.SyntheticEvent) => {
    if (editingListId && editingName.trim()) {
      handleEditList(e, editingListId, editingName, editingContent);
    }
    setEditingListId(null);
    setEditingName("");
    setEditingContent("");
  };

  const handleChangeListName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingName(e.target.value);
  };

  return {
    editingListId,
    editingName,
    editingContent,
    startEditing,
    stopEditing,
    handleChangeListName,
  };
};
