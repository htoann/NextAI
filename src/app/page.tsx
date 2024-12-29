"use client";

import { useState } from "react";
import Chatbox from "./components/chatbox/Chatbox";
import Sidebar from "./components/sidebar/Sidebar";
import styles from "./page.module.css";

export default function Home() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [conversations, setConversations] = useState<
    { id: number; messages: { sender: string; text: string }[] }[]
  >([]);
  const [currentConversationId, setCurrentConversationId] = useState<
    number | null
  >(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "User", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: input }),
    });
    const data = await response.json();
    const aiMessage = { sender: "AI", text: data.response };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);

    if (currentConversationId !== null) {
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === currentConversationId
            ? { ...conv, messages: [...conv.messages, userMessage, aiMessage] }
            : conv
        )
      );
    } else {
      const newConversation = {
        id: conversations.length + 1,
        messages: [userMessage, aiMessage],
      };
      setConversations((prevConversations) => [
        ...prevConversations,
        newConversation,
      ]);
      setCurrentConversationId(newConversation.id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const selectConversation = (id: number) => {
    const conversation = conversations.find((conv) => conv.id === id);
    if (conversation) {
      setMessages(conversation.messages);
      setCurrentConversationId(id);
    }
  };

  const createNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(null);
  };

  const deleteConversation = (id: number) => {
    setConversations((prevConversations) =>
      prevConversations.filter((conv) => conv.id !== id)
    );
    if (currentConversationId === id) {
      setMessages([]);
      setCurrentConversationId(null);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar
        conversations={conversations}
        selectConversation={selectConversation}
        deleteConversation={deleteConversation}
        createNewConversation={createNewConversation}
      />
      <Chatbox
        messages={messages}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        handleKeyPress={handleKeyPress}
      />
    </div>
  );
}
