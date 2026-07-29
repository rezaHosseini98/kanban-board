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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Task } from "@/lib/supabase/models";

interface TaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  taskData?: Task | null;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  onCancel: () => void;
}

export default function TaskDialog({
  isOpen,
  onOpenChange,
  mode,
  taskData,
  isLoading,
  onSubmit,
  onCancel,
}: TaskDialogProps) {
  const isEdit = mode === "edit";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Task" : "Create New Tasks"}</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            {isEdit ? "Update task details" : "Add a task to the board"}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>
              Title <sup className="text-red-500">*</sup>
            </Label>
            <Input
              id="title"
              name="title"
              defaultValue={isEdit ? taskData?.title : undefined}
              placeholder="Enter task title"
              required={isEdit}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={isEdit ? taskData?.description || "" : undefined}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          <div className="space-y-4">
            <Label>Assignee</Label>
            <Input
              id="assignee"
              name="assignee"
              defaultValue={isEdit ? taskData?.assignee || "" : undefined}
              placeholder="Who should do this?"
            />
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              name="priority"
              defaultValue={isEdit ? taskData?.priority : "medium"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["low", "medium", "high"].map((priority, key) => (
                  <SelectItem key={key} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{isEdit ? "Due Date" : "due Date"}</Label>
            <Input
              type="date"
              id="dueDate"
              name="dueDate"
              defaultValue={isEdit ? taskData?.due_date || "" : undefined}
            />
          </div>

          <div
            className={`flex space-x-2 pt-4 ${
              isEdit ? "justify-end" : "justify-between"
            }`}
          >
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className={
                !isEdit
                  ? "text-green-500 hover:text-green-600 cursor-pointer border border-green-500 hover:border-green-600"
                  : ""
              }
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant={!isEdit ? "ghost" : "default"}
              type="submit"
              className={
                !isEdit
                  ? "text-green-500 hover:text-green-600 cursor-pointer border border-green-500 hover:border-green-600"
                  : ""
              }
              disabled={isLoading}
            >
              {isLoading ? (
                <div
                  className={`flex items-center justify-center gap-2 ${
                    !isEdit ? "text-green-500" : "text-white"
                  }`}
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isEdit ? "Saving..." : "Creating..."}</span>
                </div>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
