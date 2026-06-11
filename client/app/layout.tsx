import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import ApolloWrapper from '@/components/ApolloWrapper';
import { AuthProvider } from '@/context/AuthContext';
import NavBar from '@/components/NavBar';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Super Forum',
  description: 'A community forum',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-100 antialiased">
        <ApolloWrapper>
          <AuthProvider>
            <NavBar />
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">{children}</main>
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
