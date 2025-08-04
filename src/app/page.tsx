'use client';

import { Chatbox } from '@/components/layout/chatbox/Chatbox';
import { useAppContext } from '@/context/AppContext';
import { EChatMode } from '@/types';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { useSession } from 'next-auth/react';
import { Experience } from './../components/vr-chat/components/Experience';
import { UI } from './../components/vr-chat/components/UI';
import Loading from './loading';

export default function Home() {
  const { chatMode } = useAppContext();
  const { status } = useSession();

  if (status === 'loading') {
    return <Loading />;
  }

  return (
    <>
      {chatMode === EChatMode.VR ? (
        <>
          <Leva />
          <UI />
          <Canvas
            shadows
            camera={{ position: [0, 0, 5], fov: 40 }}
            style={{ width: '100%', height: '100vh', position: 'absolute' }}
          >
            <Experience />
          </Canvas>
        </>
      ) : (
        <Chatbox />
      )}
    </>
  );
}
