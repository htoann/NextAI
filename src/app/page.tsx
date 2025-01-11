'use client';

import { Chatbox } from '@/components/layout/chat-box';
import { useAppContext } from '@/context/AppContext';
import { EChatMode } from '@/type';
import { Canvas } from '@react-three/fiber';
import { Leva } from 'leva';
import { Experience } from './../components/vr-chat/components/Experience';
import { UI } from './../components/vr-chat/components/UI';

export default function Home() {
  const { chatMode } = useAppContext();
  // const router = useRouter();
  // const { data: session, status } = useSession();

  // if (status === 'loading') {
  //   return <Spin fullscreen percent="auto" />;
  // }

  // if (!session) {
  //   return router.push('/auth/login');
  // }

  return (
    <>
      {chatMode === EChatMode.VR ? (
        <>
          <Leva hidden={false} />
          <UI hidden={false} />
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
