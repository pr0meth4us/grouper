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
import { LoadingState } from "@/app/dashboard/components/states/loading";
import { Error } from "@/app/dashboard/components/states/error";
import { Header } from "@/app/dashboard/components/list/header";
import { Actions } from "@/app/dashboard/components/list/actions";
import { DeleteDialog } from "@/app/dashboard/components/items/delete-dialog";
import { ItemTable } from "@/app/dashboard/components/items/table";

export default function DashboardPage() {
  const {
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
  } = useDashboard();

  useEffect(() => {
    fetchLists();
  }, []);

  if (isLoading) return <LoadingState />;
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
                  <AccordionTrigger className="px-4 py-3">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium">{list.name}</span>
                      <Actions
                        listId={list.listId}
                        listName={list.name}
                        onDelete={handleDeleteList}
                        onGroup={handleGroup}
                      />
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="px-4 py-4">
                      <ItemTable
                        items={list.items}
                        listId={list.listId}
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
