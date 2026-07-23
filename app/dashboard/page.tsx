"use client";
import BoardError from "@/components/dashboard/BoardError";
import BoardList from "@/components/dashboard/BoardList";
import BoardToolbar from "@/components/dashboard/BoardToolbar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FilterDialog from "@/components/dashboard/FilterDialog";
import StatCards from "@/components/dashboard/StatCards";
import Navbar from "@/components/Navbar";
import DashboardSkelton from "@/components/skeleton/DashboardSkelton";
import { Input } from "@/components/ui/input";
import { useBoards } from "@/lib/hooks/useBoards";
import { Board } from "@/lib/supabase/models";
import { useUser } from "@clerk/nextjs";
import { Search } from "lucide-react";
import { useState } from "react";

// https://definite-ladybird-90.clerk.accounts.dev
export default function DashboardPage() {
  const { user } = useUser();
  const { createBoard, deleteBoard, boards, deletedCount, loading, error } =
    useBoards();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    dateRange: {
      start: null as string | null,
      end: null as string | null,
    },
  });

  const filteredBoards = boards.filter((board: Board) => {
    const matchesSearch = board.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchDateRange =
      !filters.dateRange.start ||
      (new Date(board.created_at) >= new Date(filters.dateRange.start) &&
        (!filters.dateRange.end ||
          new Date(board.created_at) <= new Date(filters.dateRange.end)));

    return matchesSearch && matchDateRange;
  });
  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    const empty = { search: "", dateRange: { start: null, end: null } };
    setFilters(empty);
    setIsFilterOpen(false);
  };
  const handleCreateBoard = async () => {
    setIsCreating(true);
    try {
      await createBoard({ title: "New Board" });
    } catch (err) {
      console.error("Failed to create board:", err);
    } finally {
      setIsCreating(false);
    }
  };
  const handleDeleteBoard = async (boardId: string) => {
    try {
      await deleteBoard(boardId);
    } catch (err) {
      console.error("Error deleting board:", err);
    }
  };

  if (loading) {
    return <DashboardSkelton />;
  }
  if (error) {
    return <BoardError error={error} />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* ------Header-------- */}
        <DashboardHeader user={user} />

        {/*-------------- Stats Cards------------ */}
        <StatCards boards={boards} deletedCount={deletedCount} />

        {/* ----------Boards---------- */}
        <div className="mb-6 sm:mb-8">
          {/*---- create board --filter---viewMod------  */}
          <BoardToolbar
            viewMode={viewMode}
            setViewMode={setViewMode}
            onFilterClick={() => setIsFilterOpen(true)}
            onCreateBoard={handleCreateBoard}
            isCreating={isCreating}
          />
          {/* --------------Search Bar----- */}
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 " />
            <Input
              id="search"
              placeholder="Search boards..."
              className="pl-10"
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
          {/* ---------Boards Main------------- */}
          <BoardList
            boards={filteredBoards}
            viewMode={viewMode}
            onCreateBoard={handleCreateBoard}
            onDeleteBoard={handleDeleteBoard}
            isCreating={isCreating}
          />
        </div>
      </main>
      {/* --------Filter ---------- */}
      <FilterDialog
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        currentFilters={filters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />
    </div>
  );
}
