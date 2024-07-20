import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Assuming the user object has a role property
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = `${token.role}`; // Include the role in the session object
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const userRole = auth?.user?.role;

      if (!isLoggedIn) return false;

      if (nextUrl.pathname.match("/dashboard/invoices")) {
        if (userRole === "admin") return true;
        else return false;
      }

      if (!nextUrl.pathname.match("/dashboard")) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
