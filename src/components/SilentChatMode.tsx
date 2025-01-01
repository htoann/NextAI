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
          onExpressionDetected={(expression: string) => {
            handleExpression(expression);
          }}
        />

        <div
          style={{
            marginTop: 20,
            height: 100,
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f7f7f7',
            padding: '15px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p
            style={{
              marginBottom: '12px',
              fontSize: '14px',
              lineHeight: '1.6',
              fontWeight: '500',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: expression.includes('You look') ? '#d3e1ff' : '#fff',
              borderRadius: '12px',
              padding: '10px',
              maxWidth: '80%',
              transition: 'transform 0.3s ease, background-color 0.3s ease',
            }}
          >
            {expression}
          </p>
        </div>
      </>
    </Card>
  );
};

export default SilentChatMode;
