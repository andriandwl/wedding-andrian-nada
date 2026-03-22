/**
 * types/next-auth.d.ts
 * Extends NextAuth Session & JWT types.
 */
import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface User extends DefaultUser {
    id:   string;
    role: string;
  }
  interface Session extends DefaultSession {
    user: {
      id:   string;
      role: string;
      email: string;
      name?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id:   string;
    role: string;
  }
}
