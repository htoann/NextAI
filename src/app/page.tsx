"use client";

import { message as antdMessage } from "antd";
import React, { useState } from "react";
import Chatbox from "./components/Chatbox";
import Sidebar from "./components/Sidebar";

interface Messages {
  [conversation: string]: { type: "user" | "ai"; text: string }[];
}

const Home: React.FC = () => {
  const [conversations, setConversations] = useState<string[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<string>("General Chat");
  const [messages, setMessages] = useState<Messages>({
    "General Chat": [],
  });

  const handleSelectConversation = (conversation: string) => {
    setSelectedConversation(conversation);
  };

  const handleCreateConversation = (conversation: string) => {
    if (!conversation.trim()) {
      conversation = `Chat_${new Date().getTime()}`;
    }

    if (conversations.includes(conversation)) {
      antdMessage.error("Conversation name already exists!");
      return;
    }

    setConversations((prevConversations) => [
      ...prevConversations,
      conversation,
    ]);

    setMessages((prevMessages) => ({
      ...prevMessages,
      [conversation]: [],
    }));
    setSelectedConversation(conversation);
  };

  const handleSendMessage = (
    conversation: string,
    message: { type: "user" | "ai"; text: string }
  ) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [conversation]: [...prevMessages[conversation], message],
    }));
  };

  const handleUpdateLastMessage = (
    conversation: string,
    message: { type: "user" | "ai"; text: string }
  ) => {
    setMessages((prevMessages) => {
      const conversationMessages = prevMessages[conversation];
      const updatedMessages = [...conversationMessages];
      updatedMessages[updatedMessages.length - 1] = message;
      return {
        ...prevMessages,
        [conversation]: updatedMessages,
      };
    });
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        onCreateConversation={handleCreateConversation}
      />
      <div style={{ flex: 1, padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Chat with AI
        </h1>
        <Chatbox
          selectedConversation={selectedConversation}
          messages={messages[selectedConversation] || []}
          onSendMessage={handleSendMessage}
          onUpdateLastMessage={handleUpdateLastMessage}
        />
      </div>
    </div>
  );
};

export default Home;
