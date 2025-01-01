'use client';

import { Typography } from 'antd';

const { Title, Text } = Typography;

export const Greeting = () => {
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
      <Title level={1} style={{ marginBottom: '20px', color: '#1890ff' }}>
        Welcome to the Chat With AI
      </Title>
      <Text style={{ fontSize: '18px', marginBottom: '20px' }}>What can I help with today?</Text>
    </div>
  );
};
