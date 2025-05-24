
import React, { useState } from 'react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Task } from '../types/types';
import { Plus, MoreHorizontal, Trash2, Edit2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';

interface ColumnProps {
  column: {
    id: string;
    title: string;
    taskIds: string[];
  };
  tasks: Task[];
  onAddTask: () => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateColumn: (columnId: string, title: string) => void;
  onDeleteColumn: () => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onUpdateColumn,
  onDeleteColumn,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const handleTitleSubmit = () => {
    if (editTitle.trim()) {
      onUpdateColumn(column.id, editTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditTitle(column.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div
      ref={setSortableRef}
      style={style}
      className="bg-white rounded-xl shadow-lg border border-gray-200 w-80 flex-shrink-0"
      {...attributes}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {isEditingTitle ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyPress}
              className="text-lg font-semibold border-none p-0 h-auto focus:ring-0"
              autoFocus
            />
          ) : (
            <h3 
              className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setIsEditingTitle(true)}
              {...listeners}
            >
              {column.title}
            </h3>
          )}
          <div className="flex items-center space-x-2">
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {tasks.length}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onDeleteColumn}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div
        ref={setDroppableRef}
        className="p-4 space-y-3 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto"
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdateTask}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))}
        </SortableContext>

        {/* Add Task Button */}
        <Button
          onClick={onAddTask}
          variant="ghost"
          className="w-full justify-start text-gray-500 hover:text-gray-700 hover:bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-300 py-8"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a task
        </Button>
      </div>
    </div>
  );
};
