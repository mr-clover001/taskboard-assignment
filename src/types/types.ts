
export interface Task {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface BoardState {
  columns: Column[];
  tasks: Record<string, Task>;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
}
