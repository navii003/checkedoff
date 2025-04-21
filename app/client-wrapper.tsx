'use client';

import { TodoProvider } from '@/context/TodoContext';
import Sidebar from '@/components/Sidebar';

export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <TodoProvider>
      <div className="flex min-h-screen">
        <aside className="w-64 fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-50">
          <Sidebar />
        </aside>
        <main className="ml-64 flex-1">{children}</main>
      </div>
    </TodoProvider>
  );
}
