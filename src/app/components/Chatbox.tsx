"use client";

import { SendOutlined } from "@ant-design/icons";
import { Button, Col, Input, List, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";

interface Message {
  type: "user" | "ai";
  text: string;
}

interface ChatboxProps {
  selectedConversation: string;
}

const Chatbox: React.FC<ChatboxProps> = ({ selectedConversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (userMessage.trim()) {
      const newUserMessage: Message = { type: "user", text: userMessage };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      setUserMessage("");

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage }),
        });

        if (!response.body) {
          console.error("No response body from AI");
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let value = "";

        // Add a placeholder AI message to update while streaming
        const aiMessage: Message = { type: "ai", text: "" };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);

        // Read the stream and update the message with each chunk
        while (!done) {
          const { done: isDone, value: chunk } = await reader.read();
          done = isDone;
          value += decoder.decode(chunk, { stream: true });

          // Update the AI message in progress
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages[updatedMessages.length - 1] = {
              ...aiMessage,
              text: value,
            };
            return updatedMessages;
          });
        }

        // Finalize the response by appending the full AI message
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            ...aiMessage,
            text: value,
          };
          return updatedMessages;
        });
      } catch (error) {
        console.error("Error fetching AI response:", error);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        height: "700px",
      }}
    >
      <h3>{selectedConversation}</h3>

      <div style={{ flexGrow: 1, overflowY: "auto", padding: "0 10px" }}>
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item
              style={{
                textAlign: item.type === "user" ? "right" : "left",
                display: "flex",
                justifyContent:
                  item.type === "user" ? "flex-end" : "flex-start",
                padding: "5px 0",
                border: "none",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: item.type === "user" ? "#1890ff" : "#f0f0f0",
                  color: item.type === "user" ? "#fff" : "#000",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "70%",
                }}
              >
                {item.text}
              </div>
            </List.Item>
          )}
        />
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <Row
        gutter={8}
        style={{
          marginTop: "10px",
          position: "sticky",
          bottom: 0,
          backgroundColor: "#fff",
          zIndex: 1,
        }}
      >
        <Col span={20}>
          <Input
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            onPressEnter={handleSend}
            placeholder="Type your message..."
            style={{ width: "100%" }}
            size="large"
          />
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSend}
            disabled={!userMessage.trim()}
            style={{ width: "100%" }}
            size="large"
          />
        </Col>
      </Row>
    </div>
  );
};

export default Chatbox;
