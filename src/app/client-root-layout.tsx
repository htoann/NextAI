'use client';

import { AppProvider } from '@/context/AppContext';
import { metadata, theme } from '@/lib/utils';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd';
import { SessionProvider } from 'next-auth/react';
import Script from 'next/script';
import { chatboxSnippet } from './(main)/settings/const';
import './globals.scss';

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
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

        <Script id="chatbox-widget" strategy="afterInteractive">
          {chatboxSnippet}
        </Script>
      </body>
    </html>
  );
}
