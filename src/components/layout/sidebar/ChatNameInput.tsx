import { Button, Input } from 'antd';

interface NewConversationInputProps {
  newChatTitle: string;
  setNewChatTitle: (value: string) => void;
  handleCreateConversation: () => void;
}

export const ChatNameInput = ({
  newChatTitle,
  setNewChatTitle,
  handleCreateConversation,
}: NewConversationInputProps) => {
  return (
    <>
      <Input
        value={newChatTitle}
        onChange={(e) => setNewChatTitle(e.target.value)}
        placeholder="New conversation"
        onPressEnter={handleCreateConversation}
        style={{ marginBottom: 10 }}
      />
      <Button
        type="primary"
        onClick={handleCreateConversation}
        style={{ marginBottom: 30, width: '100%' }}
        disabled={!newChatTitle?.trim()}
      >
        Create
      </Button>
    </>
  );
};
