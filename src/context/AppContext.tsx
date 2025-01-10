'use client';

import { EChatMode, TMessage } from '@/type';
import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

interface AppContextType {
  messages: Record<string, TMessage[]>;
  setMessages: Dispatch<SetStateAction<Record<string, TMessage[]>>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  chats: string[];
  setChats: Dispatch<SetStateAction<string[]>>;
  chatMode: EChatMode;
  setChatMode: Dispatch<SetStateAction<EChatMode>>;
  toggleChatMode: (mode: EChatMode) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface Messages {
  [conversation: string]: { type: 'user' | 'ai'; text: string }[];
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Messages>({ 'General Chat': [] });
  const [chats, setChats] = useState<string[]>([]);
  const [chatMode, setChatMode] = useState(EChatMode.Normal);

  const toggleChatMode = (mode: EChatMode) => {
    setChatMode(chatMode === mode ? EChatMode.Normal : mode);
  };

  return (
    <AppContext.Provider
      value={{
        messages,
        setMessages,
        loading,
        setLoading,
        chats,
        setChats,
        chatMode,
        setChatMode,
        toggleChatMode,
      }}
    >
      {children}
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
