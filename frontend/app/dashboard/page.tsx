// app/dashboard/page.tsx
"use client";

import React, { useEffect } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboard } from "@/app/dashboard/hooks";
import { Error } from "@/app/dashboard/components/states/error";
import { Header } from "@/app/dashboard/components/list/header";
import { Actions } from "@/app/dashboard/components/list/actions";
import { DeleteDialog } from "@/app/dashboard/components/items/delete-dialog";
import { ItemTable } from "@/app/dashboard/components/items/table";

export default function DashboardPage() {
  const {
    lists,
    error,
    deleteItemDialog,
    fetchLists,
    handleGroup,
    handleDeleteList,
    handleDeleteItem,
    handleDeleteItemConfirm,
    handleEditItem,
    handleEditList,
    handleDeleteDialogChange,
    handleAddItem,
    handleAddItemConfirm,
    isAddingItem,
  } = useDashboard();

  useEffect(() => {
    fetchLists();
  }, []);

  if (error) return <Error error={error} />;

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto mt-6">
        <Header />
        <CardContent>
          {lists.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No lists available. Create your first list to get started.
            </div>
          ) : (
            <Accordion collapsible className="w-full" type="single">
              {lists.map((list) => (
                <AccordionItem
                  key={list.listId}
                  className="border rounded-lg mb-2"
                  value={list.listId}
                >
                  <AccordionTrigger className="px-4 py-3 no-underline hover:no-underline">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{list.name}</span>
                      <Actions
                        listId={list.listId}
                        listName={list.name}
                        onAdd={handleAddItem}
                        onDelete={handleDeleteList}
                        onEdit={handleEditList}
                        onGroup={handleGroup}
                      />
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="px-4 py-4">
                      <ItemTable
                        isAddingItem={isAddingItem}
                        items={list.items}
                        listId={list.listId}
                        onAddItem={handleAddItemConfirm}
                        onDeleteItem={handleDeleteItem}
                        onEditItem={handleEditItem}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <DeleteDialog
        isOpen={deleteItemDialog.isOpen}
        onConfirm={handleDeleteItemConfirm}
        onOpenChange={handleDeleteDialogChange}
      />
    </>
  );
}
