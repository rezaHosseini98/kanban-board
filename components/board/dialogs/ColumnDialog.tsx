"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColumnDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  titleValue: string;
  onTitleChange: (val: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onCancel: () => void;
}

export default function ColumnDialog({
  isOpen,
  onOpenChange,
  mode,
  titleValue,
  onTitleChange,
  isLoading,
  onSubmit,
  onCancel,
}: ColumnDialogProps) {
  const isEdit = mode === "edit";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Column" : "Create New Column"}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            {isEdit
              ? "Update the title of your column"
              : "Add new Column to organize your tasks"}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Column Title</Label>
            <Input
              id="columnTitle"
              value={titleValue}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Enter column title..."
            />
          </div>
          <div className="flex-actions">
            <Button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 text-white">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isEdit ? "Editing..." : "Creating..."}</span>
                </div>
              ) : isEdit ? (
                "Edit Column"
              ) : (
                "Create Column"
              )}
            </Button>
            <Button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
              variant={"outline"}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
