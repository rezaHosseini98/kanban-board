"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { Plus } from "lucide-react";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useBoard } from "@/lib/hooks/useBoards";

import DroppableColumn from "@/components/board/DroppableColumn";
import SortableTask from "@/components/board/SortableTask";
import TaskOverlay from "@/components/board/TaskOverlay";

// Hooks
import { useBoardDialogs } from "@/lib/hooks/useBoardDialogs";
import { useBoardDnd } from "@/lib/hooks/useBoardDnd";

// dialogs
import BoardHeader from "@/components/board/BoardHeader";
import EditBoardDialog from "@/components/board/dialogs/EditBoardDialog";
import FilterDialog from "@/components/board/dialogs/FilterDialog";
import TaskDialog from "@/components/board/dialogs/TaskDialog";
import DeleteTaskAlertDialog from "@/components/board/dialogs/DeleteTaskAlertDialog";
import ColumnDialog from "@/components/board/dialogs/ColumnDialog";

export default function BoardPage() {
  const { id } = useParams<{ id: string }>();
  const {
    board,
    createColumn,
    updateBoard,
    columns,
    createRealTask,
    setColumns,
    moveTask,
    updateColumn,
    updateRealTask,
    deleteRealTask,
  } = useBoard(id);

  // Custom Hooks
  const dialogs = useBoardDialogs();
  const dnd = useBoardDnd({ columns, setColumns, moveTask });

  // Form inputs & loading states
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [editingColumnTitle, setEditingColumnTitle] = useState("");

  const [isUpdatingBoard, setIsUpdatingBoard] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [isEditingColumn, setIsEditingColumn] = useState(false);

  // Filters state
  const initialFilters = {
    priority: [] as string[],
    assignee: "",
    dueDate: null as string | null,
  };
  const [filters, setFilters] = useState(initialFilters);
  const [tempFilters, setTempFilters] = useState(initialFilters);

  // --- Handlers ---
  const handleTempFilterChange = useCallback(
    (
      type: "priority" | "assignee" | "dueDate",
      value: string | string[] | null,
    ) => {
      setTempFilters((prev) => ({ ...prev, [type]: value }));
    },
    [],
  );

  const applyFilters = useCallback(() => {
    setFilters({ ...tempFilters });
    dialogs.setIsFilterOpen(false);
  }, [tempFilters, dialogs]);

  const clearFilter = useCallback(() => {
    setFilters(initialFilters);
    setTempFilters(initialFilters);
    dialogs.setIsFilterOpen(false);
  }, [dialogs]);

  const handleUpdateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !board) return;
    setIsUpdatingBoard(true);
    try {
      await updateBoard(board.id, {
        title: newTitle.trim(),
        description: newDescription.trim(),
        color: newColor || board.color,
      });
      dialogs.setIsEditingTitle(false);
    } finally {
      setIsUpdatingBoard(false);
    }
  };

  const handleCreateTasks = async (
    e: React.FormEvent<HTMLFormElement>,
    targetColumnId?: string,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      assignee: (formData.get("assignee") as string) || undefined,
      dueDate: (formData.get("dueDate") as string) || undefined,
      priority:
        (formData.get("priority") as "low" | "medium" | "high") || "medium",
    };

    const columnId = targetColumnId || columns[0]?.id;
    if (!columnId) throw new Error("No column available to add task");

    if (taskData.title.trim()) {
      setIsCreatingTask(true);
      try {
        await createRealTask(columnId, taskData);
        dialogs.setIsIsOpenCreatingTask(false);
        (e.target as HTMLFormElement).reset();
      } finally {
        setIsCreatingTask(false);
      }
    }
  };

  const confirmDeleteTask = async () => {
    if (!dialogs.taskToDelete) return;
    try {
      await deleteRealTask(dialogs.taskToDelete);
    } finally {
      dialogs.setTaskToDelete(null);
    }
  };

  const handleUpdateTaskSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!dialogs.editingTaskData) return;
    const formData = new FormData(e.currentTarget);
    const taskData = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      assignee: (formData.get("assignee") as string) || undefined,
      dueDate: (formData.get("dueDate") as string) || undefined,
      priority: formData.get("priority") as "low" | "medium" | "high",
    };

    setIsUpdatingTask(true);
    try {
      await updateRealTask(dialogs.editingTaskData.id, taskData);
      dialogs.setIsEditingTask(false);
      dialogs.setEditingTaskData(null);
    } finally {
      setIsUpdatingTask(false);
    }
  };

  const handleCreateColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;
    setIsCreatingColumn(true);
    try {
      await createColumn(newColumnTitle.trim());
      setNewColumnTitle("");
      dialogs.setCreatingColumn(false);
    } finally {
      setIsCreatingColumn(false);
    }
  };

  const handleUpdateColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingColumnTitle.trim() || !dialogs.editingColumnWhichTask) return;
    setIsEditingColumn(true);
    try {
      await updateColumn(
        dialogs.editingColumnWhichTask.id,
        editingColumnTitle.trim(),
      );
      setEditingColumnTitle("");
      dialogs.setEditingColumn(false);
      dialogs.setEditingColumnWhichTask(null);
    } finally {
      setIsEditingColumn(false);
    }
  };

  // Memos
  const filteredColumns = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => {
        if (
          filters.priority.length > 0 &&
          !filters.priority.includes(task.priority)
        )
          return false;
        if (
          filters.assignee.trim() &&
          !task.assignee
            ?.toLowerCase()
            .includes(filters.assignee.toLowerCase().trim())
        )
          return false;
        if (filters.dueDate) {
          if (!task.due_date) return false;
          if (
            new Date(task.due_date).toDateString() !==
            new Date(filters.dueDate).toDateString()
          )
            return false;
        }
        return true;
      }),
    }));
  }, [columns, filters]);

  const totalTasksCount = useMemo(
    () => columns.reduce((sum, col) => sum + col.tasks.length, 0),
    [columns],
  );
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priority.length > 0) count += filters.priority.length;
    if (filters.assignee.trim()) count += 1;
    if (filters.dueDate) count += 1;
    return count;
  }, [filters]);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          boardTitle={board?.title}
          boardColor={board?.color}
          onEditBoard={() => {
            setNewTitle(board?.title ?? "");
            setNewDescription(board?.description ?? "");
            setNewColor(board?.color ?? "");
            dialogs.setIsEditingTitle(true);
          }}
          onFilterClick={() => {
            setTempFilters({ ...filters });
            dialogs.setIsFilterOpen(true);
          }}
          filterCount={activeFilterCount}
        />

        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <BoardHeader
            totalTasks={totalTasksCount}
            description={board?.description}
            onAddTask={() => dialogs.setIsIsOpenCreatingTask(true)}
          />

          <DndContext
            sensors={dnd.sensors}
            collisionDetection={closestCenter}
            onDragStart={dnd.handleDragStart}
            onDragOver={dnd.handleDragOver}
            onDragEnd={dnd.handleDragEnd}
          >
            <div className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2 lg:[&::-webkit-scrollbar-track]:bg-gray-100 lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full space-y-4 lg:space-y-0">
              {filteredColumns.map((column) => (
                <DroppableColumn
                  key={column.id}
                  column={column}
                  onCreateTask={handleCreateTasks}
                  onEditColumn={(col) => {
                    setEditingColumnTitle(col.title);
                    dialogs.handleEditColumnClick(col);
                  }}
                >
                  <SortableContext
                    items={column.tasks.map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {column.tasks.map((task) => (
                        <SortableTask
                          key={task.id}
                          task={task}
                          onEditTask={dialogs.handleEditTaskClick}
                          onDeleteTask={dialogs.handleDeleteTaskClick}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DroppableColumn>
              ))}

              <div className="w-full lg:shrink-0 lg:w-80">
                <Button
                  variant="outline"
                  className="w-full h-full min-h-50 border-dashed border-2 text-gray-500 hover:border-green-500 cursor-pointer hover:text-green-500"
                  onClick={() => dialogs.setCreatingColumn(true)}
                >
                  <Plus className="mr-1 h-4 w-4" /> Add another list
                </Button>
              </div>

              <DragOverlay>
                {dnd.activeTask ? <TaskOverlay task={dnd.activeTask} /> : null}
              </DragOverlay>
            </div>
          </DndContext>
        </main>
      </div>

      {/* --------- Dialogs --------- */}
      <EditBoardDialog
        isOpen={dialogs.isEditingTitle}
        onOpenChange={dialogs.setIsEditingTitle}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        newColor={newColor}
        setNewColor={setNewColor}
        isUpdating={isUpdatingBoard}
        onSubmit={handleUpdateBoard}
      />

      <FilterDialog
        isOpen={dialogs.isFilterOpen}
        onOpenChange={dialogs.setIsFilterOpen}
        tempFilters={tempFilters}
        onTempFilterChange={handleTempFilterChange}
        onApply={applyFilters}
        onClear={clearFilter}
      />

      <TaskDialog
        isOpen={dialogs.isOpenCreatingTask}
        onOpenChange={dialogs.setIsIsOpenCreatingTask}
        mode="create"
        isLoading={isCreatingTask}
        onSubmit={handleCreateTasks}
        onCancel={() => dialogs.setIsIsOpenCreatingTask(false)}
      />

      <TaskDialog
        isOpen={dialogs.isEditingTask}
        onOpenChange={dialogs.setIsEditingTask}
        mode="edit"
        taskData={dialogs.editingTaskData}
        isLoading={isUpdatingTask}
        onSubmit={handleUpdateTaskSubmit}
        onCancel={() => {
          dialogs.setIsEditingTask(false);
          dialogs.setEditingTaskData(null);
        }}
      />

      <DeleteTaskAlertDialog
        isOpen={!!dialogs.taskToDelete}
        onOpenChange={(open) => !open && dialogs.setTaskToDelete(null)}
        onCancel={() => dialogs.setTaskToDelete(null)}
        onConfirm={confirmDeleteTask}
      />

      <ColumnDialog
        isOpen={dialogs.creatingColumn}
        onOpenChange={dialogs.setCreatingColumn}
        mode="create"
        titleValue={newColumnTitle}
        onTitleChange={setNewColumnTitle}
        isLoading={isCreatingColumn}
        onSubmit={handleCreateColumn}
        onCancel={() => dialogs.setCreatingColumn(false)}
      />

      <ColumnDialog
        isOpen={dialogs.editingColumn}
        onOpenChange={dialogs.setEditingColumn}
        mode="edit"
        titleValue={editingColumnTitle}
        onTitleChange={setEditingColumnTitle}
        isLoading={isEditingColumn}
        onSubmit={handleUpdateColumn}
        onCancel={() => {
          dialogs.setEditingColumn(false);
          setEditingColumnTitle("");
          dialogs.setEditingColumnWhichTask(null);
        }}
      />
    </>
  );
}
