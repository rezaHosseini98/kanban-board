"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, Edit, MoreHorizontal, Trash2, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/lib/supabase/models";

interface SortableTaskProps {
  task: Task;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function getPriorityColor(priority: "low" | "medium" | "high"): string {
  switch (priority) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-yellow-500";
  }
}

export default function SortableTask({
  task,
  onEditTask,
  onDeleteTask,
}: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const styles = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={styles}
      {...listeners}
      {...attributes}
      className="touch-none select-none"
    >
      <Card className="cursor-pointer hover:shadow-md transition-shadow hover:bg-green-100">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-2">
                {task.title}
              </h4>
              <div
                className="shrink-0"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-28 md:w-32">
                    <DropdownMenuItem
                      onClick={() => onEditTask(task)}
                      className="cursor-pointer text-gray-700 focus:text-gray-800  flex items-center justify-start focus:scale-105"
                    >
                      <Edit className="h-3.5 w-3.5 md:mr-2 text-gray-700 focus:text-gray-800" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteTask(task.id)}
                      className="cursor-pointer text-red-500  focus:text-red-600 flex items-center justify-start focus:scale-105"
                    >
                      <Trash2 className="h-3.5 w-3.5 md:mr-2 text-red-500 focus:text-red-600" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <p className="text-xs text-gray-600 line-clamp-2">
              {task.description || "No description."}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                {task.assignee && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span className="truncate">{task.assignee}</span>
                  </div>
                )}

                {task.due_date && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span className="truncate">{task.due_date}</span>
                  </div>
                )}
              </div>

              <div className="group relative inline-block">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${getPriorityColor(task.priority)}`}
                />
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-green-500 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-sm whitespace-nowrap pointer-events-none z-10">
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
