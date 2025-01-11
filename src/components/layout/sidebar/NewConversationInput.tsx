import { Button, Input } from 'antd';

interface NewConversationInputProps {
  newChat: string;
  setNewChat: (value: string) => void;
  handleCreateConversation: () => void;
}

export const NewConversationInput = ({ newChat, setNewChat, handleCreateConversation }: NewConversationInputProps) => {
  return (
    <>
      <Input
        value={newChat}
        onChange={(e) => setNewChat(e.target.value)}
        placeholder="New conversation"
        onPressEnter={handleCreateConversation}
        style={{ marginBottom: 10 }}
      />
      <Button type="primary" onClick={handleCreateConversation} style={{ marginBottom: 30, width: '100%' }}>
        Create
      </Button>
    </>
  );
};
