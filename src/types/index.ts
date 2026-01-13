export interface User {
  id: string;
  email: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  creditsBalance?: number;
  creditsUsed?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Google Identity Services types
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: any) => void }) => void;
          renderButton: (element: HTMLElement | null, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}
