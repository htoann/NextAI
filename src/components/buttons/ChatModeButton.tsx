import { EChatMode } from '@/type';
import { Button } from 'antd';

export const ChatModeButton = ({
  currentMode,
  targetMode,
  onClick,
  label,
}: {
  currentMode: EChatMode;
  targetMode: EChatMode;
  onClick: () => void;
  label: string;
}) => (
  <Button
    type="primary"
    size="large"
    style={{ width: 'fit-content', margin: '10px auto' }}
    onClick={onClick}
    aria-label={label}
  >
    {currentMode === targetMode ? `Exit ${label}` : `Enter ${label}`}
  </Button>
);
