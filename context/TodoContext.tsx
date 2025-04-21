'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Todo = {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: string;
  reminder: string | null;
  is_completed: boolean;
};

interface TodoContextType {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  return (
    <TodoContext.Provider value={{ todos, setTodos }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) throw new Error('useTodo must be used inside <TodoProvider>');
  return context;
};
