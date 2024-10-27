// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const response = await fetch(
          `${process.env.NEXTAUTH_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          },
        );

        const apiResponse = await response.json();

        if (response.ok && apiResponse.success) {
          const { token, user } = apiResponse.data;

          return { ...user, token };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
