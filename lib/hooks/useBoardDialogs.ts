import { useState, useCallback } from "react";
import { ColumnWithTasks, Task } from "@/lib/supabase/models";

export function useBoardDialogs() {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isOpenCreatingTask, setIsIsOpenCreatingTask] = useState(false);
  const [creatingColumn, setCreatingColumn] = useState(false);
  const [editingColumn, setEditingColumn] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);

  const [editingTaskData, setEditingTaskData] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [editingColumnWhichTask, setEditingColumnWhichTask] =
    useState<ColumnWithTasks | null>(null);

  const handleEditTaskClick = useCallback((task: Task) => {
    setEditingTaskData(task);
    setIsEditingTask(true);
  }, []);

  const handleDeleteTaskClick = useCallback((taskId: string) => {
    setTaskToDelete(taskId);
  }, []);

  const handleEditColumnClick = useCallback((column: ColumnWithTasks) => {
    setEditingColumnWhichTask(column);
    setEditingColumn(true);
  }, []);

  return {
    // Dialogs visibility states
    isEditingTitle,
    setIsEditingTitle,
    isFilterOpen,
    setIsFilterOpen,
    isOpenCreatingTask,
    setIsIsOpenCreatingTask,
    creatingColumn,
    setCreatingColumn,
    editingColumn,
    setEditingColumn,
    isEditingTask,
    setIsEditingTask,

    // Active item states
    editingTaskData,
    setEditingTaskData,
    taskToDelete,
    setTaskToDelete,
    editingColumnWhichTask,
    setEditingColumnWhichTask,

    // Triggers
    handleEditTaskClick,
    handleDeleteTaskClick,
    handleEditColumnClick,
  };
}
