import '../styles/globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { TodoProvider } from '@/context/TodoContext';
import ClientWrapper from '@/app/client-wrapper'; // ✅ use this

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0D1321]`}>
        <AuthProvider>
          <TodoProvider>
            <ClientWrapper>{children}</ClientWrapper> {/* ✅ wrap with this */}
          </TodoProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
