'use client';

import withTheme from '@/theme';
import { ReactNode } from 'react';
import { ChatInput } from '../chat-input';
import { Sidebar } from './sidebar';

export const ChatLayout = ({ children }: { children: ReactNode }) => {
  return withTheme(
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            height: 'calc(100vh - 40px)',
          }}
        >
          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '0 10px' }}>{children}</div>
          <ChatInput />
        </div>
      </div>
    </div>,
  );
};
