'use client';
import { List, Typography } from 'antd';
import { useEffect, useRef } from 'react';

const { Text } = Typography;

interface HistoryProps {
  history: { expression: string; timestamp: string }[];
}

const ExpressionHistory = ({ history }: HistoryProps) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <div style={{ marginTop: '20px' }}>
      <Text strong style={{ fontSize: '16px' }}>
        🕒 Expression History
      </Text>
      <div
        ref={listRef}
        style={{
          marginTop: '10px',
          overflowY: 'auto',
          height: 100,
          border: '1px solid #ddd',
          borderRadius: '4px',
        }}
      >
        <List
          size="small"
          dataSource={history}
          renderItem={(item) => (
            <List.Item>
              <Text>
                {item.timestamp} — {item.expression}
              </Text>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default ExpressionHistory;
