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
import { useState, useEffect } from "react";

interface FilterState {
  search: string;
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

interface FilterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: FilterState;
  onApply: (filters: FilterState) => void;
  onClear: () => void;
}

export default function FilterDialog({
  isOpen,
  onOpenChange,
  currentFilters,
  onApply,
  onClear,
}: FilterDialogProps) {
  const [tempFilters, setTempFilters] = useState<FilterState>({
    ...currentFilters,
  });

  useEffect(() => {
    if (isOpen) {
      setTempFilters({ ...currentFilters });
    }
  }, [isOpen, currentFilters]);

  const handleApply = () => {
    onApply(tempFilters);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Boards</DialogTitle>
          <DialogDescription>
            Filter boards by title or date. Changes apply only after
            confirmation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dialog-search">Search</Label>
            <Input
              id="dialog-search"
              value={tempFilters.search}
              placeholder="Search board titles..."
              onChange={(e) =>
                setTempFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="start-date" className="text-xs text-gray-500">
                  Start Date
                </Label>
                <Input
                  id="start-date"
                  type="date"
                  value={tempFilters.dateRange.start || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange,
                        start: e.target.value || null,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="end-date" className="text-xs text-gray-500">
                  End Date
                </Label>
                <Input
                  id="end-date"
                  type="date"
                  value={tempFilters.dateRange.end || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange,
                        end: e.target.value || null,
                      },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-2">
            <Button variant="outline" onClick={onClear}>
              Clear Filter
            </Button>
            <Button onClick={handleApply}>Apply Filter</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
