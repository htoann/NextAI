'use client';

import { AppProvider } from '@/context/AppContext';
import { metadata } from '@/lib/metadata';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import { SessionProvider } from 'next-auth/react';
import './globals.scss';
import { ConfigProvider } from 'antd';
import { theme } from '@/lib/theme';

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>
      </head>
      <body>
        <AntdRegistry>
          <SessionProvider>
            <AppProvider>
              <ConfigProvider theme={theme}>{children}</ConfigProvider>
            </AppProvider>
          </SessionProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
