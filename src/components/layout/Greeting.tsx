'use client';

import { Typography } from 'antd';

const { Title, Text } = Typography;

const Marquee = 'marquee' as any;

export const Greeting = () => {
  return (
    <>
      <Title level={1} style={{ marginBottom: '20px', color: '#1890ff' }}>
        <Marquee>Welcome to Next.js 15 Gemini</Marquee>
      </Title>
      <Text style={{ fontSize: '18px', marginBottom: '20px' }}>
        <Marquee direction="down" width="400" height="200" behavior="alternate">
          <Marquee behavior="alternate">What can I help with today?</Marquee>
        </Marquee>
      </Text>
    </>
  );
};
