"use client";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useBoard } from "@/lib/hooks/useBoards";
import { ColumnWithTasks, Task } from "@/lib/supabase/models";
import {
  Calendar,
  Edit,
  Loader2,
  MoreHorizontal,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import {
  closestCenter,
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  rectIntersection,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
function DroppableColumn({
  column,
  children,
  onCreateTask,
  onEditColumn,
}: {
  column: ColumnWithTasks;
  children: React.ReactNode;
  onCreateTask: (taskData: any) => Promise<void>;
  onEditColumn: (column: ColumnWithTasks) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  return (
    <div
      ref={setNodeRef}
      className={`w-full lg:shrink-0 lg:w-80 ${isOver ? "bg-green-50 rounded-lg" : ""}`}
    >
      <div
        className={`bg-white rounded-lg shadow-sm border ${isOver ? "ring-2 ring-green-500 scale-102" : ""}`}
      >
        {/*--------- Column Header-------- */}
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
        {/* Column Content */}
        <div className="p-2">
          {children}
          {/* Add Task */}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="w-full  cursor-pointer mt-3 text-gray-500 hover:text-green-600 border border-gray-500 border-dashed hover:border-green-600"
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
              <form className="space-y-4" onSubmit={onCreateTask}>
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
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="submit"
                    variant={"ghost"}
                    className="text-gray-500 hover:text-green-600  cursor-pointer border border-gray-500  hover:border-green-600"
                    disabled={isCreatingTask}
                  >
                    {isCreatingTask ? (
                      <div className="flex items-center justify-center gap-2 text-white">
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

function SortableTask({
  task,
  onEditTask,
  onDeleteTask,
}: {
  task: Task;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}) {
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
  };
  function getPriorityColor(priority: "low" | "medium" | "high"): string {
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

  return (
    <div ref={setNodeRef} style={styles} {...listeners} {...attributes}>
      <Card className="cursor-pointer hover:shadow-md transition-shadow hover:bg-green-100">
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            {/* Task header */}
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-2">
                {task.title}
              </h4>
              {/* Actions: Edit & Delete buttons */}
              <div
                className="shrink-0"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
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
                      className="cursor-pointer text-gray-700 focus:text-green-600 focus:bg-green-50 flex items-center justify-start"
                    >
                      <Edit className="h-3.5 w-3.5 md:mr-2  focus:text-green-600" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteTask(task.id)}
                      className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 flex items-center justify-start"
                    >
                      <Trash2 className="h-3.5 w-3.5 md:mr-2  text-red-600 focus:text-red-700" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {/* Task Description */}
            <p className="text-xs text-gray-600 line-clamp-2">
              {task.description || "No description."}
            </p>
            {/* task data */}
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
              {
                <div className="group relative inline-block">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${getPriorityColor(task.priority)}`}
                  />

                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-green-800 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-sm whitespace-nowrap pointer-events-none z-10">
                    {task.priority}
                  </span>
                </div>
              }
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TaskOverLay({ task }: { task: Task }) {
  function getPriorityColor(priority: "low" | "medium" | "high"): string {
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

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow hover:bg-green-100">
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-2 sm:space-y-3">
          {/* Task header */}
          <div className="flex items-start justify-between">
            <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-2">
              {task.title}
            </h4>
          </div>
          {/* Task Description */}
          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description || "No description."}
          </p>
          {/* task data */}
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
            {
              <div className="group relative inline-block">
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${getPriorityColor(task.priority)}`}
                />

                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-green-800 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-sm whitespace-nowrap pointer-events-none z-10">
                  {task.priority}
                </span>
              </div>
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
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

  // States for Editing Task
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [editingTaskData, setEditingTaskData] = useState<Task | null>(null);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [CreatingColumn, setCreatingColumn] = useState(false);
  const [editingColumn, setEditingColumn] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [editingColumnWhichTask, setEditingColumnWhichTask] =
    useState<ColumnWithTasks | null>(null);
  const [editingColumnTitle, setEditingColumnTitle] = useState("");
  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isOpenCreatingTask, setIsOpenCreatingTask] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [filters, setFilters] = useState({
    priority: [] as string[],
    assignee: "" as string,
    dueDate: null as string | null,
  });
  const [tempFilters, setTempFilters] = useState({
    priority: [] as string[],
    assignee: "" as string,
    dueDate: null as string | null,
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );
  // ---Filtering functions--
  function handleOpenFilter() {
    setTempFilters({ ...filters });
    setIsFilterOpen(true);
  }
  function handleTempFilterChange(
    type: "priority" | "assignee" | "dueDate",
    value: string | string[] | null,
  ) {
    setTempFilters((prev) => ({
      ...prev,
      [type]: value,
    }));
  }
  function applyFilters() {
    setFilters({ ...tempFilters });
    setIsFilterOpen(false);
  }
  function clearFilter() {
    const emptyFilters = {
      priority: [] as string[],
      assignee: "" as string,
      dueDate: null as string | null,
    };
    setFilters(emptyFilters);
    setTempFilters(emptyFilters);
    setIsFilterOpen(false);
  }

  async function handleUpdateBoard(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !board) return;

    setIsUpdating(true);
    try {
      await updateBoard(board.id, {
        title: newTitle.trim(),
        color: newColor || board.color,
      });
      setIsEditingTitle(false);
    } catch (error) {
    } finally {
      setIsUpdating(false);
    }
  }

  async function createTask(taskData: {
    title: string;
    description?: string;
    assignee?: string;
    dueDate?: string;
    priority: "low" | "medium" | "high";
  }) {
    const targetColumn = columns[0];
    if (!targetColumn) {
      throw new Error("No column available to add task");
    }
    await createRealTask(targetColumn.id, taskData);
  }
  async function handleCreateTasks(e: any) {
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
    if (taskData.title.trim()) {
      setIsCreatingTask(true);
      try {
        await createTask(taskData);
        // closing task card from dom
        setIsOpenCreatingTask(false);
        (e.target as HTMLFormElement).reset();
      } catch (error) {
        console.error(error);
      } finally {
        setIsCreatingTask(false);
      }
    }
  }
  // --- Task Edit & Delete Handlers ---
  function handleEditTaskClick(task: Task) {
    setEditingTaskData(task);
    setIsEditingTask(true);
  }

  async function handleDeleteTaskClick(taskId: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteRealTask(taskId);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdateTaskSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingTaskData) return;

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
      await updateRealTask(editingTaskData.id, taskData);
      setIsEditingTask(false);
      setEditingTaskData(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdatingTask(false);
    }
  }
  // -------------handle Drags --------
  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id as string;
    const task = columns
      .flatMap((col) => col.tasks)
      .find((task) => task.id === taskId);
    if (task) {
      setActiveTask(task);
    }
  }
  // Handel drag on UI
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === activeId),
    );
    const targetColumn = columns.find((col) =>
      col.tasks.some((task) => task.id === overId),
    );

    if (!sourceColumn || !targetColumn) return;

    if (sourceColumn.id === targetColumn.id) {
      const activeIndex = sourceColumn.tasks.findIndex(
        (task) => task.id === activeId,
      );

      const overIndex = targetColumn.tasks.findIndex(
        (task) => task.id === overId,
      );

      if (activeIndex !== overIndex) {
        setColumns((prev: ColumnWithTasks[]) => {
          const newColumns = [...prev];
          const column = newColumns.find((col) => col.id === sourceColumn.id);
          if (column) {
            const tasks = [...column.tasks];
            const [removed] = tasks.splice(activeIndex, 1);
            tasks.splice(overIndex, 0, removed);
            column.tasks = tasks;
          }
          return newColumns;
        });
      }
    }
  }
  // Handel drag tO db
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    const targetColumn = columns.find((col) => col.id === overId);

    if (targetColumn) {
      const sourceColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === taskId),
      );

      if (sourceColumn && sourceColumn.id !== targetColumn.id) {
        await moveTask(taskId, targetColumn.id, targetColumn.tasks.length);
      }
    } else {
      // Check to see if were dropping on another task
      const sourceColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === taskId),
      );
      const targetColumn = columns.find((col) =>
        col.tasks.some((task) => task.id === overId),
      );

      if (sourceColumn && targetColumn) {
        const oldIndex = sourceColumn.tasks.findIndex(
          (task) => task.id === taskId,
        );

        const newIndex = targetColumn.tasks.findIndex(
          (task) => task.id === overId,
        );
        if (oldIndex !== newIndex) {
          await moveTask(taskId, targetColumn.id, newIndex);
        }
      }
    }
  }

  async function handleCreateColumn(e: React.FormEvent) {
    e.preventDefault();

    if (!newColumnTitle.trim()) return;
    setIsCreatingColumn(true);
    try {
      await createColumn(newColumnTitle.trim());

      setNewColumnTitle("");
      setCreatingColumn(false);
    } catch (error) {
    } finally {
      setIsCreatingColumn(false);
    }
  }
  async function handleUpdateColumn(e: React.FormEvent) {
    e.preventDefault();

    if (!editingColumnTitle.trim() || !editingColumnWhichTask) return;
    setIsEditingColumn(true);
    try {
      await updateColumn(editingColumnWhichTask.id, editingColumnTitle.trim());

      setEditingColumnTitle("");
      setEditingColumn(false);
      setEditingColumnWhichTask(null);
    } catch (error) {
    } finally {
      setIsEditingColumn(false);
    }
  }

  function handleEditColumn(column: ColumnWithTasks) {
    setEditingColumn(true);
    setEditingColumnWhichTask(column);
    setEditingColumnTitle(column.title);
  }

  const filteredColumns = columns.map((column) => ({
    ...column,
    tasks: column.tasks.filter((task) => {
      if (
        filters.priority.length > 0 &&
        !filters.priority.includes(task.priority)
      ) {
        return false;
      }

      if (filters.assignee.trim() !== "") {
        if (!task.assignee) return false;
        if (
          !task.assignee
            .toLowerCase()
            .includes(filters.assignee.toLowerCase().trim())
        ) {
          return false;
        }
      }

      if (filters.dueDate && task.due_date) {
        const taskDate = new Date(task.due_date).toDateString();
        const filterDate = new Date(filters.dueDate).toDateString();
        if (taskDate !== filterDate) {
          return false;
        }
      } else if (filters.dueDate && !task.due_date) {
        return false;
      }

      return true;
    }),
  }));

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar
          boardTitle={board?.title}
          onEditBoard={() => {
            setNewTitle(board?.title ?? "");
            setNewColor(board?.color ?? "");
            setIsEditingTitle(true);
          }}
          onFilterClick={() => setIsFilterOpen(true)}
          filterCount={Object.values(filters).reduce((count, v) => {
            if (Array.isArray(v)) {
              return count + v.length;
            }
            if (typeof v === "string" && v.trim() !== "") {
              return count + 1;
            }
            if (
              v !== null &&
              v !== undefined &&
              typeof v !== "string" &&
              !Array.isArray(v)
            ) {
              return count + 1;
            }
            return count;
          }, 0)}
        />

        {/* ---------Edit Title/TitleColor----------- */}
        <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
          <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
            <DialogHeader>
              <DialogTitle>Edit Board</DialogTitle>
              <DialogDescription className="sr-only">
                Update the title and color of your board.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4" onSubmit={handleUpdateBoard}>
              <div className="space-y-2">
                <Label htmlFor="boardTitle">Board Title</Label>
                <Input
                  id="boardTitle"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter board title..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Board Color</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                  {[
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-yellow-500",
                    "bg-red-500",
                    "bg-purple-500",
                    "bg-pink-500",
                    "bg-indigo-500",
                    "bg-gray-500",
                    "bg-orange-500",
                    "bg-teal-500",
                    "bg-cyan-500",
                    "bg-emerald-500",
                  ].map((color, key) => (
                    <button
                      key={key}
                      type="button"
                      className={`w-8 h-8 rounded-full cursor-pointer ${color} ${color === newColor ? "ring-2 ring-offset-2 ring-gray-900" : ""}`}
                      onClick={() => setNewColor(color)}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  className="cursor-pointer hover:bg-gray-300"
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditingTitle(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <div className="flex items-center justify-center gap-2 text-white">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Changing...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* ---------Filter Dialog----------- */}
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
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
                      onClick={() => {
                        const newPriorities = tempFilters.priority.includes(
                          priority,
                        )
                          ? tempFilters.priority.filter((p) => p !== priority)
                          : [...tempFilters.priority, priority];
                        handleTempFilterChange("priority", newPriorities);
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
                  onChange={(e) =>
                    handleTempFilterChange("assignee", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>due Date</Label>
                <Input
                  type="date"
                  value={tempFilters.dueDate || ""}
                  onChange={(e) =>
                    handleTempFilterChange("dueDate", e.target.value || null)
                  }
                />
              </div>

              <div className="flex justify-end pt-4 gap-2">
                <Button
                  type="button"
                  className="cursor-pointer hover:bg-gray-300"
                  variant={"outline"}
                  onClick={clearFilter}
                >
                  Clear Filter
                </Button>
                <Button
                  type="button"
                  className="cursor-pointer"
                  onClick={applyFilters}
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ---------Board Content--------- */}
        <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          {/* ---Stats---- */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Total Tasks: </span>
                {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
              </div>
            </div>

            {/* ------ Add task dialog------*/}
            <Dialog
              open={isOpenCreatingTask}
              onOpenChange={setIsOpenCreatingTask}
            >
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto cursor-pointer ">
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
                <form className="space-y-4" onSubmit={handleCreateTasks}>
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
                            {priority.charAt(0).toUpperCase() +
                              priority.slice(1)}
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
                      onClick={() => setIsOpenCreatingTask(false)}
                      className="text-green-500 hover:text-green-600  cursor-pointer border border-green-500  hover:border-green-600"
                      disabled={isCreatingTask}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant={"ghost"}
                      type="submit"
                      className="text-green-500 hover:text-green-600  cursor-pointer border border-green-500  hover:border-green-600 "
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

          {/* -----------Board Columns-------- */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div
              className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto 
            lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2 
            lg:[&::-webkit-scrollbar-track]:bg-gray-100 
            lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full 
            space-y-4 lg:space-y-0"
            >
              {filteredColumns.map((column, key) => (
                <DroppableColumn
                  key={key}
                  column={column}
                  onCreateTask={handleCreateTasks}
                  onEditColumn={handleEditColumn}
                >
                  <SortableContext
                    items={column.tasks.map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {column.tasks.map((task, key) => (
                        <SortableTask
                          task={task}
                          key={key}
                          onEditTask={handleEditTaskClick}
                          onDeleteTask={handleDeleteTaskClick}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DroppableColumn>
              ))}
              <div className="w-full lg:shrink-0 lg:w-80">
                <Button
                  variant={"outline"}
                  className="w-full h-full min-h-50 border-dashed border-2 text-gray-500 hover:border-green-500 cursor-pointer hover:text-green-500"
                  onClick={() => setCreatingColumn(true)}
                >
                  <Plus />
                  Add another list
                </Button>
              </div>
              <DragOverlay>
                {activeTask ? <TaskOverLay task={activeTask} /> : null}
              </DragOverlay>
            </div>
          </DndContext>
        </main>
      </div>
      {/* ------------------- DIALOG: EDIT TASK ------------------- */}
      <Dialog open={isEditingTask} onOpenChange={setIsEditingTask}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription className="text-xs text-gray-600">
              Update task details
            </DialogDescription>
          </DialogHeader>
          {editingTaskData && (
            <form className="space-y-4" onSubmit={handleUpdateTaskSubmit}>
              <div className="space-y-2">
                <Label>
                  Title <sup className="text-red-500">*</sup>
                </Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingTaskData.title}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={editingTaskData.description || ""}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
              <div className="space-y-4">
                <Label>Assignee</Label>
                <Input
                  id="assignee"
                  name="assignee"
                  defaultValue={editingTaskData.assignee || ""}
                  placeholder="Who should do this?"
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select name="priority" defaultValue={editingTaskData.priority}>
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
                <Label>Due Date</Label>
                <Input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  defaultValue={editingTaskData.due_date || ""}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUpdatingTask}
                  onClick={() => {
                    setIsEditingTask(false);
                    setEditingTaskData(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdatingTask}>
                  {isUpdatingTask ? (
                    <div className="flex items-center justify-center gap-2 text-white">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add new  column */}
      <Dialog open={CreatingColumn} onOpenChange={setCreatingColumn}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <DialogTitle>Create New Column</DialogTitle>
            <DialogDescription className="text-xs text-gray-600">
              Add new Column to organize your tasks
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleCreateColumn}>
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                id="columnTitle"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                placeholder="Enter column title..."
              />
            </div>
            <div className="space-x-2 flex justify-end">
              <Button
                type="button"
                onClick={() => setCreatingColumn(false)}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreatingColumn}>
                {isCreatingColumn ? (
                  <div className="flex items-center justify-center gap-2 text-white">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating...</span>
                  </div>
                ) : (
                  "Create Column"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Editing  column */}
      <Dialog open={editingColumn} onOpenChange={setEditingColumn}>
        <DialogContent className="w-[95vw] max-w-106.25 mx-auto">
          <DialogHeader>
            <DialogTitle>Edit Column</DialogTitle>
            <DialogDescription className="text-xs text-gray-600">
              Update the title of your column
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpdateColumn}>
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                id="columnTitle"
                value={editingColumnTitle}
                onChange={(e) => setEditingColumnTitle(e.target.value)}
                placeholder="Enter column title..."
              />
            </div>
            <div className="space-x-2 flex justify-end">
              <Button
                type="button"
                onClick={() => {
                  setEditingColumn(false);
                  setEditingColumnTitle("");
                  setEditingColumnWhichTask(null);
                }}
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isEditingColumn}>
                {isEditingColumn ? (
                  <div className="flex items-center justify-center gap-2 text-white">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Editing...</span>
                  </div>
                ) : (
                  "Edit Column"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
