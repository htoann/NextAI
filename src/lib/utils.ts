import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const QUEUE_NAME = 'booking_queue';

export const CHATBOX_SNIPPET = 'https://cdn.jsdelivr.net/gh/htoann/NextAI@master/public/chatbox-widget.js';

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

export const metadata = {
  title: 'Next.js 15 Gemini AI',
  description: 'Chat with Gemini AI',
};

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const generateObjectId = (): string => {
  const timestamp = Math.floor(new Date().getTime() / 1000).toString(16);
  const random = 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16));
  return timestamp + random;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize() {
        return { id: generateObjectId(), name: 'Admin', email: 'admin@admin.com' };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
};

export const sanitizeMessage = (content: string) => {
  return content.replace(/<a\s+href="([^"]+)"[^>]*>(.*?)<\/a>/gi, (_match, href, text) => `[${text}](${href})`);
};
