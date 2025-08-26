import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Priority = 'high' | 'medium' | 'low';
export type Status = 'pending' | 'completed' | 'deleted';

export interface BulletPoint {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  bulletPoints: BulletPoint[];
  createdAt: Date;
  completedAt?: Date;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  toggleBulletPoint: (taskId: string, bulletPointId: string) => void;
  addBulletPoint: (taskId: string, text: string) => void;
  removeBulletPoint: (taskId: string, bulletPointId: string) => void;
  getTaskById: (id: string) => Task | undefined;
  getFilteredTasks: (status: Status, priority?: Priority) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      return parsedTasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const completeTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: 'completed',
              completedAt: new Date(),
              bulletPoints: task.bulletPoints.map((bp) => ({
                ...bp,
                completed: true,
              })),
            }
          : task
      )
    );
  };

  const toggleBulletPoint = (taskId: string, bulletPointId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              bulletPoints: task.bulletPoints.map((bp) =>
                bp.id === bulletPointId
                  ? { ...bp, completed: !bp.completed }
                  : bp
              ),
            }
          : task
      )
    );
  };

  const addBulletPoint = (taskId: string, text: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              bulletPoints: [
                ...task.bulletPoints,
                {
                  id: Date.now().toString(),
                  text,
                  completed: false,
                },
              ],
            }
          : task
      )
    );
  };

  const removeBulletPoint = (taskId: string, bulletPointId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              bulletPoints: task.bulletPoints.filter(
                (bp) => bp.id !== bulletPointId
              ),
            }
          : task
      )
    );
  };

  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  const getFilteredTasks = (status: Status, priority?: Priority) => {
    return tasks.filter(
      (task) =>
        task.status === status &&
        (priority ? task.priority === priority : true)
    );
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    toggleBulletPoint,
    addBulletPoint,
    removeBulletPoint,
    getTaskById,
    getFilteredTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
