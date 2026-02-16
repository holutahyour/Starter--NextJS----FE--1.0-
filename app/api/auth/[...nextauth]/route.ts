import { DefaultSession, User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    roles: string[];
  }
}

import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import { jwtDecode } from "jwt-decode";

const handler = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
      authorization: {
        params: {
          scope: "openid profile email offline_access User.Read",
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, account, profile }) {
      // Initial sign in
      if (account && profile) {
        // Parse the id token to extract roles
        let roles: string[] = [];
        if (account.id_token) {
          const decoded: any = jwtDecode(account.id_token);

          // Extract roles from token
          // Depending on your Azure AD configuration:
          // - roles may be in decoded.roles (App Roles)
          // - or decoded.groups (Azure AD Groups)
          // - or you might have a custom claim
          roles = decoded.roles || decoded.groups || [];
        }

        return {
          ...token,
          id: profile.sub,
          roles: roles,
        };
      }
      // console.log("JWT Callback", token,account, profile);

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roles = token.roles as string[];
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };

export const authOptions = {
  // ...other options...
  callbacks: {
    jwt: async ({ token, user }: { token: JWT; user?: User }) => {
      if (user) {
        token.roles = user.roles;
      }
      return token;
    },
    session: async ({ session, token }: { session: any, token: JWT }) => {
      if (session?.user) {
        session.user.roles = token.roles;
      }
      return session;
    },
  },
  // ...other options...
};
