import { useAppContext } from '@/context/AppContext';
import { generateChatName } from '@/lib/utils';
import { List, message } from 'antd';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ConversationItem } from './ConversationItem';
import { NewConversationInput } from './NewConversationInput';

export const Sidebar = () => {
  const router = useRouter();
  const { chatId } = useParams() as { chatId: string };

  const { setMessages, chats, setChats } = useAppContext();

  const [newChat, setNewChat] = useState('');

  const handleCreateConversation = () => {
    let chatName = newChat.trim();

    if (!chatName) {
      chatName = generateChatName();
      setNewChat(chatName);
    }

    if (chats.includes(chatName)) {
      message.error('Conversation name already exists!');
      return;
    }

    setChats((prevChats) => [chatName, ...prevChats]);

    setMessages((prevMessages) => ({
      ...prevMessages,
      [chatName]: [],
    }));

    setNewChat('');
  };

  const handleDeleteConversation = (conversation: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat !== conversation));
    setMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      delete newMessages[conversation];
      return newMessages;
    });
    if (chatId === conversation) router.push('/');
    message.success('Conversation deleted');
  };

  const handleRenameConversation = (oldName: string, newName: string) => {
    if (!newName.trim()) {
      return message.error('Conversation name cannot be empty!');
    }

    if (chats.includes(newName) && oldName !== newName) {
      return message.error('Conversation name already exists!');
    }

    setChats((prevChats) => prevChats.map((chat) => (chat === oldName ? newName : chat)));
    setMessages((prevMessages) => {
      const newMessages = { ...prevMessages };
      newMessages[newName] = newMessages[oldName];
      delete newMessages[oldName];
      return newMessages;
    });

    if (chatId === oldName) router.push(`/chat/${newName}`);
    message.success('Conversation renamed');
  };

  return (
    <div
      style={{
        width: '250px',
        borderRight: '1px solid #ccc',
        padding: '20px',
        height: 'calc(100vh - 56px)',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ marginBottom: 15, color: '#8231D3' }}>Conversations</h3>

      <NewConversationInput
        newChat={newChat}
        setNewChat={setNewChat}
        handleCreateConversation={handleCreateConversation}
      />

      <List
        size="small"
        dataSource={chats}
        renderItem={(item) => (
          <ConversationItem
            key={item}
            chatName={item}
            isActive={chatId === item}
            onSelect={() => router.push(`/chat/${item}`)}
            onDelete={() => handleDeleteConversation(item)}
            onRename={(newName: string) => handleRenameConversation(item, newName)}
          />
        )}
      />
    </div>
  );
};
