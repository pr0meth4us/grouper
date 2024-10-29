import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Actions } from "@/app/dashboard/components/items/actions";
import { ItemTableProps } from "@/app/dashboard/types";
export function ItemTable({
  items,
  listId,
  onEditItem,
  onDeleteItem,
}: ItemTableProps) {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editValue, setEditValue] = useState("");

  // @ts-ignore
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  // @ts-ignore
  const handleSave = (index) => {
    onEditItem(listId, index, editValue);
    setEditingIndex(-1);
    setEditValue("");
  };

  const handleCancel = () => {
    setEditingIndex(-1);
    setEditValue("");
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">No.</TableHead>
          <TableHead>Item</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length > 0 ? (
          items.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                {editingIndex === index ? (
                  <Input
                    autoFocus
                    className="max-w-md"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave(index);
                      if (e.key === "Escape") handleCancel();
                    }}
                  />
                ) : (
                  item
                )}
              </TableCell>
              <TableCell>
                <Actions
                  isEditing={editingIndex === index}
                  onCancel={handleCancel}
                  onDelete={() => onDeleteItem(listId, index)}
                  onEdit={() => handleEdit(index)}
                  onSave={() => handleSave(index)}
                />
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell className="text-center text-gray-500" colSpan={3}>
              No items available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default ItemTable;
