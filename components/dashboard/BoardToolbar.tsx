import { Button } from "@/components/ui/button";
import { Filter, Grid3X3, List, Loader2, Plus } from "lucide-react";

interface BoardToolbarProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onFilterClick: () => void;
  onCreateBoard: () => void;
  isCreating: boolean;
}

export default function BoardToolbar({
  viewMode,
  setViewMode,
  onFilterClick,
  onCreateBoard,
  isCreating,
}: BoardToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Your Boards
        </h2>
        <p className="text-gray-600">Manage your projects and tasks</p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="hidden md:flex justify-evenly items-center space-x-2 bg-white rounded-lg border p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={onFilterClick}>
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
        <Button
          onClick={onCreateBoard}
          disabled={isCreating}
          className="min-w-32.5"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Create Board
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
