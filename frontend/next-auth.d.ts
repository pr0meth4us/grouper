// next-auth.d.ts

declare module "next-auth" {
  interface User {
    token: string;
  }

  interface Session {
    accessToken: string;
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
  }
}
