'use client';

import '../styles/globals.css';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { TodoProvider, useTodo } from '@/context/TodoContext';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';


const inter = Inter({ subsets: ['latin'] });

function LayoutWrapper({ children }: { children: React.ReactNode }) {
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
      {/* 🎉 Confetti when all tasks are completed */}
      {allDone && <Confetti width={width} height={height} recycle={false} />}

      {/* Sidebar only if logged in and not on /login */}
      {!hideSidebarRoutes.includes(pathname) && user && (
        <Sidebar onAddClick={() => setShowModal(true)} />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto px-10 py-8">{children}</main>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0D1321]`}>
        <AuthProvider>
          <TodoProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </TodoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
