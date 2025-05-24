
import { useState } from 'react';
import { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { Task } from '../types/types';
import { v4 as uuidv4 } from 'uuid';

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export const useBoardState = () => {
  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', taskIds: ['task-1', 'task-2'] },
    { id: 'in-progress', title: 'In Progress', taskIds: ['task-3'] },
    { id: 'done', title: 'Done', taskIds: ['task-4'] },
  ]);

  const [tasks, setTasks] = useState<Record<string, Task>>({
    'task-1': {
      id: 'task-1',
      title: 'Design landing page',
      description: 'Create wireframes and mockups for the new landing page',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    'task-2': {
      id: 'task-2',
      title: 'Setup authentication',
      description: 'Implement user login and registration system',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    'task-3': {
      id: 'task-3',
      title: 'Database integration',
      description: 'Connect the app to the database and setup CRUD operations',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    'task-4': {
      id: 'task-4',
      title: 'Project setup',
      description: 'Initialize the project with React and necessary dependencies',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = columns.find(col => col.taskIds.includes(activeId));
    const overColumn = columns.find(col => col.id === overId || col.taskIds.includes(overId));

    if (!activeColumn || !overColumn) return;
    if (activeColumn.id === overColumn.id) return;

    setColumns(columns => {
      const activeItems = activeColumn.taskIds;
      const overItems = overColumn.taskIds;

      const activeIndex = activeItems.indexOf(activeId);
      const overIndex = overItems.indexOf(overId);

      let newIndex;
      if (overId in tasks) {
        newIndex = overIndex;
      } else {
        const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return columns.map(col => {
        if (col.id === activeColumn.id) {
          return { ...col, taskIds: activeItems.filter(id => id !== activeId) };
        } else if (col.id === overColumn.id) {
          const newTaskIds = [...overItems];
          newTaskIds.splice(newIndex, 0, activeId);
          return { ...col, taskIds: newTaskIds };
        }
        return col;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTaskId(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = columns.find(col => col.taskIds.includes(activeId));
    const overColumn = columns.find(col => col.id === overId || col.taskIds.includes(overId));

    if (!activeColumn || !overColumn) return;

    if (activeColumn.id === overColumn.id) {
      const activeIndex = activeColumn.taskIds.indexOf(activeId);
      const overIndex = activeColumn.taskIds.indexOf(overId);

      if (activeIndex !== overIndex) {
        setColumns(columns => columns.map(col => {
          if (col.id === activeColumn.id) {
            const newTaskIds = [...col.taskIds];
            newTaskIds.splice(activeIndex, 1);
            newTaskIds.splice(overIndex, 0, activeId);
            return { ...col, taskIds: newTaskIds };
          }
          return col;
        }));
      }
    }
  };

  const addColumn = () => {
    const newColumn: Column = {
      id: uuidv4(),
      title: 'New Column',
      taskIds: [],
    };
    setColumns([...columns, newColumn]);
  };

  const addTask = (columnId: string) => {
    const newTask: Task = {
      id: uuidv4(),
      title: 'New Task',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setTasks({ ...tasks, [newTask.id]: newTask });
    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, taskIds: [...col.taskIds, newTask.id] }
        : col
    ));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(tasks => ({
      ...tasks,
      [taskId]: {
        ...tasks[taskId],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
    }));
  };

  const deleteTask = (taskId: string) => {
    const newTasks = { ...tasks };
    delete newTasks[taskId];
    setTasks(newTasks);
    
    setColumns(columns.map(col => ({
      ...col,
      taskIds: col.taskIds.filter(id => id !== taskId)
    })));
  };

  const updateColumn = (columnId: string, title: string) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, title } : col
    ));
  };

  const deleteColumn = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (column) {
      const newTasks = { ...tasks };
      column.taskIds.forEach(taskId => {
        delete newTasks[taskId];
      });
      setTasks(newTasks);
    }
    
    setColumns(columns.filter(col => col.id !== columnId));
  };

  return {
    columns,
    tasks,
    activeTaskId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    addColumn,
    addTask,
    updateTask,
    deleteTask,
    updateColumn,
    deleteColumn,
  };
};
