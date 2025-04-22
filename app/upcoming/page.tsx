'use client';

import { useTodo } from '@/context/TodoContext';
import { useState, useRef } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
type Priority = 'low' | 'medium' | 'high';

export default function UpcomingPage() {
  const { todos, setTodos } = useTodo();
  const daysToShow = 60;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1); 
  startDate.setHours(0, 0, 0, 0);

  const [showInputs, setShowInputs] = useState<Record<string, boolean>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const descRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  const formatDateKey = (date: Date) => date.toDateString();

  const formatDateHeading = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formattedDate = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    const weekday = date.toLocaleDateString(undefined, { weekday: 'long' });

    if (date.toDateString() === tomorrow.toDateString()) {
      return `${formattedDate} · Tomorrow · ${weekday}`;
    }

    return `${formattedDate} · ${weekday}`;
  };

  const addTask = (dateKey: string, date: Date) => {
    const title = inputRefs.current[dateKey]?.value.trim();
    const desc = descRefs.current[dateKey]?.value.trim();

    if (title) {
      setTodos(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          title,
          description: desc,
          dueDate: date,
          is_completed: false,
        },
      ]);

      inputRefs.current[dateKey]!.value = '';
      if (descRefs.current[dateKey]) descRefs.current[dateKey]!.value = '';
      setShowInputs(prev => ({ ...prev, [dateKey]: false }));
    }
  };

  const getTodosForDate = (target: Date) => {
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      const d = new Date(todo.dueDate);
      return d.toDateString() === target.toDateString();
    });
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upcoming</h1>

      {[...Array(daysToShow)].map((_, i) => {
        const current = new Date(startDate);
        current.setDate(current.getDate() + i);
        const dateKey = formatDateKey(current);
        const dayTodos = getTodosForDate(current);

        return (
          <div key={dateKey} className="mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-lg font-semibold text-white-700 mb-2">
              {formatDateHeading(current)}
            </h2>

            {dayTodos.map(todo => (
              <div
                key={todo.id}
                className="flex items-start justify-between bg-white shadow-sm rounded px-4 py-3 mb-2 border border-gray-200"
              >
                <div className="flex items-start gap-3 w-full">
                  <div
                    onClick={() =>
                      setTodos(prev =>
                        prev.map(t =>
                          t.id === todo.id ? { ...t, is_completed: !t.is_completed } : t
                        )
                      )
                    }
                    className={`w-5 h-5 mt-1 rounded-full border-2 flex items-center justify-center cursor-pointer ${
                      todo.is_completed ? 'bg-green-500 border-green-500' : 'border-gray-400'
                    }`}
                  >
                    {todo.is_completed && <span className="text-white text-xs">✔</span>}
                  </div>

                  <div className="flex-1">
                    <div className={`font-medium ${todo.is_completed ? 'line-through text-gray-400' : 'text-black'}`}>
                      {todo.title}
                    </div>
                    {todo.description && (
                      <div className="text-sm text-gray-500 mt-1">{todo.description}</div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={() =>
                      setTodos(prev => prev.filter(t => t.id !== todo.id))
                    }
                    className="text-sm text-red-400 hover:text-red-600"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}

            {showInputs[dateKey] ? (
              <div className="space-y-2 mt-2">
                <input
                  type="text"
                  placeholder="Task title"
                  ref={el => (inputRefs.current[dateKey] = el)}
                  className="w-full border px-3 py-2 rounded text-black text-sm"
                />
                <textarea
                  placeholder="Optional description"
                  ref={el => (descRefs.current[dateKey] = el)}
                  className="w-full border px-3 py-2 rounded text-black text-sm"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => addTask(dateKey, current)}
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowInputs(prev => ({ ...prev, [dateKey]: false }))}
                    className="text-sm px-4 py-2 text-black bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
              onClick={() => setShowInputs(prev => ({ ...prev, [dateKey]: true }))}
              className="flex items-center gap-2 text-red-500 hover:text-white group"
            >
              <div className="w-5 h-5 rounded-full border border-red-500 flex items-center justify-center transition-all duration-200 group-hover:bg-red-500">
                <PlusIcon className="w-4 h-4" />
              </div>
              
              <span className="text-sm font-medium transition-colors duration-200 group-hover:text-red-500 group-hover:underline">
                Add task
              </span>
            </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
