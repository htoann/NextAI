'use client';
import { Card, Typography } from 'antd';
import { useState } from 'react';
import ExpressionDetector from './ExpressionDetector';

const { Title } = Typography;

const SilentChatMode = () => {
  const [expression, setExpression] = useState('');

  const handleExpression = (expression: string) => {
    setExpression(`🤖 AI: You look ${expression}!`);
  };

  return (
    <Card
      title={<Title level={3}>Silent Chat Mode 🧘‍♂️💬</Title>}
      bordered
      style={{ maxWidth: 600, margin: '20px auto', padding: '20px' }}
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
      </>
    </Card>
  );
};

export default SilentChatMode;
