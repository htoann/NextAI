'use client';

import React, { createContext, useContext, useState } from 'react';

interface AppContextProps {
  messages: Messages;
  setMessages: React.Dispatch<React.SetStateAction<Messages>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface Messages {
  [conversation: string]: { type: 'user' | 'ai'; text: string }[];
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Messages>({
    'General Chat': [],
  });

  return (
    <AppContext.Provider
      value={{
        messages,
        setMessages,
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
