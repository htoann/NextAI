import mongoose from 'mongoose';

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

export const theme = {
  token: {
    colorPrimary: '#8231D3',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
  },
};

export const connect = async () => {
  if (mongoose.connections[0].readyState) {
    return;
  }

  const dbUri = process.env.MONGODB_URI as string;
  await mongoose.connect(dbUri);
};

export const metadata = {
  title: 'Next.js 15 Gemini AI',
  description: 'Chat with Gemini AI',
};
