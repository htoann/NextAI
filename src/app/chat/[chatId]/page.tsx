'use client';

import { Chatbox } from '@/components/layout/chat-box';
import { useAppContext } from '@/context/AppContext';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const ChatDetail = () => {
  const router = useRouter();
  const { chatId } = useParams() as { chatId: string };
  const { messages, sending } = useAppContext();

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!!messages?.length && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (!sending && !messages[chatId]) {
      router.push('/');
    }
  });

  return <Chatbox />;
};

export default ChatDetail;
