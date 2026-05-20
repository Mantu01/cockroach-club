export {};

declare global {
  interface ClerkError {
    errors: {
      message: string;
      longMessage: string;
      code: string;
      meta?: {
        lockout_expires_in_seconds?: number;
        [key: string]: string;
      };
    }[];
  }
}