"use client";

import { SendOutlined } from "@ant-design/icons";
import { Button, Col, Input, List, Row } from "antd";
import React, { useState } from "react";

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

  const handleSend = async () => {
    if (userMessage.trim()) {
      const newUserMessage: Message = { type: "user", text: userMessage };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        const newAIMessage: Message = { type: "ai", text: data.response };
        setMessages((prevMessages) => [...prevMessages, newAIMessage]);
      } catch (error) {
        console.error("Error fetching AI response:", error);
      }

      setUserMessage("");
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
