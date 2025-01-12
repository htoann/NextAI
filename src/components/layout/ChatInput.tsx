'use client';

import { useAppContext } from '@/context/AppContext';
import { generateChatName } from '@/lib/utils';
import { TMessage } from '@/type';
import { SendOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const ChatInput = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { setMessages, setSending, selectedChat } = useAppContext();

  const [userMessage, setUserMessage] = useState<string>('');

  const handleAddMessage = (newMessage: TMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleUpdateLastMessage = (updatedMessage: TMessage) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.conversation === updatedMessage.conversation && msg.owner === 'AI' ? updatedMessage : msg,
      ),
    );
  };

  const handleSend = async (chatName: string, newChatId: string) => {
    if (!userMessage.trim()) return;

    if (!selectedChat) {
      // setChats((prevChats) => [chatName, ...prevChats]);
    }

    const newUserMessage: TMessage = {
      owner: session?.user?.email || 'unknown',
      content: userMessage,
      conversation: newChatId,
    };

    handleAddMessage(newUserMessage);
    setUserMessage('');

    try {
      if (session) {
        await axios.post('/api/messages', newUserMessage);
      }

      const response = await axios.post(
        '/api/gemini',
        {
          message: userMessage,
          conversation: newChatId,
        },
        {
          responseType: 'stream',
        },
      );

      console.log('response', response);

      const reader = response.data.getReader();
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

        console.log(value);

        handleUpdateLastMessage({ ...aiMessage, content: value });
      }

      handleUpdateLastMessage({ ...aiMessage, content: value });
    } catch (error) {
      console.error('Error during message handling:', error);
    }
  };

  const sendMessage = async () => {
    setSending(true);
    let chatName = selectedChat?.title;
    let newChatId = selectedChat?.title;

    if (!chatName) {
      chatName = generateChatName();

      try {
        const response = await axios.post('/api/conversations', {
          user: session?.user?.email,
          title: chatName,
        });

        newChatId = response.data._id;

        router.push(`/chat/${newChatId}`);
      } catch (error) {
        console.error('Error creating conversation:', error);
        setSending(false);
        return;
      }
    }

    await handleSend(chatName, newChatId!);
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
