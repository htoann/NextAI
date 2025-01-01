'use client';

import { Greeting } from '@/components/greeting';
import { ChatLayout } from '@/components/layout/chat-layout';
import { ListMessages } from '@/components/list-messages';
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
    </ChatLayout>
  );
};

export default Chatbox;
