import { useState, useCallback } from "react";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ColumnWithTasks, Task } from "@/lib/supabase/models";

interface UseBoardDndProps {
  columns: ColumnWithTasks[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnWithTasks[]>>;
  moveTask: (
    taskId: string,
    targetColumnId: string,
    newIndex: number,
  ) => Promise<void>;
}

export function useBoardDnd({
  columns,
  setColumns,
  moveTask,
}: UseBoardDndProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const taskId = event.active.id as string;
      const task = columns
        .flatMap((col) => col.tasks)
        .find((t) => t.id === taskId);
      if (task) setActiveTask(task);
    },
    [columns],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const sourceColumn = columns.find((col) =>
        col.tasks.some((t) => t.id === activeId),
      );
      const targetColumn = columns.find((col) =>
        col.tasks.some((t) => t.id === overId),
      );

      if (!sourceColumn || !targetColumn || sourceColumn.id !== targetColumn.id)
        return;

      const activeIndex = sourceColumn.tasks.findIndex(
        (t) => t.id === activeId,
      );
      const overIndex = targetColumn.tasks.findIndex((t) => t.id === overId);

      if (activeIndex !== overIndex) {
        setColumns((prev) => {
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
    },
    [columns, setColumns],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);
      if (!over) return;

      const taskId = active.id as string;
      const overId = over.id as string;

      const targetColumnDirect = columns.find((col) => col.id === overId);

      if (targetColumnDirect) {
        const sourceColumn = columns.find((col) =>
          col.tasks.some((t) => t.id === taskId),
        );
        if (sourceColumn && sourceColumn.id !== targetColumnDirect.id) {
          await moveTask(
            taskId,
            targetColumnDirect.id,
            targetColumnDirect.tasks.length,
          );
        }
      } else {
        const sourceColumn = columns.find((col) =>
          col.tasks.some((t) => t.id === taskId),
        );
        const targetColumn = columns.find((col) =>
          col.tasks.some((t) => t.id === overId),
        );

        if (sourceColumn && targetColumn) {
          const oldIndex = sourceColumn.tasks.findIndex((t) => t.id === taskId);
          const newIndex = targetColumn.tasks.findIndex((t) => t.id === overId);
          if (oldIndex !== newIndex) {
            await moveTask(taskId, targetColumn.id, newIndex);
          }
        }
      }
    },
    [columns, moveTask],
  );

  return {
    sensors,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
