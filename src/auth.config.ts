import "server-only";
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { signInValidationSchema } from "./lib/validation-schemas";
import { findUserByEmail } from "./utils/database";
import bycrpt from "bcryptjs";
export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          // this validation should be done here also cuz the user can send the request to the server without using the UI
          const validatedCredentials = await signInValidationSchema.validate(
            credentials
          );
          const { email, password } = validatedCredentials;
          const user = await findUserByEmail(email);

          if (!user || !user.password) {
            return null;
          }
          const match = await bycrpt.compare(password, user.password);
          if (match) return user;
          return null;
        } catch (err) {
          console.log(err);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  events: {},
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      return token;
    },
    async signIn({ user }) {
      if (user) {
        return true;
      }
      return false;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt", maxAge: 1 * 60, updateAge: 1 * 60 },
  pages: {
    error: "/auth/error",
  },
} as NextAuthConfig;
