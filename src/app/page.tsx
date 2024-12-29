"use client";

import React, { useState } from "react";
import Chatbox from "./components/Chatbox";
import Sidebar from "./components/Sidebar";

const Home: React.FC = () => {
  const [conversations, setConversations] = useState<string[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<string>("General Chat");

  const handleSelectConversation = (conversation: string) => {
    setSelectedConversation(conversation);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
      />
      <div style={{ flex: 1, padding: "20px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Chat with AI
        </h1>
        <Chatbox selectedConversation={selectedConversation} />
      </div>
    </div>
  );
};

export default Home;
