import { Actions } from "./actions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ListTableProps } from "@/app/dashboard/types";

export function ItemTable({
  items,
  listId,
  onEditItem,
  onDeleteItem,
}: ListTableProps) {
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
              <TableCell>{item}</TableCell>
              <TableCell>
                <Actions
                  itemIndex={index}
                  listId={listId}
                  onDelete={onDeleteItem}
                  onEdit={onEditItem}
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
