import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
    loyaltyPoints?: number;
    walletBalance?: number;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
      loyaltyPoints?: number;
      walletBalance?: number;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    loyaltyPoints?: number;
    walletBalance?: number;
  }
}
