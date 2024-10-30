// components/lists/quick-add-modal.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickAddModalProps } from "@/app/dashboard/types";

export function QuickAddModal({
  isOpen,
  onClose,
  onCreateList,
}: QuickAddModalProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: { name: string }) => {
    await onCreateList(data.name);
    reset();
    onClose();
  };

  const handleDetailedCreate = () => {
    onClose();
    router.push("/lists/new");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New List</DialogTitle>
          <Button
            className="absolute right-4 top-4"
            size="icon"
            variant="ghost"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Input
              placeholder="Enter list name"
              {...register("name", { required: true })}
            />
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleDetailedCreate}
            >
              Detailed Create
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating..." : "Quick Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
