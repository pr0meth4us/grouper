"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, MoreVertical, Edit, Trash2, Group, Hash, ChevronDown } from "lucide-react";
import { listApi, ListItem } from "@/app/api/list";

// Add this CSS to your globals.css file:
// .accordion-trigger::before,
// .accordion-trigger::after {
//   display: none !important;
// }

type GroupingType = 'none' | 'size' | 'number';

export default function DashboardPage() {
  const [lists, setLists] = useState<ListItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [grouping, setGrouping] = useState<{ [key: string]: GroupingType }>({});
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const handleEditList = (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    console.log('Edit list:', listId);
  };

  const handleGroupBySize = (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    setGrouping(prev => ({ ...prev, [listId]: 'size' }));
  };

  const handleGroupByNumber = (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    setGrouping(prev => ({ ...prev, [listId]: 'number' }));
  };

  const handleEditItem = (listId: string, itemIndex: number) => {
    console.log('Edit item:', listId, itemIndex);
  };

  const handleDeleteItem = (listId: string, itemIndex: number) => {
    console.log('Delete item:', listId, itemIndex);
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const fetchLists = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await listApi.getList();
        setLists(data);
      } catch (err) {
        setError("Failed to fetch lists");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLists();
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Lists</CardTitle>
          <CardDescription>Your saved lists and items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-6 border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p>Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Lists</CardTitle>
        <CardDescription>Your saved lists and items</CardDescription>
      </CardHeader>
      <CardContent>
        {lists.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No lists available
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            className="w-full"
            onValueChange={(value) => {
              setOpenItems(prev => ({
                ...prev,
                [value as string]: !prev[value as string]
              }));
            }}
          >
            {lists.map((list) => (
              <AccordionItem key={list.listId} value={list.listId} className="border rounded-lg mb-2">
                <AccordionTrigger className=" w-full px-4 py-3">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{list.name}</span>
                    <div className="flex items-center" onClick={handleDropdownClick}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => handleEditList(e, list.listId)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit List
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleGroupBySize(e, list.listId)}>
                            <Group className="h-4 w-4 mr-2" />
                            Group by Size
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => handleGroupByNumber(e, list.listId)}>
                            <Hash className="h-4 w-4 mr-2" />
                            Group by Number
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="px-4 py-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">No.</TableHead>
                          <TableHead>Item</TableHead>
                          <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {list.items.length > 0 ? (
                          list.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {index + 1}
                              </TableCell>
                              <TableCell>{item}</TableCell>
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleEditItem(list.listId, index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDeleteItem(list.listId, index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={3}
                              className="text-center text-gray-500"
                            >
                              No items available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}