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
        console.log("Credentials authorize");
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
          console.log("This is the user ", user);
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
      // TODO : create a boolean that check if the user is in a workspace or not
      // if the user is not in a workspace , a modal to create or Join a workspace should be displayed in the home
      // screen
      // for now it will be asimple function that return true if there is any existing workspaces , and false if not

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      console.log("Token ", token.inWorkSpace);
      if (token.inWorkSpace && session.user) {
        session.user.inWorkSpace = token.inWorkspace as boolean;
      }
      console.log("This is the sessions ", session);
      return session;
    },
    async jwt({ token }) {
      //
      token.inWorkSpace = false;
      return token;
    },
    async signIn({ user }) {
      console.log("Sign in callback");
      if (user) {
        return true;
      }
      return false;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    error: "/auth/error",
  },
} as NextAuthConfig;
