export interface Tanda {
  id: number;
  name: string;
  creator: string;
  monthlyAmount: number;
  maxMembers: number;
  currentMembers: number;
  currentRound: number;
  isActive: boolean;
  isCompleted: boolean;
  members: string[];
  startTime: Date | null;
  nextPayoutDate: Date | null;
  totalContributed?: number;
  needsPayment?: boolean;
}

export interface CreateTandaData {
  amount: number;
  members: number;
  frequency: number;
  name?: string;
  description?: string;
}

export interface TandaStats {
  totalSaved: number;
  activeTandas: number;
  pendingPayments: number;
  nextPayout: Date | null;
}
