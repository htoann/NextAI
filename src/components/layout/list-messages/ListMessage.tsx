'use client';

import { useAppContext } from '@/context/AppContext';
import { sanitizeMessage } from '@/lib/utils';
import { TMessage } from '@/types';
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
                  color: message.owner === 'AI' ? '#272626ff' : '#fff',
                  padding: '5px 15px',
                  borderRadius: '10px',
                  maxWidth: '70%',
                  fontSize: '16px',
                }}
              >
                {message.metadata?.type === 'image' ? (
                  <img src={message.content} alt="AI generated" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                ) : (
                  <Markdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#1677ff', textDecoration: 'underline' }}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p
                          {...props}
                          style={{
                            textAlign: 'left',
                          }}
                        />
                      ),
                    }}
                  >
                    {sanitizeMessage(message.content)}
                  </Markdown>
                )}
              </div>
            </List.Item>
          )}
        />

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
