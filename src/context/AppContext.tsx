'use client';

import { EChatMode, TMessage } from '@/type';
import { Spin } from 'antd';
import React, { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

interface AppContextType {
  messages: Record<string, TMessage[]>;
  setMessages: Dispatch<SetStateAction<Record<string, TMessage[]>>>;
  sending: boolean;
  setSending: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  chats: string[];
  setChats: Dispatch<SetStateAction<string[]>>;
  chatMode: EChatMode;
  setChatMode: Dispatch<SetStateAction<EChatMode>>;
  toggleChatMode: (mode: EChatMode) => void;
  cameraZoomed: boolean;
  setCameraZoomed: Dispatch<SetStateAction<boolean>>;
  onMessagePlayed: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface Messages {
  [conversation: string]: { type: 'user' | 'ai'; text: string }[];
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Messages>({ 'General Chat': [] });
  const [chats, setChats] = useState<string[]>([]);
  const [chatMode, setChatMode] = useState(EChatMode.Normal);
  const [cameraZoomed, setCameraZoomed] = useState(true);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);

  const onMessagePlayed = () => {
    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };
      updatedMessages['General Chat'] = updatedMessages['General Chat'].slice(1);
      return updatedMessages;
    });
  };

  const toggleChatMode = (mode: EChatMode) => {
    setChatMode(chatMode === mode ? EChatMode.Normal : mode);
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
        onMessagePlayed,
        setLoading,
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
