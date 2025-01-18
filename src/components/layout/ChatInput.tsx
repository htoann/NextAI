'use client';

import { useAppContext } from '@/context/AppContext';
import { createConversation } from '@/lib/services/conversation';
import { chat } from '@/lib/services/messages';
import { generateChatName } from '@/lib/utils';
import { TMessage } from '@/type';
import { SendOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export const ChatInput = () => {
  const { data: session } = useSession();
  const { setMessages, setSending, selectedChat, setSelectedChat } = useAppContext();

  const [userMessage, setUserMessage] = useState<string>('');

  const handleAddMessage = (newMessage: TMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleUpdateLastMessage = (updatedMessage: TMessage) => {
    setMessages((prevMessages) => {
      if (prevMessages.length > 0) {
        const updatedMessages = [...prevMessages];
        updatedMessages[prevMessages.length - 1] = { ...updatedMessages[prevMessages.length - 1], ...updatedMessage };
        return updatedMessages;
      }
      return prevMessages;
    });
  };

  const processChatStream = async (userMessage: string, newChatId: string) => {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            content: userMessage,
            conversation: newChatId,
          },
        }),
      });

      if (!response.body) {
        return;
      }

      const reader = response.body.getReader();

      const decoder = new TextDecoder();
      let done = false;
      let value = '';

      const aiMessage: TMessage = {
        owner: 'AI',
        content: '',
        conversation: newChatId,
      };

      handleAddMessage(aiMessage);

      while (!done) {
        const { done: isDone, value: chunk } = await reader.read();
        done = isDone;
        value += decoder.decode(chunk, { stream: true });

        handleUpdateLastMessage({ ...aiMessage, content: value });
      }

      handleUpdateLastMessage({ ...aiMessage, content: value });
    } catch (error) {
      console.error('Error in processChatStream:', error);
    }
  };

  const handleSend = async (conversationId: string) => {
    if (!userMessage.trim()) return;

    // For case anonymous
    // if (!selectedChat) {
    //   setChats((prevChats) => [chatName, ...prevChats]);
    // }

    const newUserMessage: TMessage = {
      owner: session?.user?.email || 'unknown',
      content: userMessage,
      conversation: conversationId,
    };

    handleAddMessage(newUserMessage);
    setUserMessage('');

    try {
      if (session) {
        await chat(newUserMessage);
      }

      processChatStream(userMessage, selectedChat?._id!);
    } catch (error) {
      console.error('Error during message handling:', error);
    }
  };

  const sendMessage = async () => {
    setSending(true);

    if (!selectedChat && session?.user?.email) {
      const chatName = generateChatName();

      try {
        const conversation = await createConversation({
          user: session.user.email,
          title: chatName,
        });

        setSelectedChat(conversation);

        await handleSend(conversation._id!);
      } catch (error) {
        console.error('Error creating conversation:', error);
        setSending(false);
        return;
      }
    } else {
      await handleSend(selectedChat?._id!);
    }

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
