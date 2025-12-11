import RootLayout from '@/components/layout/RootLayout';
import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { cookieGet } from '@/lib/cookie';
import RootHead from './head';
export default function Layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const token = cookieGet(cookies(), 'token');

  return (
    <html lang="en">
      <RootHead />
      <body id="root">
        <RootLayout token={token}>{children}</RootLayout>
      </body>
    </html>
  );
}
