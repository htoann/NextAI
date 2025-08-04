'use client';

import { EChatMode, TConversation, TMessage } from '@/types';
import { Spin } from 'antd';
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

interface AppContextType {
  messages: TMessage[];
  setMessages: Dispatch<SetStateAction<TMessage[]>>;
  sending: boolean;
  setSending: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  chats: TConversation[];
  setChats: Dispatch<SetStateAction<TConversation[]>>;
  chatMode: EChatMode;
  setChatMode: Dispatch<SetStateAction<EChatMode>>;
  toggleChatMode: (mode: EChatMode) => void;
  cameraZoomed: boolean;
  setCameraZoomed: Dispatch<SetStateAction<boolean>>;
  selectedChat: TConversation | undefined;
  setSelectedChat: Dispatch<React.SetStateAction<TConversation | undefined>>;
  chat: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<TMessage[]>([]);
  const [chats, setChats] = useState<TConversation[] | []>([]);
  const [chatMode, setChatMode] = useState(EChatMode.Normal);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedChat, setSelectedChat] = useState<TConversation | undefined>();

  const toggleChatMode = (mode: EChatMode) => {
    setChatMode(chatMode === mode ? EChatMode.Normal : mode);
  };

  const chat = () => {
    console.log('chat');
  };

  return (
    <AppContext.Provider
      value={{
        messages,
        setMessages,
        sending,
        setSending,
        chats,
        setChats,
        chatMode,
        setChatMode,
        toggleChatMode,
        cameraZoomed,
        setCameraZoomed,
        setLoading,
        selectedChat,
        setSelectedChat,
        chat,
      }}
    >
      {children}
      {loading && <Spin fullscreen percent="auto" size="large" />}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
