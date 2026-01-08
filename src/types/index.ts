export interface User {
  id: string;
  email: string;
  passwordHash: string;
  creditsBalance?: number;
  creditsUsed?: number;
  createdAt: Date;
  updatedAt: Date;
}
