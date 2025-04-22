'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, login, logout } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login();
      router.push('/'); // ✅ redirect after login
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  // If user is already logged in, redirect
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to Checked-Off</h1>
      {user ? (
        <>
          <p className="mb-4">Logged in as {user.displayName}</p>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 text-white rounded">
            Logout
          </button>
        </>
      ) : (
        <button onClick={handleLogin} className="bg-blue-500 px-4 py-2 text-white rounded">
          Login with GitHub
        </button>
      )}
    </div>
  );
}
