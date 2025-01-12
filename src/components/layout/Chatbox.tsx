'use client';

import { useAppContext } from '@/context/AppContext';
import { getConversationMessages } from '@/lib/services/conversation';
import { EChatMode } from '@/type';
import { Skeleton } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ChatModeButton } from '../buttons/ChatModeButton';
import { SilentChatMode } from '../silent-mode/SilentChatMode';
import { ChatInput } from './ChatInput';
import { Greeting } from './Greeting';
import { ListMessages } from './list-messages/ListMessage';
import { NavBar } from './Navbar';
import { Sidebar } from './sidebar/Sidebar';

export const Chatbox = () => {
  const { data: session } = useSession();
  const { chatMode, toggleChatMode, messages, setMessages, selectedChat } = useAppContext();

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
    <>
      <NavBar />

      <div style={{ display: 'flex' }}>
        {session && <Sidebar />}

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              margin: '0 auto',
              padding: '20px',
              height: 'calc(100vh - 56px)',
            }}
          >
            <div
              style={{
                flexGrow: 1,
                padding: '0 10px',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <div
                style={{
                  padding: '20px',
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flexGrow: 1,
                }}
              >
                {loading ? (
                  <Skeleton className="chatbox-center" paragraph />
                ) : !!messages?.length ? (
                  <ListMessages />
                ) : (
                  <>
                    {chatMode === EChatMode.Normal && <Greeting />}
                    {chatMode === EChatMode.Silent && <SilentChatMode />}

                    <ChatModeButton
                      currentMode={chatMode}
                      targetMode={EChatMode.Silent}
                      onClick={() => toggleChatMode(EChatMode.Silent)}
                      label="Silent Chat Mode 🧘‍♂️💬"
                    />

                    {chatMode !== EChatMode.Silent && (
                      <ChatModeButton
                        currentMode={chatMode}
                        targetMode={EChatMode.VR}
                        onClick={() => toggleChatMode(EChatMode.VR)}
                        label="VR Chat Mode 🕶️💬"
                      />
                    )}
                  </>
                )}
              </div>

              {chatMode === EChatMode.Normal && <ChatInput />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
