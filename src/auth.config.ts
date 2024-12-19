import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [Credentials({}), Google({})],
  events: {},
  callbacks: {},
  secret: "",
  session: { strategy: "jwt" },
  pages: {},
} as NextAuthConfig;
