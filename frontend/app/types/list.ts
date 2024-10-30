import React from "react";

export interface ListItem {
  listId: string;
  name: string;
  items: string[];
  createdAt: string;
}

export type Group = string[][];

export interface ListUploaderProps {
  name?: string;
  setName?: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent) => void;
  isAuthUser: boolean;
}

export interface ListItem {
  listId: string;
  name: string;
  items: string[];
  createdAt: string;
}

export type ListItemsArray = string[];

export interface CurrentListProps {
  list: ListItem | ListItemsArray;
  excludedMembers: string[];
  setExcludedMembers: React.Dispatch<React.SetStateAction<string[]>>;
}

export interface GroupGeneratorProps {
  generateGroups: (groupSize: string, numberOfGroups: string) => Promise<void>;
  list: ListItem | ListItemsArray;
}

export interface GroupDisplayerProps {
  groups: Group[];
  onRegenerate: () => void;
}
