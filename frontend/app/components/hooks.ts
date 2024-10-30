import { ListItem, ListItemsArray } from "@/app/types/list";

export const isListItem = (
  list: ListItem | ListItemsArray,
): list is ListItem => {
  return (list as ListItem).items !== undefined;
};
