import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SidebarProvider } from '@/components/sidebar-provider';
import { SidebarContextProvider } from '@/components/sidebar-context';
import { QueryProvider } from '@/components/query-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LiderHub – Agentes de IA totalmente humanizados',
  description: 'Topzera',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      >
        <QueryProvider>
          <SidebarContextProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </SidebarContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
