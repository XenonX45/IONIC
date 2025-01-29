import { useState } from 'react';
import { Task } from '../interfaces/types';

export const useTodos = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => {
    try {
      setTasks((prev) => [...prev, task]);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const deleteTask = (id: number) => {
    try {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const updateTask = (updatedTask: Task) => {
    try {
      setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)));
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  return { tasks, addTask, deleteTask, updateTask };
};