'use client';

import { useTodo } from '@/context/TodoContext';
import { useState, useRef } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function TodayPage() {
  const { todos, setTodos } = useTodo();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateKey = today.toDateString();

  const inputRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const [showInput, setShowInput] = useState(false);

  const addTask = () => {
    const title = inputRef.current?.value.trim();
    const description = descRef.current?.value.trim();

    if (title) {
      setTodos(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          title,
          description,
          dueDate: today,
          is_completed: false,
        },
      ]);
      inputRef.current!.value = '';
      if (descRef.current) descRef.current.value = '';
      setShowInput(false);
    }
  };

  const todayTasks = todos.filter(todo => {
    if (!todo.dueDate) return false;
    const d = new Date(todo.dueDate);
    return d.toDateString() === today.toDateString();
  });

  const formatDateHeading = () => {
    const formatted = today.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
    const weekday = today.toLocaleDateString(undefined, { weekday: 'long' });
    return `${formatted} · Today · ${weekday}`;
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Today</h1>

      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">{formatDateHeading()}</h2>

        {todayTasks.map(todo => (
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
                onClick={() => setTodos(prev => prev.filter(t => t.id !== todo.id))}
                className="text-sm text-red-400 hover:text-red-600"
              >
                ❌
              </button>
            </div>
          </div>
        ))}

        {showInput ? (
          <div className="space-y-2 mt-2">
            <input
              type="text"
              placeholder="Task title"
              ref={inputRef}
              className="w-full border px-3 py-2 rounded text-sm"
            />
            <textarea
              placeholder="Optional description"
              ref={descRef}
              className="w-full border px-3 py-2 rounded text-sm"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={addTask}
                className="bg-blue-600 text-white text-sm px-4 py-2 rounded"
              >
                Add
              </button>
              <button
                onClick={() => setShowInput(false)}
                className="text-sm px-4 py-2 bg-gray-100 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
              onClick={() => setShowInput(true)}
              className="flex items-center gap-2 text-red-500 hover:text-white group mt-2"
            >
              {/* Circle Icon */}
              <div className="w-5 h-5 rounded-full border border-red-500 flex items-center justify-center transition-all duration-200 group-hover:bg-red-500">
                <PlusIcon className="w-4 h-4" />
              </div>

              {/* Text */}
              <span className="text-sm font-medium transition-colors duration-200 group-hover:text-red-500 group-hover:underline">
                Add task
              </span>
            </button>
        )}
      </div>
    </div>
  );
}
