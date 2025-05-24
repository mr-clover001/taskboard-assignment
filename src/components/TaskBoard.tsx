
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Column } from './Column';
import { Task } from '../types/types';
import { Plus, Users } from 'lucide-react';
import { Button } from './ui/button';
import { v4 as uuidv4 } from 'uuid';

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

const TaskBoard = () => {
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
  const [onlineUsers] = useState(3); // Mock data for now

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTaskId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the columns
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
    // Delete all tasks in the column
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
              <p className="text-gray-600">Collaborative project management</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{onlineUsers} online</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <Button onClick={addColumn} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="p-6">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-6 overflow-x-auto pb-6">
            <SortableContext items={columns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
              {columns.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={column.taskIds.map(id => tasks[id]).filter(Boolean)}
                  onAddTask={() => addTask(column.id)}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onUpdateColumn={updateColumn}
                  onDeleteColumn={() => deleteColumn(column.id)}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default TaskBoard;
