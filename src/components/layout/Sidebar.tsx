// src/components/layout/Sidebar.tsx
'use client';

import { useAppContext } from '@/context/AppContext';
import { generateChatName } from '@/lib/utils';
import { Button, Input, List, message } from 'antd';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Sidebar: React.FC = () => {
  const [newConversation, setNewConversation] = useState<string>('');
  const { setMessages, conversations, setConversations } = useAppContext();
  const router = useRouter();

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
      <h3 style={{ marginBottom: 15 }}>Conversations</h3>
      <Input
        value={newConversation}
        onChange={(e) => setNewConversation(e.target.value)}
        placeholder="New conversation"
        onPressEnter={handleCreateConversation}
        style={{ marginBottom: 10 }}
      />
      <Button type="primary" onClick={handleCreateConversation} style={{ marginBottom: 20, width: '100%' }}>
        Create
      </Button>
      <List
        size="small"
        bordered
        dataSource={conversations}
        renderItem={(item) => (
          <List.Item onClick={() => handleSelectConversation(item)} style={{ cursor: 'pointer' }}>
            {item}
          </List.Item>
        )}
      />
    </div>
  );
};

export default Sidebar;
