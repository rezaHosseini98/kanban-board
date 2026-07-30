"use client";

import React from "react";
import { Calendar, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/lib/supabase/models";
import { getPriorityColor } from "./SortableTask";

export default function TaskOverlay({ task }: { task: Task }) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow hover:bg-green-100">
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-2">
              {task.title}
            </h4>
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
  );
}
