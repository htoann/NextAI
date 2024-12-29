"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");

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
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatBox}>
        <ul className={styles.messageList}>
          {messages.map((message, index) => (
            <li key={index} className={styles.messageItem}>
              <strong>{message.sender}:</strong> {message.text}
            </li>
          ))}
        </ul>
        <textarea
          className={styles.textArea}
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message here..."
        />
        <button className={styles.sendButton} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
