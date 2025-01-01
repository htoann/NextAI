'use client';

import { ChatLayout } from '@/components/layout/chat-layout';
import { Typography } from 'antd';

const { Title, Text } = Typography;

export default function Home() {
  return (
    <ChatLayout>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Title level={1} style={{ marginBottom: '20px', color: '#1890ff' }}>
          Welcome to the Chat With AI
        </Title>
        <Text style={{ fontSize: '18px', marginBottom: '20px' }}>What can I help with today?</Text>
      </div>
    </ChatLayout>
  );
}
