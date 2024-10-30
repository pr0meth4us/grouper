"use client";

import { ListItem } from "@/app/types/list";

export const useListFiltering = () => {
  const filterLists = (lists: ListItem[], searchQuery: string) => {
    return lists.filter(
      (list) =>
        list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        list.items.some((item) =>
          item.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
  };

  return {
    filterLists,
  };
};
