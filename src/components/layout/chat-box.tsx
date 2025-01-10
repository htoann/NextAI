'use client';

import { useAppContext } from '@/context/AppContext';
import withTheme from '@/theme';
import { EChatMode } from '@/type';
import { useParams } from 'next/navigation';
import { ChatModeButton } from '../buttons/ChatModeButton';
import { SilentChatMode } from '../silent-mode/SilentChatMode';
import { ChatInput } from './chat-input';
import { Greeting } from './greeting';
import { ListMessages } from './list-messages/ListMessage';
import { Sidebar } from './sidebar/sidebar';

export const Chatbox = () => {
  const { chatId } = useParams() as { chatId: string };
  const { chatMode, toggleChatMode, messages } = useAppContext();

  return withTheme(
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            margin: '0 auto',
            padding: '20px',
            height: '100vh',
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
              {!!messages[chatId]?.length ? (
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
    </div>,
  );
};
