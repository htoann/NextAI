import { useAppContext } from '@/context/AppContext';
import {
  createConversation,
  deleteConversation,
  getConversations,
  updateConversationTitle,
} from '@/lib/services/conversation';
import { List, message, Skeleton } from 'antd';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { ChatNameInput } from './ChatNameInput';
import { ConversationItem } from './ConversationItem';

export const Sidebar = () => {
  const { data: session } = useSession();
  const { chats, setChats, selectedChat, setSelectedChat } = useAppContext();

  const [newChatTitle, setNewChatTitle] = useState('');
  const [loadingList, setLoadingList] = useState(false);
  const [conversationsLoaded, setConversationsLoaded] = useState(false);

  useEffect(() => {
    if (session && !conversationsLoaded) {
      setLoadingList(true);
      getConversations()
        .then((conversations) => {
          setChats(conversations);
          setConversationsLoaded(true);
        })
        .finally(() => setLoadingList(false));
    }
  }, [session, conversationsLoaded]);

  const handleCreateConversation = async () => {
    if (chats.find((chat) => chat.title === newChatTitle)) {
      message.error('Conversation already exists!');
      return;
    }

    const conversation = await createConversation({
      title: newChatTitle,
      user: session?.user?.email!,
    });

    setChats((prevChats) => [conversation, ...prevChats]);
    setSelectedChat(conversation);

    setNewChatTitle('');
    message.success('Conversation created');
  };

  const handleDeleteConversation = async (conversationId: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat._id !== conversationId));

    await deleteConversation(conversationId);
    message.success('Conversation deleted');
  };

  const handleRenameConversation = async (conversationId: string, oldName: string, newName: string) => {
    if (!newName.trim()) {
      return message.error('Conversation name cannot be empty!');
    }
    if (chats.find((chat) => chat.title === newName) && oldName !== newName) {
      return message.error('Conversation name already exists!');
    }

    await updateConversationTitle(conversationId, newName);

    setChats((prevChats) => prevChats.map((chat) => (chat.title === oldName ? { ...chat, title: newName } : chat)));

    message.success('Conversation renamed');
  };

  return (
    <div
      style={{
        minWidth: 250,
        maxWidth: 250,
        borderRight: '1px solid #ccc',
      }}
    >
      <div style={{ padding: '20px 20px 0 20px' }}>
        <h3 style={{ marginBottom: 15, color: '#8231D3' }}>Conversations</h3>

        <ChatNameInput
          newChatTitle={newChatTitle}
          setNewChatTitle={setNewChatTitle}
          handleCreateConversation={handleCreateConversation}
        />
      </div>

      {loadingList ? (
        <Skeleton paragraph style={{ padding: 20 }} />
      ) : (
        <List
          style={{
            maxHeight: 'calc(100vh - 255px)',
            overflow: 'auto',
            padding: '0 10px 20px 20px',
          }}
          size="small"
          dataSource={chats}
          renderItem={(conversation) => (
            <ConversationItem
              key={conversation._id}
              chatName={conversation.title}
              isActive={selectedChat?._id === conversation._id}
              onSelect={() => setSelectedChat(conversation)}
              onDelete={() => handleDeleteConversation(conversation._id!)}
              onRename={(newName: string) => handleRenameConversation(conversation._id!, conversation.title, newName)}
            />
          )}
        />
      )}
    </div>
  );
};
