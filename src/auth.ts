import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/userStore";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || "b8a36ec8c28890733a1378cfab87c0cec334d7e6a74768b2bf353cc4cb7595922",
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailStr = String(credentials.email).trim().toLowerCase();
        const passStr = String(credentials.password);

        const user = await findUserByEmail(emailStr);
        if (!user || !user.password) return null;

        let isValid = await bcrypt.compare(passStr, user.password);

        // Check alternate demo password if primary check fails
        if (!isValid && user.altPasswords && user.altPasswords.length > 0) {
          for (const altPass of user.altPasswords) {
            if (await bcrypt.compare(passStr, altPass)) {
              isValid = true;
              break;
            }
          }
        }

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          semester: user.semester,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id!;
        token.department = (user as any).department;
        token.semester = (user as any).semester;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as any;
        session.user.id = token.id as string;
        session.user.department = token.department as string | null;
        session.user.semester = token.semester as number | null;
      }
      return session;
    },
  },
});
