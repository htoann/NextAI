import { Button, Input } from 'antd';

interface NewConversationInputProps {
  newChatName: string;
  setNewChatName: (value: string) => void;
  handleCreateConversation: () => void;
}

export const ChatNameInput = ({ newChatName, setNewChatName, handleCreateConversation }: NewConversationInputProps) => {
  return (
    <>
      <Input
        value={newChatName}
        onChange={(e) => setNewChatName(e.target.value)}
        placeholder="New conversation"
        onPressEnter={handleCreateConversation}
        style={{ marginBottom: 10 }}
      />
      <Button
        type="primary"
        onClick={handleCreateConversation}
        style={{ marginBottom: 30, width: '100%' }}
        disabled={!newChatName?.trim()}
      >
        Create
      </Button>
    </>
  );
};
