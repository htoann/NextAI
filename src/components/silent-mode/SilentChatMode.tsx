'use client';
import { getEmojiForExpression } from '@/lib/utils';
import { Card, Typography } from 'antd';
import { useState } from 'react';
import ExpressionDetector from './ExpressionDetector';
import ExpressionHistory from './ExpressionHistory';

const { Title } = Typography;

export const SilentChatMode = () => {
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
      title={<Title level={3}>Silent Chat Mode 🧘‍♂️💬</Title>}
      bordered
      style={{ maxWidth: 600, margin: '20px auto', padding: '20px', paddingBottom: 0 }}
    >
      <>
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
      </>
    </Card>
  );
};
