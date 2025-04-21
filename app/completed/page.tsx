'use client';

import { useTodo } from '@/context/TodoContext';
import { useAuth } from '@/context/AuthContext'; // import the auth context

export default function CompletedPage() {
  const { todos } = useTodo();
  const { user } = useAuth(); // get the logged-in user

  const completedTodos = todos.filter(todo => todo.is_completed);

  const formatTime = (date: Date) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">✅ Completed Tasks</h1>
      {completedTodos.length === 0 ? (
        <p className="text-gray-500">No completed tasks yet.</p>
      ) : (
        completedTodos.map(todo => (
          <div key={todo.id} className="flex items-center gap-4 mb-4 border-b pb-2">
            <img
              src={user?.photoURL || '/avatar.png'}
              alt="user avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-700">
                <strong>{user?.displayName || 'You'}</strong> completed a task:{' '}
                <span className="underline">{todo.title}</span>
              </p>
              <p className="text-xs text-gray-500">
                {todo.completedAt ? formatTime(todo.completedAt) : ''}
              </p>
            </div>
            <div className="text-sm text-gray-500">📥 Inbox</div>
          </div>
        ))
      )}
    </div>
  );
}
