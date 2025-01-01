'use client';

import { Button, Typography } from 'antd';
import { useState } from 'react';
import SilentChatMode from '../SilentChatMode';

const { Title, Text } = Typography;

export const Greeting = () => {
  const [isSilentChatMode, setIsSilentChatMode] = useState(false);

  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {!isSilentChatMode && (
        <>
          <Title level={1} style={{ marginBottom: '20px', color: '#1890ff' }}>
            Welcome to Next.js 15 Gemini
          </Title>
          <Text style={{ fontSize: '18px', marginBottom: '20px' }}>What can I help with today?</Text>

          <Button
            type="primary"
            size="large"
            style={{ width: 'fit-content', margin: '0 auto' }}
            onClick={() => setIsSilentChatMode(true)}
          >
            Open Silent Chat Mode 🧘‍♂️💬
          </Button>
        </>
      )}

      {isSilentChatMode && <SilentChatMode />}
    </div>
  );
};
