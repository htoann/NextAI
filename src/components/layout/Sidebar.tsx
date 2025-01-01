'use client';

import { useAppContext } from '@/context/AppContext';
import { generateChatName } from '@/lib/utils';
import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, List, Menu, message, Popconfirm } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Sidebar: React.FC = () => {
  const router = useRouter();
  const { chatId } = useParams() as { chatId: string };

  const [newConversation, setNewConversation] = useState<string>('');
  const { setMessages, conversations, setConversations } = useAppContext();

  const handleCreateConversation = () => {
    let conversationName = newConversation.trim();

    if (!conversationName) {
      conversationName = generateChatName();
      setNewConversation(conversationName);
    }

    if (conversations.includes(conversationName)) {
      message.error('Conversation name already exists!');
      return;
    }

    setConversations((prevConversations) => [conversationName, ...prevConversations]);

    setMessages((prevMessages) => ({
      ...prevMessages,
      [conversationName]: [],
    }));

    setNewConversation('');
  };

  const handleSelectConversation = (conversation: string) => {
    router.push(`/chat/${conversation}`);
  };

  const handleDeleteConversation = (conversation: string) => {
    setConversations((prevConversations) => prevConversations.filter((item) => item !== conversation));

    setMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      delete newMessages[conversation];
      return newMessages;
    });

    message.success('Conversation deleted');
    router.push('/');
  };

  const menu = (conversation: string) => (
    <Menu>
      <Menu.Item>
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => handleDeleteConversation(conversation)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>
            Delete
          </Button>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{
        width: '250px',
        borderRight: '1px solid #ccc',
        padding: '20px',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ marginBottom: 15, color: '#8231D3' }}>Conversations</h3>
      <Input
        value={newConversation}
        onChange={(e) => setNewConversation(e.target.value)}
        placeholder="New conversation"
        onPressEnter={handleCreateConversation}
        style={{
          marginBottom: 10,
        }}
      />
      <Button
        type="primary"
        onClick={handleCreateConversation}
        style={{
          marginBottom: 30,
          width: '100%',
        }}
      >
        Create
      </Button>
      <List
        size="small"
        dataSource={conversations}
        renderItem={(item) => (
          <List.Item
            onClick={() => handleSelectConversation(item)}
            style={{
              cursor: 'pointer',
              backgroundColor: item === chatId ? '#e6f7ff' : 'transparent',
              fontWeight: item === chatId ? 'bold' : 'normal',
              padding: '10px 15px',
              borderRadius: '8px',
              marginBottom: '8px',
              transition: 'background-color 0.2s ease, transform 0.1s ease',
              border: 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = item === chatId ? '#e6f7ff' : '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = item === chatId ? '#e6f7ff' : 'transparent')}
          >
            <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span>
            <Dropdown overlay={menu(item)} trigger={['click']} placement="bottomRight">
              <EllipsisOutlined style={{ fontSize: '20px', marginLeft: '10px' }} />
            </Dropdown>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Sidebar;
