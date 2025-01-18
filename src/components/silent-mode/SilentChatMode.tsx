'use client';

import { useAppContext } from '@/context/AppContext';
import { getEmojiForExpression } from '@/lib/utils';
import { EChatMode } from '@/type';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Typography } from 'antd';
import { useState } from 'react';
import ExpressionDetector from './ExpressionDetector';
import ExpressionHistory from './ExpressionHistory';

const { Title } = Typography;

export const SilentChatMode = () => {
  const { toggleChatMode } = useAppContext();
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<{ expression: string; timestamp: string }[]>([]);

  const handleExpression = (expression: string) => {
    const emoji = getEmojiForExpression(expression);
    setExpression(`🤖 AI: You look ${expression} ${emoji}`);

    setHistory((prev) => [
      ...prev,
      { expression: `${expression} ${emoji}`, timestamp: new Date().toLocaleTimeString() },
    ]);
  };

  return (
    <Card
      title={
        <Flex style={{ alignItems: 'center', gap: 20 }}>
          <Button type="primary" onClick={() => toggleChatMode(EChatMode.Silent)} icon={<ArrowLeftOutlined />}>
            Back
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            Silent Chat Mode 🧘‍♂️💬
          </Title>
        </Flex>
      }
      bordered
      style={{ maxWidth: 600, margin: '10px auto', padding: '10px', paddingBottom: 0 }}
    >
      <ExpressionDetector
        onExpressionDetected={(expression) => {
          handleExpression(expression);
        }}
      />
      <div
        style={{
          marginBottom: '12px',
          fontSize: '16px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: expression.includes('You look') ? '#d3e1ff' : '#fff',
          borderRadius: '12px',
          padding: '10px',
        }}
      >
        {expression}
      </div>
      <ExpressionHistory history={history} />
    </Card>
  );
};
