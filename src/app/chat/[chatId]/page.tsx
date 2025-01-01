'use client';

import { ChatInput } from '@/components/layout/chat-input';
import { ChatLayout } from '@/components/layout/chat-layout';
import { Greeting } from '@/components/layout/greeting';
import { ListMessages } from '@/components/layout/list-messages';
import { useAppContext } from '@/context/AppContext';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const Chatbox = () => {
  const router = useRouter();
  const { chatId } = useParams() as { chatId: string };
  const { messages, loading } = useAppContext();

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!loading && !messages[chatId]) {
      router.push('/');
    }
  });

  return (
    <ChatLayout>
      {!!messages[chatId]?.length ? <ListMessages /> : <Greeting />}
      <div ref={chatEndRef} />

      <ChatInput />
    </ChatLayout>
  );
};

export default Chatbox;
