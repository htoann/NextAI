'use client';

import { useAppContext } from '@/context/AppContext';
import { getConversationMessages } from '@/lib/services/conversation';
import { EChatMode } from '@/types';
import { Flex, Skeleton } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ChatInput } from '../ChatInput';
import { ListMessages } from '../list-messages/ListMessage';
import { NavBar } from '../Navbar';
import { Sidebar } from '../sidebar/Sidebar';
import './Chatbox.scss';
import { Welcome } from './Welcome';

export const Chatbox = () => {
  const { data: session } = useSession();
  const { chatMode, messages, setMessages, selectedChat } = useAppContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      setLoading(true);
      const messages = await getConversationMessages(selectedChat._id!);
      setMessages(messages);
      setLoading(false);
    };

    fetchMessages();
  }, [selectedChat]);

  return (
    <div className="chatbox">
      <NavBar />
      <Flex style={{ marginTop: 56 }}>
        {session && <Sidebar />}
        <div style={{ flex: 1 }}>
          <>
            {loading ? (
              <Skeleton paragraph className="skeleton" />
            ) : !!messages?.length ? (
              <ListMessages />
            ) : (
              <Welcome />
            )}
          </>
          {chatMode === EChatMode.Normal && <ChatInput />}
        </div>
      </Flex>
    </div>
  );
};
