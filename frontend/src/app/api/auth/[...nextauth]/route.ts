import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '../../../../lib/mongodb';
import { compare } from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const { db } = await connectToDatabase();

        // Find user by email
        const user = await db.collection('users').findOne({ email: credentials?.email });

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Compare passwords
        const isValid = await compare(credentials?.password || '', user.password);

        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Return user object without password
        const { password, ...userWithoutPassword } = user; // Destructure to exclude password
        return userWithoutPassword; // Return the user object without the password
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user; // Store user in token
      return token;
    },
    async session({ session, token }) {
      session.user = token.user; // Attach user to session
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };