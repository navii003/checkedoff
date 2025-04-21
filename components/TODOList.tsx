'use client';

import React from 'react';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/solid';

type Priority = 'low' | 'medium' | 'high';

type Todo = {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date | null;
  is_completed: boolean;
  completedAt?: string | null;
  priority?: Priority;
};

type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

export default function TodoList({ todos, setTodos }: Props) {
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? {
              ...todo,
              is_completed: !todo.is_completed,
              completedAt: !todo.is_completed ? new Date().toISOString() : null,
            }
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: string, newTitle: string) => {
    setTodos(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              title: newTitle,
            }
          : t
      )
    );
    setEditingId(null);
  };

  const formatDueDate = (date: Date): string => {
    const now = new Date();
    const target = new Date(date);
    const oneDay = 1000 * 60 * 60 * 24;

    const diffDays = Math.floor(
      (target.getTime() - new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) / oneDay
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays > 1 && diffDays < 7) {
      return target.toLocaleDateString(undefined, {
        weekday: 'long',
      });
    }

    return target.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section className="flex-1 flex items-center justify-center px-4 py-10 text-black">
      <div className="w-full max-w-xl space-y-6">
        <ul className="space-y-3">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="flex justify-between items-start bg-white shadow-sm rounded px-4 py-3 border border-gray-200"
            >
              {editingId === todo.id ? (
                <input
                  type="text"
                  defaultValue={todo.title}
                  onBlur={(e) => updateTodo(todo.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') updateTodo(todo.id, (e.target as HTMLInputElement).value);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  autoFocus
                  className="bg-transparent border-b border-teal-400 outline-none text-black w-full"
                />
              ) : (
                <div className="flex items-start gap-3 cursor-pointer w-full">
                  {/* Toggle Circle */}
                  <div
                    onClick={() => toggleComplete(todo.id)}
                    className={`w-5 h-5 mt-1 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                      todo.is_completed ? 'bg-green-500 border-green-500' : 'border-gray-400'
                    }`}
                  >
                    {todo.is_completed && <span className="text-white text-xs">✔</span>}
                  </div>

                  <div className="flex-1" onClick={() => toggleComplete(todo.id)}>
                    <div className={`font-medium ${todo.is_completed ? 'line-through text-gray-400' : 'text-black'}`}>
                      {todo.title}
                    </div>

                    {todo.description && (
                      <div className="text-sm text-gray-500 mt-1">{todo.description}</div>
                    )}

                    {todo.dueDate && (
                      <div className="text-sm text-purple-400 mt-1">
                        Due: {formatDueDate(new Date(todo.dueDate))}
                      </div>
                    )}

                    {todo.priority && (
                      <div
                        className={`mt-1 inline-block px-2 py-1 text-xs font-semibold rounded 
                        ${todo.priority === 'high' ? 'bg-red-100 text-red-600' : ''}
                        ${todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' : ''}
                        ${todo.priority === 'low' ? 'bg-green-100 text-green-600' : ''}`}
                      >
                        {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 ml-3 mt-1">
                    <button onClick={() => setEditingId(todo.id)} className="text-black-800 hover:text-blue-700">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteTodo(todo.id)} className="text-black-800 hover:text-red-700">
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
