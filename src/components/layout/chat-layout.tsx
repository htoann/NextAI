'use client';

import withTheme from '@/theme';
import { ReactNode } from 'react';
import { Sidebar } from './sidebar/sidebar';

export const ChatLayout = ({ children }: { children: ReactNode }) => {
  return withTheme(
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: '0 auto',
            padding: '20px',
            height: '100vh',
          }}
        >
          <div
            style={{
              flexGrow: 1,
              padding: '0 10px',
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>,
  );
};
