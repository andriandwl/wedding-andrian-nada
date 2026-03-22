/**
 * lib/auth.ts
 * NextAuth configuration + session helper.
 */
import { AuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from './db';
import AdminUser from '@/models/AdminUser';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await AdminUser.findOne({ email: credentials.email.toLowerCase() }).lean();
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return {
          id:    String(user._id),
          email: user.email,
          role:  user.role,
          name:  user.email,
        };
      },
    }),
  ],

  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 }, // 8 hours

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id   = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
    error:  '/login',
  },

  secret: process.env.NEXTAUTH_SECRET,
};

/** Server-side: get current session or null */
export const getSession = () => getServerSession(authOptions);

/** Server-side: require admin session, throws if missing */
export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) return null;
  return session.user;
}
