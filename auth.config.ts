// auth.config.ts
import { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // Your existing callbacks...
  },
  session: {
    strategy: 'jwt'
  },
  providers: [],
} satisfies NextAuthConfig;