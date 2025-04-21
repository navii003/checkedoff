'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTodo } from '@/context/TodoContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import TodoList from '@/components/TODOList';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  CalendarIcon,
  FlagIcon,
  BellIcon,
  TagIcon,
} from '@heroicons/react/24/solid';

type Priority = 'low' | 'medium' | 'high';
const REMINDER_OPTIONS = ['In 1 hour', 'In 2 hours'];

export default function Home() {
  const { todos, setTodos } = useTodo();
  const { user } = useAuth();
  const router = useRouter();

  // ✅ Move all hooks BEFORE conditional return
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [priority, setPriority] = useState<Priority>('low');
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showReminderDropdown, setShowReminderDropdown] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [reminder, setReminder] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return <div className="text-center mt-10">Redirecting to login...</div>;

  const insertAtCaret = (text: string) => {
    const sel = window.getSelection();
    if (!sel || !descriptionRef.current) return;

    const range = sel.getRangeAt(0);
    range.deleteContents();
    const span = document.createElement('mark');
    span.className = 'bg-yellow-200 text-black rounded px-1';
    span.textContent = text;
    range.insertNode(span);

    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    descriptionRef.current.focus();
  };

  const handleAddFromModal = () => {
    const title = inputRef.current?.value.trim() || '';
    const description = descriptionRef.current?.innerText.trim() || '';

    if (title) {
      setTodos(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          title,
          description,
          dueDate,
          priority,
          reminder,
          is_completed: false,
        },
      ]);
      inputRef.current!.value = '';
      descriptionRef.current!.innerText = '';
      setDueDate(null);
      setReminder(null);
      setPriority('low');
      setShowCalendar(false);
      setShowModal(false);
      setShowPriorityDropdown(false);
      setShowReminderDropdown(false);
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Tasks</h1>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded"
          onClick={() => setShowModal(true)}
        >
          + Add Task
        </button>
      </div>

      <TodoList todos={todos} setTodos={setTodos} />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg space-y-4 w-full max-w-lg">
            <input
              ref={inputRef}
              type="text"
              placeholder="Task title"
              className="w-full text-2xl font-semibold text-gray-800 outline-none placeholder-gray-400"
            />
            <div className="relative">
              <div
                ref={descriptionRef}
                contentEditable
                data-placeholder="Add a description... Use @ to tag"
                className="w-full text-sm text-gray-700 outline-none resize-none border border-gray-200 rounded px-2 py-2 min-h-[64px] whitespace-pre-wrap placeholder-gray-400 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:block"
                onInput={(e) => {
                  const el = e.currentTarget;
                  const text = el.innerText;
                  const highlighted = text.replace(
                    /(@\w+)/g,
                    '<mark class="bg-yellow-200 text-black rounded px-1">$1</mark>'
                  );
                  el.innerHTML = highlighted;
                  const range = document.createRange();
                  range.selectNodeContents(el);
                  range.collapse(false);
                  const sel = window.getSelection();
                  sel?.removeAllRanges();
                  sel?.addRange(range);
                }}
                suppressContentEditableWarning
              />
            </div>

            <div className="flex flex-wrap gap-3 relative">
              {/* Due Date */}
              <div className="relative">
                <button
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded border text-sm flex items-center gap-2 hover:bg-gray-200"
                  onClick={() => setShowCalendar(prev => !prev)}
                >
                  <CalendarIcon className="w-4 h-4 text-gray-600" />
                  {dueDate ? formatDate(dueDate) : 'Date'}
                </button>
                {showCalendar && (
                  <div className="absolute top-12 left-0 z-50">
                    <DatePicker
                      selected={dueDate}
                      onChange={(date) => {
                        setDueDate(date);
                        setShowCalendar(false);
                      }}
                      inline
                    />
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="relative">
                <button
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded border text-sm flex items-center gap-2 hover:bg-gray-200"
                  onClick={() => setShowPriorityDropdown(prev => !prev)}
                >
                  <FlagIcon className="w-4 h-4 text-gray-600" /> Priority
                </button>
                {showPriorityDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow text-sm w-32 z-10">
                    {['low', 'medium', 'high'].map(level => (
                      <div
                        key={level}
                        onClick={() => {
                          setPriority(level as Priority);
                          setShowPriorityDropdown(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                      >
                        {level}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reminder */}
              <div className="relative">
                <button
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded border text-sm flex items-center gap-2 hover:bg-gray-200"
                  onClick={() => setShowReminderDropdown(prev => !prev)}
                >
                  <BellIcon className="w-4 h-4 text-gray-600" />
                  Reminder
                </button>
                {showReminderDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow text-sm w-48 z-10">
                    {REMINDER_OPTIONS.map(option => (
                      <div
                        key={option}
                        onClick={() => {
                          setReminder(option);
                          setShowReminderDropdown(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tagging */}
              <button
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded border text-sm hover:bg-gray-200 flex items-center gap-2"
                onClick={() => insertAtCaret('@')}
              >
                <TagIcon className="w-4 h-4 text-gray-600" />
                Label
              </button>
            </div>

            <div className="flex justify-end pt-2 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFromModal}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Add task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
