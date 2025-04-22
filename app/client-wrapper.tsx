'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTodo } from '@/context/TodoContext';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { todos } = useTodo();
  const [width, height] = useWindowSize();
  const [showModal, setShowModal] = useState(false);

  const hideSidebarRoutes = ['/login'];
  const completedCount = todos.filter(t => t.is_completed).length;
  const allDone = todos.length > 0 && completedCount === todos.length;

  return (
    <div className="flex h-screen w-full bg-[#0D1321] text-white">
      {allDone && <Confetti width={width} height={height} recycle={false} />}
      {!hideSidebarRoutes.includes(pathname) && user && (
        <Sidebar onAddClick={() => setShowModal(true)} />
      )}
      <main className="flex-1 overflow-y-auto px-10 py-8">{children}</main>
    </div>
  );
}
