import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Board } from "@/lib/supabase/models";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface BoardListProps {
  boards: Board[];
  viewMode: "grid" | "list";
  onCreateBoard: () => void;
  isCreating: boolean;
}

export default function BoardList({
  boards,
  viewMode,
  onCreateBoard,
  isCreating,
}: BoardListProps) {
  if (boards.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-dashed flex flex-col items-center justify-center p-6">
        <p className="text-gray-500 mb-4">
          No boards found matching your criteria.
        </p>

        <Button
          onClick={onCreateBoard}
          disabled={isCreating}
          className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              <span>Create a new board</span>
            </>
          )}
        </Button>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {boards.map((board) => (
          <Link href={`/boards/${board.id}`} key={board.id}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 group h-full flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-4 h-4 ${board.color || "bg-blue-500"} rounded`}
                  />
                  <Badge className="text-xs" variant="secondary">
                    New
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg mb-2 group-hover:text-green-600 transition-colors">
                    {board.title}
                  </CardTitle>
                  <CardDescription className="text-sm mb-4 line-clamp-2">
                    {board.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 space-y-1 sm:space-y-0 pt-2 border-t border-gray-100">
                  <span>
                    Created {new Date(board.created_at).toLocaleDateString()}
                  </span>
                  <span>
                    Updated {new Date(board.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        <Button
          onClick={onCreateBoard}
          disabled={isCreating}
          variant="ghost"
          className="w-full h-full p-0 bg-transparent hover:bg-transparent text-left block group"
        >
          <Card className="border-2 border-dashed h-full min-h-40 group-hover:border-green-400 group-hover:scale-105 transition-all cursor-pointer">
            <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center h-full">
              {isCreating ? (
                <>
                  <Loader2 className="h-6 w-6 sm:w-8 sm:h-8 text-green-600 animate-spin mb-2" />
                  <p className="text-sm sm:text-base text-green-600 font-medium">
                    Creating...
                  </p>
                </>
              ) : (
                <>
                  <Plus className="h-6 w-6 sm:w-8 sm:h-8 text-gray-500 group-hover:text-green-600 mb-2" />
                  <p className="text-sm sm:text-base text-gray-600 group-hover:text-green-600 font-medium">
                    Create new board
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </Button>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-4">
      {boards.map((board) => (
        <Link href={`/boards/${board.id}`} key={board.id} className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-4 h-4 ${board.color || "bg-green-500"} rounded shrink-0 mr-3`}
                />
                <div>
                  <CardTitle className="text-base group-hover:text-green-600 transition-colors">
                    {board.title}
                  </CardTitle>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {board.description}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
                Updated {new Date(board.updated_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}

      <Button
        onClick={onCreateBoard}
        disabled={isCreating}
        className="w-full text-left p-0 bg-transparent hover:bg-transparent disabled:pointer-events-none block"
      >
        <Card className="border-2 border-dashed hover:border-green-400 transition-colors cursor-pointer group">
          <CardContent className="p-4 flex items-center justify-center space-x-2">
            {isCreating ? (
              <>
                <Loader2 className="h-5 w-5 text-green-600 animate-spin" />
                <span className="text-sm text-green-600 font-medium">
                  Creating...
                </span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-gray-500 group-hover:text-green-600" />
                <span className="text-sm text-gray-600 group-hover:text-green-600 font-medium">
                  Create new board
                </span>
              </>
            )}
          </CardContent>
        </Card>
      </Button>
    </div>
  );
}
