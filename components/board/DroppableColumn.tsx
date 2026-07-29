"use client";

import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Loader2, MoreHorizontal, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { ColumnWithTasks } from "@/lib/supabase/models";

interface DroppableColumnProps {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onCreateTask: (
    e: React.FormEvent<HTMLFormElement>,
    columnId: string,
  ) => Promise<void>;
  onEditColumn: (column: ColumnWithTasks) => void;
}

export default function DroppableColumn({
  column,
  children,
  onCreateTask,
  onEditColumn,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [isOpen, setIsOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreatingTask(true);
    try {
      await onCreateTask(e, column.id);
      setIsOpen(false);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingTask(false);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={`w-full lg:shrink-0 lg:w-80 ${isOver ? "bg-green-50 rounded-lg" : ""}`}
    >
      <div
        className={`bg-white rounded-lg shadow-sm border ${isOver ? "ring-2 ring-green-500 scale-102" : ""}`}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b ">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {column.title}
              </h3>
              <Badge variant={"secondary"} className="text-xs shrink-0">
                {column.tasks.length}
              </Badge>
            </div>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="shrink-0 cursor-pointer"
              onClick={() => onEditColumn(column)}
            >
              <MoreHorizontal />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-2">
          {children}

          {/* Add Task Dialog */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full cursor-pointer mt-3 text-gray-500 hover:text-green-600 border border-gray-500 border-dashed hover:border-green-600"
                variant={"ghost"}
              >
                <Plus />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
              <DialogHeader>
                <DialogTitle>Create New Tasks</DialogTitle>
                <DialogDescription className="text-xs text-gray-600">
                  Add a task to the board
                </DialogDescription>
              </DialogHeader>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label>
                    Title <sup className="text-red-500">*</sup>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter task title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter task description"
                    rows={3}
                  />
                </div>
                <div className="space-y-4">
                  <Label>Assignee</Label>
                  <Input
                    id="assignee"
                    name="assignee"
                    placeholder="Who should do this?"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select name="priority" defaultValue="medium">
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
                  <Label>due Date</Label>
                  <Input type="date" id="dueDate" name="dueDate" />
                </div>
                <div className="flex justify-between space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="text-green-500 hover:text-green-600 cursor-pointer border border-green-500 hover:border-green-600"
                    disabled={isCreatingTask}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={"ghost"}
                    type="submit"
                    className="text-green-500 hover:text-green-600 cursor-pointer border border-green-500 hover:border-green-600"
                    disabled={isCreatingTask}
                  >
                    {isCreatingTask ? (
                      <div className="flex items-center justify-center gap-2 text-green-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      "Create Task"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
