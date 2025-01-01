'use client';

import { ChatInput } from '@/components/layout/chat-input';
import { ChatLayout } from '@/components/layout/chat-layout';
import { Greeting } from '@/components/layout/greeting';
import SilentChatMode from '@/components/SilentChatMode';
import { Button } from 'antd';
import { useState } from 'react';

export default function Home() {
  const [isSilentChatMode, setIsSilentChatMode] = useState(false);

  return (
    <ChatLayout>
      <div
        style={{
          padding: '20px',
          textAlign: 'center',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          flexGrow: 1,
        }}
      >
        <>
          {!isSilentChatMode && <Greeting />}

          {isSilentChatMode && <SilentChatMode />}

          <Button
            type="primary"
            size="large"
            style={{ width: 'fit-content', margin: '0 auto' }}
            onClick={() => setIsSilentChatMode(!isSilentChatMode)}
          >
            {isSilentChatMode ? 'Exit Silent Chat Mode 🧘‍♂️💬' : 'Enter Silent Chat Mode 🧘‍♂️💬'}
          </Button>
        </>
      </div>

      {!isSilentChatMode && <ChatInput />}
    </ChatLayout>
  );
}
