import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextRequest } from 'next/server';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { username, password } = credentials || {};

        if (username === 'admin' && password === 'admin') {
          return { id: '1', name: 'Admin', email: 'admin@example.com' };
        }

        throw new Error('Invalid username or password');
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
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
      if (session?.user) {
        session.user.email = token.email;
        session.user.name = token.name;
      }
      return session;
    },
  },
};

export const GET = (req: NextRequest) => NextAuth(authOptions)(req);
export const POST = (req: NextRequest) => NextAuth(authOptions)(req);
