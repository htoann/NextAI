export const generateChatName = () => `chat_${new Date().getTime()}`;

export const getEmojiForExpression = (expression: string): string => {
  const emojiMap: { [key: string]: string } = {
    happy: '😄',
    sad: '😢',
    angry: '😠',
    surprised: '😲',
    neutral: '😐',
    disgusted: '🤢',
    fearful: '😨',
  };
  return emojiMap[expression] || '❓';
};
