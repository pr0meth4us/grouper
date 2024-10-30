import React, { useState, useEffect } from "react";
import { Plus, Save, X, Trash2 } from "lucide-react";

import { Actions } from "./actions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ItemTableProps } from "@/app/dashboard/types";
import ConfirmDialog from "@/app/dashboard/components/items/alert-dialog";

export function ItemTable({
  items,
  listId,
  onEditItem,
  onDeleteItem,
  onAddItem,
  isAddingItem,
  isEditingList = false,
  onSubmitList,
}: ItemTableProps) {
  const [editableItems, setEditableItems] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editValue, setEditValue] = useState("");
  const [newItemValue, setNewItemValue] = useState("");

  useEffect(() => {
    setEditableItems([...items]);
  }, [items, isEditingList]);

  const handleEdit = (index: number) => {
    if (!isEditingList) {
      setEditingIndex(index);
      setEditValue(items[index]);
    }
  };

  const handleSave = (index: number) => {
    if (index === -1) {
      onAddItem(listId, newItemValue);
      setNewItemValue("");
    } else {
      onEditItem(listId, index, editValue);
    }
    setEditingIndex(-1);
    setEditValue("");
  };

  const handleCellChange = (index: number, value: string) => {
    const newItems = [...editableItems];

    newItems[index] = value;
    setEditableItems(newItems);
  };

  const handleAddRow = () => {
    setEditableItems(["", ...editableItems]);
  };

  const handleDeleteRow = (index: number) => {
    if (isEditingList) {
      const newItems = editableItems.filter((_, i) => i !== index);

      setEditableItems(newItems);
    } else {
      onDeleteItem(listId, index);
    }
  };

  const handleSubmit = () => {
    const filteredItems = editableItems.filter((item) => item.trim() !== "");

    if (JSON.stringify(filteredItems) !== JSON.stringify(items)) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmSubmit = (e: React.MouseEvent<Element, MouseEvent>) => {
    const content = editableItems
      .filter((item) => item.trim() !== "")
      .join("\n");

    onSubmitList(e, content);
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    setEditingIndex(-1);
    setEditValue("");
    setNewItemValue("");
    setEditableItems([...items]);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (isEditingList) {
        handleSubmit();
      } else {
        handleSave(index);
      }
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className="space-y-4"
      role="button"
      tabIndex={0}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
        }
      }}
    >
      {isEditingList && (
        <div className="flex justify-end gap-2 mb-4 sticky top-0 bg-background z-10 py-2 border-b">
          <Button size="sm" variant="outline" onClick={handleAddRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">No.</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isAddingItem && !isEditingList && (
            <TableRow>
              <TableCell className="font-medium">New</TableCell>
              <TableCell>
                <Input
                  className="max-w-md"
                  value={newItemValue}
                  onChange={(e) => setNewItemValue(e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, -1)}
                />
              </TableCell>
              <TableCell>
                <Actions
                  isBulkEdit={false}
                  isEditing={true}
                  onCancel={handleCancel}
                  onSave={() => handleSave(-1)}
                />
              </TableCell>
            </TableRow>
          )}
          {(isEditingList ? editableItems : items).map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                {isEditingList ? (
                  <Input
                    className="max-w-md"
                    value={item}
                    onChange={(e) => handleCellChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ) : editingIndex === index ? (
                  <Input
                    className="max-w-md"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ) : (
                  item
                )}
              </TableCell>
              <TableCell>
                {isEditingList ? (
                  <Button
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteRow(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Actions
                    isBulkEdit={isEditingList}
                    isEditing={editingIndex === index}
                    onCancel={handleCancel}
                    onDelete={() => handleDeleteRow(index)}
                    onEdit={() => handleEdit(index)}
                    onSave={() => handleSave(index)}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
          {(isEditingList ? editableItems : items).length === 0 && (
            <TableRow>
              <TableCell
                className="text-center text-muted-foreground"
                colSpan={3}
              >
                No items available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSubmit}
      />
    </div>
  );
}

export default ItemTable;
