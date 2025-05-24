import React from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column } from "./Column";
import { Task } from "../types/types";
import { Column as ColumnType } from "../hooks/useBoardState";

interface BoardContentProps {
  columns: ColumnType[];
  tasks: Record<string, Task>;
  onDragStart: (event: any) => void;
  onDragOver: (event: any) => void;
  onDragEnd: (event: any) => void;
  onAddTask: (columnId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export const BoardContent: React.FC<BoardContentProps> = ({
  columns,
  tasks,
  onDragStart,
  onDragOver,
  onDragEnd,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateColumn,
  onDeleteColumn,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <div className="p-6">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex space-x-6 overflow-x-auto pb-6">
          <SortableContext
            items={columns.map((col) => col.id)}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                tasks={column.taskIds.map((id) => tasks[id]).filter(Boolean)}
                onAddTask={() => onAddTask(column.id)}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                onUpdateColumn={onUpdateColumn}
                onDeleteColumn={() => onDeleteColumn(column.id)}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
};
