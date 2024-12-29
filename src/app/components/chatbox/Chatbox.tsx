import React from "react";
import styles from "./Chatbox.module.css";

interface ChatBoxProps {
  messages: { sender: string; text: string }[];
  input: string;
  setInput: (input: string) => void;
  sendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const Chatbox: React.FC<ChatBoxProps> = ({
  messages,
  input,
  setInput,
  sendMessage,
  handleKeyPress,
}) => {
  return (
    <div className={styles.chatBox}>
      <ul className={styles.messageList}>
        {messages.map((message, index) => (
          <li key={index} className={styles.messageItem}>
            {message.sender}: {message.text}
          </li>
        ))}
      </ul>
      <textarea
        className={styles.textArea}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type your message here..."
      />
      <button className={styles.sendButton} onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default Chatbox;
