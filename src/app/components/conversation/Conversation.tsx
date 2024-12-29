import React from "react";
import styles from "./ConversationItem.module.css";

interface ConversationItemProps {
  id: number;
  selectConversation: (id: number) => void;
  deleteConversation: (id: number) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  id,
  selectConversation,
  deleteConversation,
}) => {
  return (
    <li
      className={styles.conversationItem}
      onClick={() => selectConversation(id)}
    >
      Conversation {id}
      <button
        className={styles.deleteButton}
        onClick={(e) => {
          e.stopPropagation();
          deleteConversation(id);
        }}
      >
        Delete
      </button>
    </li>
  );
};

export default ConversationItem;
