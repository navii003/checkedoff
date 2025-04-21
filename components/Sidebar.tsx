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
} from '@heroicons/react/24/solid';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
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
      className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-200 ${
        pathname === path ? 'bg-gray-100 font-semibold' : 'text-gray-600'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </div>
  );

  return (
    <aside className="w-[250px] bg-white border-r h-screen p-6 flex flex-col justify-between fixed left-0 top-0">
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-2">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              className="w-16 h-16 rounded-full"
              alt="User Avatar"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-300 rounded-full" />
          )}
          <span className="font-bold text-lg">
            {user?.displayName || 'User'}
          </span>
          <div className="w-full pt-2">
  <div className="text-sm text-gray-500 text-center mb-1">
    {completedCount} of {totalCount} tasks completed
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
    <div
      className="bg-green-500 h-2 transition-all duration-500"
      style={{ width: `${progressPercent}%` }}
    ></div>
  </div>
</div>
        </div>

        <nav className="space-y-1 pt-6">
          {navItem('Inbox', '/', InboxIcon)}
          {navItem('Today', '/today', CalendarDaysIcon)}
          {navItem('Upcoming', '/upcoming', CalendarIcon)}
          {navItem('Completed', '/completed', CheckCircleIcon)}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
