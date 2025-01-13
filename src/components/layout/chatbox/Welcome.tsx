import { ChatModeButton } from '@/components/buttons/ChatModeButton';
import { SilentChatMode } from '@/components/silent-mode/SilentChatMode';
import { useAppContext } from '@/context/AppContext';
import { EChatMode } from '@/type';
import { Greeting } from '../Greeting';

export const Welcome = () => {
  const { chatMode, toggleChatMode } = useAppContext();

  return (
    <div className="welcome">
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
    </div>
  );
};
