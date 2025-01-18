'use client';

import { useAppContext } from '@/context/AppContext';
import { TMessage } from '@/type';
import { List } from 'antd';
import { useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import './ListMessage.scss';

export const ListMessages = () => {
  const { messages } = useAppContext();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!!messages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="list-message">
      <div style={{ width: 700, margin: '0 auto' }}>
        <List
          dataSource={messages}
          renderItem={(message: TMessage) => (
            <List.Item
              style={{
                textAlign: message.owner === 'AI' ? 'left' : 'right',
                display: 'flex',
                justifyContent: message.owner === 'AI' ? 'flex-start' : 'flex-end',
                padding: '5px 0',
                border: 'none',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: message.owner === 'AI' ? '#f0f0f0' : '#1890ff',
                  color: message.owner === 'AI' ? '#000' : '#fff',
                  padding: '5px 15px',
                  borderRadius: '10px',
                  maxWidth: '70%',
                  fontSize: '16px',
                }}
              >
                <Markdown>{message.content}</Markdown>
              </div>
            </List.Item>
          )}
        />

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
