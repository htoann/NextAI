import React from "react";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  conversations: { id: number; messages: { sender: string; text: string }[] }[];
  selectConversation: (id: number) => void;
  deleteConversation: (id: number) => void;
  createNewConversation: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  selectConversation,
  deleteConversation,
  createNewConversation,
}) => {
  return (
    <div className={styles.sidebar}>
      <h2>Conversations</h2>
      <button className={styles.newButton} onClick={createNewConversation}>
        New Conversation
      </button>
      <ul className={styles.conversationList}>
        {conversations.map((conv) => (
          <li
            key={conv.id}
            className={styles.conversationItem}
            onClick={() => selectConversation(conv.id)}
          >
            Conversation {conv.id}
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                deleteConversation(conv.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
