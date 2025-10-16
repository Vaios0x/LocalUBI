import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useHumanWallet } from './useHumanWallet';
import { toast } from 'sonner';
import { ClaimRecord } from '@/types/user';

export function useGoodDollar() {
  const { address } = useHumanWallet();
  const queryClient = useQueryClient();
  const [claiming, setClaiming] = useState(false);
  
  // Mock data - replace with actual GoodDollar SDK integration
  const dailyUBI = 50; // G$ per day
  
  // Check if user can claim
  const { data: claimStatus } = useQuery({
    queryKey: ['claimStatus', address],
    queryFn: async () => {
      // Check localStorage for last claim
      const lastClaim = localStorage.getItem(`lastClaim_${address}`);
      if (!lastClaim) return { canClaim: true, nextClaimTime: null };
      
      const lastClaimDate = new Date(lastClaim);
      const now = new Date();
      const hoursSinceLastClaim = (now.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastClaim >= 24) {
        return { canClaim: true, nextClaimTime: null };
      }
      
      const nextClaimTime = new Date(lastClaimDate.getTime() + 24 * 60 * 60 * 1000);
      return { canClaim: false, nextClaimTime };
    },
    refetchInterval: 60000, // Check every minute
    enabled: !!address,
  });

  // Get claim history
  const { data: claimHistory = [] } = useQuery({
    queryKey: ['claimHistory', address],
    queryFn: async () => {
      const history = localStorage.getItem(`claimHistory_${address}`);
      if (!history) return [];
      return JSON.parse(history) as ClaimRecord[];
    },
    enabled: !!address,
  });

  // Calculate total claimed
  const totalClaimed = claimHistory.reduce((acc: number, claim: ClaimRecord) => acc + claim.amount, 0);
  
  // Calculate streak
  const streak = (() => {
    if (claimHistory.length === 0) return 0;
    
    let currentStreak = 1;
    const sortedHistory = [...claimHistory].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    for (let i = 0; i < sortedHistory.length - 1; i++) {
      const current = new Date(sortedHistory[i].date);
      const previous = new Date(sortedHistory[i + 1].date);
      const daysDiff = (current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff <= 1.5) { // Allow some flexibility for time zones
        currentStreak++;
      } else {
        break;
      }
    }
    
    return currentStreak;
  })();

  // Claim UBI mutation
  const claimUBI = async () => {
    if (!address || !claimStatus?.canClaim) {
      toast.error('No puedes reclamar UBI en este momento');
      return;
    }
    
    setClaiming(true);
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update last claim
      localStorage.setItem(`lastClaim_${address}`, new Date().toISOString());
      
      // Add to history
      const newClaim: ClaimRecord = {
        amount: dailyUBI,
        date: new Date(),
        txHash: `0x${Math.random().toString(16).slice(2, 10)}`,
      };
      
      const history = JSON.parse(
        localStorage.getItem(`claimHistory_${address}`) || '[]'
      ) as ClaimRecord[];
      
      history.unshift(newClaim);
      localStorage.setItem(`claimHistory_${address}`, JSON.stringify(history));
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['claimStatus'] });
      queryClient.invalidateQueries({ queryKey: ['claimHistory'] });
      
      toast.success(`¡${dailyUBI} G$ reclamados exitosamente!`);
    } catch (error) {
      console.error('Error claiming UBI:', error);
      toast.error('Error al reclamar UBI');
    } finally {
      setClaiming(false);
    }
  };

  return {
    dailyUBI,
    canClaim: claimStatus?.canClaim || false,
    nextClaimTime: claimStatus?.nextClaimTime,
    claiming,
    claimUBI,
    claimHistory,
    totalClaimed,
    streak,
  };
}
