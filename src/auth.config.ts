import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("credentials", credentials);
        return null;
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
  callbacks: {},
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    error: "/auth/error",
  },
} as NextAuthConfig;
