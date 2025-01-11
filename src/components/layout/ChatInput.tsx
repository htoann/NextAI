'use client';

import { useAppContext } from '@/context/AppContext';
import { generateChatName } from '@/lib/utils';
import { TMessage } from '@/type';
import { SendOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export const ChatInput = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { chatId } = useParams() as { chatId: string };
  const { setMessages, setSending, setChats } = useAppContext();

  const [userMessage, setUserMessage] = useState<string>('');

  const handleUpdateLastMessage = (chatName: string, message: TMessage) => {
    setMessages((prevMessages) => {
      const chatMessages = prevMessages[chatName] || [];
      const updatedMessages = [...chatMessages];
      updatedMessages[updatedMessages.length - 1] = message;
      return {
        ...prevMessages,
        [chatName]: updatedMessages,
      };
    });
  };

  const handleSetMessages = (chatName: string, message: TMessage) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [chatName]: [...(prevMessages[chatName] || []), message],
    }));
  };

  const handleSend = async (chatName: string) => {
    if (!userMessage.trim()) return;

    if (!chatId) {
      setChats((prevChats) => [chatName, ...prevChats]);
    }

    const newUserMessage: TMessage = { type: 'user', text: userMessage };
    handleSetMessages(chatName, newUserMessage);

    setUserMessage('');

    if (session) {
      try {
        await axios.post('/api/messages', {
          owner: session.user?.email,
          content: userMessage,
          conversation: chatName,
          metadata: {},
        });
      } catch (error) {
        console.error('Error saving message to database:', error);
      }
    }

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.body) {
        console.error('No response body from AI');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let value = '';

      const aiMessage: TMessage = { type: 'ai', text: '' };
      handleSetMessages(chatName, aiMessage);

      while (!done) {
        const { done: isDone, value: chunk } = await reader.read();
        done = isDone;
        value += decoder.decode(chunk, { stream: true });

        handleUpdateLastMessage(chatName, { ...aiMessage, text: value });
      }

      handleUpdateLastMessage(chatName, { ...aiMessage, text: value });
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
  };

  const sendMessage = async () => {
    setSending(true);
    let chatName = chatId;

    if (!chatName) {
      chatName = generateChatName();

      const response = await axios.post('/api/conversations', {
        user: session?.user?.email,
        title: chatName,
      });

      router.push(`/chat/${response.data._id}`);
    }

    await handleSend(chatName);
    setSending(false);
  };

  const handlePressEnter = () => {
    sendMessage();
  };

  return (
    <Row
      gutter={8}
      style={{
        padding: 15,
        position: 'sticky',
        bottom: 0,
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
          onPressEnter={handlePressEnter}
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
