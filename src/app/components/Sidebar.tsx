"use client";

import { Button, Input, List } from "antd";
import React, { useState } from "react";

interface SidebarProps {
  conversations: string[];
  onSelectConversation: (conversation: string) => void;
  onCreateConversation: (conversation: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  onSelectConversation,
  onCreateConversation,
}) => {
  const [newConversation, setNewConversation] = useState<string>("");

  const handleCreateConversation = () => {
    onCreateConversation(newConversation);
    setNewConversation("");
  };

  return (
    <div
      style={{
        width: "250px",
        borderRight: "1px solid #ccc",
        padding: "20px",
        maxHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <h3 style={{ marginBottom: 15 }}>Conversations</h3>
      <Input
        value={newConversation}
        onChange={(e) => setNewConversation(e.target.value)}
        placeholder="New conversation"
        onPressEnter={handleCreateConversation}
        style={{ marginBottom: 10 }}
      />
      <Button
        type="primary"
        onClick={handleCreateConversation}
        style={{ marginBottom: 20 }}
      >
        Create
      </Button>
      <List
        size="small"
        bordered
        dataSource={conversations}
        renderItem={(item) => (
          <List.Item
            onClick={() => onSelectConversation(item)}
            style={{ cursor: "pointer" }}
          >
            {item}
          </List.Item>
        )}
      />
    </div>
  );
};

export default Sidebar;
