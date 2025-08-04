import { SilentChatMode } from '@/components/silent-mode/SilentChatMode';
import { useAppContext } from '@/context/AppContext';
import { EChatMode } from '@/types';
import { Button } from 'antd';
import { Greeting } from '../Greeting';

export const Welcome = () => {
  const { chatMode, toggleChatMode } = useAppContext();

  return (
    <>
      {chatMode === EChatMode.Silent && <SilentChatMode />}

      {chatMode === EChatMode.Normal && (
        <>
          <div className="welcome">
            {chatMode === EChatMode.Normal && (
              <>
                <Greeting />
                <Button
                  type="primary"
                  size="large"
                  style={{ width: 'fit-content', margin: '10px auto' }}
                  onClick={() => toggleChatMode(EChatMode.Silent)}
                >
                  Enter Silent Chat Mode 🧘‍♂️💬
                </Button>

                <Button
                  type="primary"
                  size="large"
                  style={{ width: 'fit-content', margin: '10px auto' }}
                  onClick={() => toggleChatMode(EChatMode.VR)}
                >
                  Enter VR Chat Mode 🕶️💬
                </Button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};
