'use client';

import { useAppContext } from '@/context/AppContext';
import { List } from 'antd';
import { useParams } from 'next/navigation';

export const ListMessages = () => {
  const { chatId } = useParams() as { chatId: string };
  const { messages } = useAppContext();

  return (
    <List
      dataSource={messages[chatId]}
      renderItem={(item) => (
        <List.Item
          style={{
            textAlign: item.type === 'user' ? 'right' : 'left',
            display: 'flex',
            justifyContent: item.type === 'user' ? 'flex-end' : 'flex-start',
            padding: '5px 0',
            border: 'none',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              backgroundColor: item.type === 'user' ? '#1890ff' : '#f0f0f0',
              color: item.type === 'user' ? '#fff' : '#000',
              padding: '10px',
              borderRadius: '10px',
              maxWidth: '70%',
              fontSize: '16px',
            }}
          >
            {item.text}
          </div>
        </List.Item>
      )}
    />
  );
};
