import { AppProvider } from '@/context/AppContext';
import { ChatProvider } from '@/hooks/useChat';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import './globals.scss';

export const metadata = {
  title: 'Next.js 15 Gemini AI',
  description: 'Chat with Gemini AI',
};

export default async function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AntdRegistry>
          <AppProvider>
            <ChatProvider>{children}</ChatProvider>
          </AppProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
