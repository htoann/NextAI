"use client";

import { List } from "antd";
import React from "react";

interface SidebarProps {
  conversations: string[];
  onSelectConversation: (conversation: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  onSelectConversation,
}) => {
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
      <h3 style={{marginBottom: 15}}>Conversations</h3>
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
