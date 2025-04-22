'use client';

import { useRouter, usePathname } from 'next/navigation';
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTodo } from '@/context/TodoContext';

import {
  InboxIcon,
  CalendarDaysIcon,
  CalendarIcon,
  CheckCircleIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { todos } = useTodo();
  const completedCount = todos.filter(todo => todo.is_completed).length;
  const totalCount = todos.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const navItem = (
    label: string,
    path: string,
    Icon: React.ElementType
  ) => (
    <div
      onClick={() => router.push(path)}
      className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded transition-colors ${
        pathname === path
          ? 'bg-[#334155] font-semibold'
          : 'hover:bg-[#1e293b] text-gray-300'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </div>
  );

  return (
    <aside className="w-[250px] bg-[#040b16] h-screen p-6 flex flex-col justify-between text-white">
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              className="w-16 h-16 rounded-full border-2 border-white"
              alt="User Avatar"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-500 rounded-full" />
          )}
          <span className="font-semibold text-lg">{user?.displayName || 'User'}</span>
          <div className="w-full pt-2">
            <div className="text-sm text-gray-300 text-center mb-1">
              {completedCount} of {totalCount} tasks completed
            </div>
            <div className="w-full bg-[#334155] rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <nav className="space-y-1 pt-6 text-sm">
          {navItem('Inbox', '/', InboxIcon)}
          {navItem('Today', '/today', CalendarDaysIcon)}
          {navItem('Upcoming', '/upcoming', CalendarIcon)}
          {navItem('Completed', '/completed', CheckCircleIcon)}
        </nav>
      </div>

      <button
        onClick={logout}
        className="flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-200 mt-4"
      >
        <ArrowRightOnRectangleIcon className="w-5 h-5" />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
