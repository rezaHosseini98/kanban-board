import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BoardHeaderProps {
  totalTasks: number;
  description?: string | null;
  onAddTask: () => void;
}

export default function BoardHeader({
  totalTasks,
  description,
  onAddTask,
}: BoardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <div className="text-sm text-gray-600">
          <span className="font-medium">Total Tasks: </span>
          {totalTasks}
        </div>
      </div>
      <p className="text-gray-700">
        <span className="font-bold">description: </span>"{description}"
      </p>

      <Button className="w-full sm:w-auto cursor-pointer" onClick={onAddTask}>
        <Plus className="mr-1 h-4 w-4" />
        Add Task
      </Button>
    </div>
  );
}
