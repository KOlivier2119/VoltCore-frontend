import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import { ToastProvider } from './components/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'VoltCore Banking',
  description: 'Modern banking application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="container mx-auto p-4">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}