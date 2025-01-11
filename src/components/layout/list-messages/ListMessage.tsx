'use client';

import { useAppContext } from '@/context/AppContext';
import { TMessage } from '@/type';
import { List } from 'antd';
import { useParams } from 'next/navigation';
import Markdown from 'react-markdown';
import './ListMessage.scss';

export const ListMessages = () => {
  const { chatId } = useParams() as { chatId: string };
  const { messages } = useAppContext();

  return (
    <div className="list-message">
      <List
        dataSource={messages[chatId]}
        renderItem={(message: TMessage) => (
          <List.Item
            style={{
              textAlign: message.type === 'user' ? 'right' : 'left',
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              padding: '5px 0',
              border: 'none',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                backgroundColor: message.type === 'user' ? '#1890ff' : '#f0f0f0',
                color: message.type === 'user' ? '#fff' : '#000',
                padding: '5px 15px',
                borderRadius: '10px',
                maxWidth: '70%',
                fontSize: '16px',
              }}
            >
              <Markdown>{message.text}</Markdown>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};
