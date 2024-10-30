"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search, Settings2 } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboard } from "@/app/dashboard/hooks";
import { Error } from "@/app/dashboard/components/states/error";
import { Header } from "@/app/dashboard/components/list/header";
import { Actions } from "@/app/dashboard/components/list/actions";
import { DeleteDialog } from "@/app/dashboard/components/items/delete-dialog";
import { ItemTable } from "@/app/dashboard/components/items/table";
import { QuickAddModal } from "@/app/dashboard/components/list/quick-add-modal";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
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
    handleQuickCreate,
    isAddingItem,
  } = useDashboard();

  useEffect(() => {
    fetchLists();
  }, []);

  const filteredLists = lists.filter(
    (list) =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      list.items.some((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  if (error) return <Error error={error} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">My Lists</h1>
          <Button
            className="flex items-center gap-2"
            onClick={() => setIsQuickAddOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New List
          </Button>
        </div>

        <Card className="border border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  className="pl-10 bg-background border-input"
                  placeholder="Search lists and items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select>
                <SelectTrigger className="w-[180px] border-input">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date">Date Created</SelectItem>
                  <SelectItem value="items">Number of Items</SelectItem>
                </SelectContent>
              </Select>
              <Button className="border-input" size="icon" variant="outline">
                <Settings2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <Header />
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
                  <Button>
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
                            {list.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {list.items.length} items
                          </span>
                        </div>
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
                      <div className="px-4 py-4 bg-background">
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
      </div>
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onCreateList={handleQuickCreate}
      />

      <DeleteDialog
        isOpen={deleteItemDialog.isOpen}
        onConfirm={handleDeleteItemConfirm}
        onOpenChange={handleDeleteDialogChange}
      />
    </div>
  );
}
