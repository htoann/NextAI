'use client';

import { useAppContext } from '@/context/AppContext';
import { createConversation } from '@/lib/services/conversation';
import { chat, geminiChat } from '@/lib/services/messages';
import { generateChatName } from '@/lib/utils';
import { TMessage } from '@/types';
import { SendOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export const ChatInput = () => {
  const { data: session } = useSession();
  const { setMessages, setSending, selectedChat, setSelectedChat, setIsAIResponding } = useAppContext();
  const [userMessage, setUserMessage] = useState('');

  const addMessage = (newMessage: TMessage) => {
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleAIResponse = async (message: string, chatId: string) => {
    try {
      const response = await geminiChat(message, chatId);
      const aiMessage = await response?.json();
      addMessage(aiMessage);
    } catch (error) {
      console.error('handleAIResponse error:', error);
    }
  };

  const handleSend = async (conversation: string) => {
    setIsAIResponding(true);

    const newMessage: TMessage = {
      owner: session?.user?.email || 'anonymous@gmail.com',
      content: userMessage,
      conversation,
    };

    addMessage(newMessage);
    setUserMessage('');

    try {
      await chat(newMessage);
      await handleAIResponse(userMessage, conversation);
    } catch (error) {
      console.error('Error during message handling:', error);
    } finally {
      setIsAIResponding(false);
    }
  };

  const sendMessage = async () => {
    setSending(true);
    try {
      const isNonSelectedChat = !selectedChat && session?.user?.email;

      if (isNonSelectedChat) {
        const conversation = await createConversation({
          user: session?.user?.email!,
          title: generateChatName(),
        });

        setSelectedChat(conversation);
        await handleSend(conversation._id!);
      } else {
        await handleSend(selectedChat?._id!);
      }
    } catch (error) {
      console.error('Error creating or sending message:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Row
      gutter={8}
      style={{
        padding: 15,
        backgroundColor: '#f4f4f4',
        zIndex: 1,
        width: '750px',
        margin: '0 auto',
        borderRadius: 20,
      }}
    >
      <Col span={20}>
        <Input
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onPressEnter={sendMessage}
          placeholder="Type your message..."
          style={{ width: '100%', height: 40, fontSize: 16 }}
          variant="borderless"
        />
      </Col>
      <Col span={4}>
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={sendMessage}
          disabled={!userMessage.trim()}
          style={{ width: '100%', height: 40 }}
        />
      </Col>
    </Row>
  );
};
