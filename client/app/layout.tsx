import type { Metadata } from 'next';
import { Newsreader, Public_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';
import ApolloWrapper from '@/components/ApolloWrapper';
import { AuthProvider } from '@/context/AuthContext';
import { CreateModalProvider } from '@/context/CreateModalContext';
import NavBar from '@/components/NavBar';
import CreateModal from '@/components/CreateModal';

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  display: 'swap',
});

const publicSans = Public_Sans({
  variable: '--font-public-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Noema — A forum for ideas worth keeping',
  description: 'A quiet place to think in public.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${publicSans.variable} ${geistMono.variable}`}>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ApolloWrapper>
          <AuthProvider>
            <CreateModalProvider>
              <NavBar />
              <main style={{ flex: 1, maxWidth: 'var(--maxw)', margin: '0 auto', width: '100%', padding: '32px 24px 80px' }}>
                {children}
              </main>
              <CreateModal />
            </CreateModalProvider>
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
