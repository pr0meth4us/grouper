import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Actions } from "@/app/dashboard/components/items/actions";
import { ItemTableProps } from "@/app/dashboard/types";

export function ItemTable({ items, listId, onEditItem, onDeleteItem, onAddItem, isAddingItem }: ItemTableProps) {
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editValue, setEditValue] = useState("");
  const [newItemValue, setNewItemValue] = useState("");

  // @ts-ignore
  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditValue(items[index]);
  };

  // @ts-ignore
  const handleSave = (index) => {
    if (index === -1) {
      onAddItem(listId, newItemValue);
      setNewItemValue("");
    } else {
      onEditItem(listId, index, editValue);
    }
    setEditingIndex(-1);
    setEditValue("");
  };

  const handleCancel = () => {
    setEditingIndex(-1);
    setEditValue("");
    setNewItemValue("");
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
        {isAddingItem ? (
          <TableRow>
            <TableCell className="font-medium">New</TableCell>
            <TableCell>
              <Input
                autoFocus
                className="max-w-md"
                value={newItemValue}
                onChange={(e) => setNewItemValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave(-1);
                  if (e.key === "Escape") handleCancel();
                }}
              />
            </TableCell>
            <TableCell>
              <Actions
                isEditing={true}
                onCancel={handleCancel}
                onSave={() => handleSave(-1)}
              />
            </TableCell>
          </TableRow>
        ) : null}
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