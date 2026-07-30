"use client";

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

interface FilterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tempFilters: {
    priority: string[];
    assignee: string;
    dueDate: string | null;
  };
  onTempFilterChange: (
    type: "priority" | "assignee" | "dueDate",
    value: string | string[] | null,
  ) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function FilterDialog({
  isOpen,
  onOpenChange,
  tempFilters,
  onTempFilterChange,
  onApply,
  onClear,
}: FilterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
        <DialogHeader>
          <DialogTitle>Filter Tasks</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            Filter tasks by priority, assignee or due date
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Priority</Label>
            <div className="flex flex-wrap gap-2">
              {["low", "medium", "high"].map((priority, key) => (
                <Button
                  className="cursor-pointer"
                  onClick={() => {
                    const newPriorities = tempFilters.priority.includes(
                      priority,
                    )
                      ? tempFilters.priority.filter((p) => p !== priority)
                      : [...tempFilters.priority, priority];
                    onTempFilterChange("priority", newPriorities);
                  }}
                  key={key}
                  variant={
                    tempFilters.priority.includes(priority)
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="filterAssignee">Assignee</Label>
            <Input
              id="filterAssignee"
              placeholder="Filter by assignee name..."
              value={tempFilters.assignee}
              onChange={(e) => onTempFilterChange("assignee", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>due Date</Label>
            <Input
              type="date"
              value={tempFilters.dueDate || ""}
              onChange={(e) =>
                onTempFilterChange("dueDate", e.target.value || null)
              }
            />
          </div>

          <div className="flex-actions">
            <Button type="button" className="btn-primary" onClick={onApply}>
              Apply Filter
            </Button>
            <Button
              type="button"
              className="btn-secondary"
              variant={"outline"}
              onClick={onClear}
            >
              Clear Filter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
