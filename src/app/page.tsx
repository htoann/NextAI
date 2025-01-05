'use client';

import { ChatModeButton } from '@/components/ChatModeButton';
import { ChatInput } from '@/components/layout/chat-input';
import { ChatLayout } from '@/components/layout/chat-layout';
import { Greeting } from '@/components/layout/greeting';
import { SilentChatMode } from '@/components/silent-mode/SilentChatMode';
import { ChatMode } from '@/type';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { useState } from 'react';
import { Experience } from './../components/vr-chat/components/Experience';
import { UI } from './../components/vr-chat/components/UI';

export default function Home() {
  const [chatMode, setChatMode] = useState(ChatMode.Normal);

  const toggleChatMode = (mode: ChatMode) => {
    setChatMode(chatMode === mode ? ChatMode.Normal : mode);
  };

  return (
    <>
      {chatMode === ChatMode.VR ? (
        <>
          <Leva hidden={false} />
          <UI hidden={false} />
          {/* <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
            <Experience />
          </Canvas> */}
          <Canvas
            shadows
            camera={{ position: [0, 0, 5], fov: 40 }}
            style={{ width: '100%', height: '100vh', position: 'absolute' }}
          >
            <Experience />
          </Canvas>
        </>
      ) : (
        <ChatLayout>
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
            {chatMode === ChatMode.Normal && <Greeting />}
            {chatMode === ChatMode.Silent && <SilentChatMode />}

            <ChatModeButton
              currentMode={chatMode}
              targetMode={ChatMode.Silent}
              onClick={() => toggleChatMode(ChatMode.Silent)}
              label="Silent Chat Mode 🧘‍♂️💬"
            />

            {chatMode !== ChatMode.Silent && (
              <ChatModeButton
                currentMode={chatMode}
                targetMode={ChatMode.VR}
                onClick={() => toggleChatMode(ChatMode.VR)}
                label="VR Chat Mode 🕶️💬"
              />
            )}
          </div>

          {chatMode === ChatMode.Normal && <ChatInput />}
        </ChatLayout>
      )}
    </>
  );
}
