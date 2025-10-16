export interface User {
  address: string;
  ensName?: string;
  balance: string;
  totalClaimed: number;
  streak: number;
  joinDate: Date;
}

export interface ClaimRecord {
  amount: number;
  date: Date;
  txHash?: string;
}

export interface Transaction {
  type: 'received' | 'sent';
  amount: number;
  currency: string;
  description: string;
  date: Date;
  txHash?: string;
}
