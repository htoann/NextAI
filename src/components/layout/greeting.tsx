'use client';

import { Typography } from 'antd';

const { Title, Text } = Typography;

export const Greeting = () => {
  return (
    <>
      <Title level={1} style={{ marginBottom: '20px', color: '#1890ff' }}>
        Welcome to Next.js 15 Gemini
      </Title>
      <Text style={{ fontSize: '18px', marginBottom: '20px' }}>What can I help with today?</Text>
    </>
  );
};
