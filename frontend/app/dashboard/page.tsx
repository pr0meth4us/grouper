"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";

import DashboardHeader from "./components/header";
import { useDashboard } from "./hooks/use-dashboard";
import { useListEditing } from "./hooks/use-list-editing";
import { useListFiltering } from "./hooks/use-list-filtering";
import { Error } from "./components/states/error";
import { Actions } from "./components/list/actions";
import { DeleteDialog } from "./components/items/delete-dialog";
import { ItemTable } from "./components/items/table";
import { QuickAddModal } from "./components/list/quick-add-modal";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  const dashboard = useDashboard();
  const {
    editingListId,
    editingName,
    startEditing,
    stopEditing,
    handleChangeListName,
  } = useListEditing(dashboard.handleEditList);
  const { filterLists } = useListFiltering();

  useEffect(() => {
    dashboard.fetchLists();
  }, []);

  const filteredLists = filterLists(dashboard.lists, searchQuery);

  if (dashboard.error) return <Error error={dashboard.error} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <DashboardHeader
          searchQuery={searchQuery}
          setIsQuickAddOpen={setIsQuickAddOpen}
          setSearchQuery={setSearchQuery}
        />

        <Card className="border border-border">
          <CardContent className="p-6">
            {filteredLists.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {searchQuery ? (
                      <Search className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <Plus className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">
                  {searchQuery ? "No results found" : "No lists available"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Create your first list to get started"}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsQuickAddOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create New List
                  </Button>
                )}
              </div>
            ) : (
              <Accordion collapsible className="w-full space-y-2" type="single">
                {filteredLists.map((list) => (
                  <AccordionItem
                    key={list.listId}
                    className="border border-border rounded-lg overflow-hidden"
                    value={list.listId}
                  >
                    <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-foreground">
                            {editingListId === list.listId ? (
                              <Input
                                className="max-w-md"
                                value={editingName}
                                onBlur={stopEditing}
                                onChange={handleChangeListName}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    stopEditing(e);
                                  }
                                  if (e.key === "Escape") {
                                    stopEditing(e);
                                  }
                                }}
                              />
                            ) : (
                              list.name
                            )}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {list.items.length} items
                          </span>
                        </div>
                        <Actions
                          isEditingList={editingListId === list.listId}
                          listId={list.listId}
                          listName={list.name}
                          onAdd={dashboard.handleAddItem}
                          onDelete={dashboard.handleDeleteList}
                          onEdit={() =>
                            startEditing(list.listId, list.name, list.items)
                          }
                          onGroup={dashboard.handleGroup}
                        />
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="px-4 py-4 bg-background">
                        <ItemTable
                          isAddingItem={dashboard.isAddingItem}
                          isEditingList={editingListId === list.listId}
                          items={list.items}
                          listId={list.listId}
                          onAddItem={dashboard.handleAddItemConfirm}
                          onDeleteItem={dashboard.handleDeleteItem}
                          onEditItem={dashboard.handleEditItem}
                          onSubmitList={(e, content) => {
                            dashboard.handleEditList(
                              e,
                              list.listId,
                              editingName,
                              content,
                            );
                            stopEditing(e);
                          }}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>
      </div>

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onCreateList={dashboard.handleQuickCreate}
      />

      <DeleteDialog
        isOpen={dashboard.deleteItemDialog.isOpen}
        onConfirm={dashboard.handleDeleteItemConfirm}
        onOpenChange={dashboard.handleDeleteDialogChange}
      />
    </div>
  );
}
