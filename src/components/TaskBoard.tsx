import React, { useState } from "react";
import { useBoardState } from "../hooks/useBoardState";
import { BoardHeader } from "./BoardHeader";
import { BoardContent } from "./BoardContent";

const TaskBoard = () => {
  const [onlineUsers] = useState(3);

  const {
    columns,
    tasks,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    addColumn,
    addTask,
    updateTask,
    deleteTask,
    updateColumn,
    deleteColumn,
  } = useBoardState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <BoardHeader onlineUsers={onlineUsers} onAddColumn={addColumn} />
      <BoardContent
        columns={columns}
        tasks={tasks}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onAddTask={addTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onUpdateColumn={updateColumn}
        onDeleteColumn={deleteColumn}
      />
    </div>
  );
};

export default TaskBoard;
