'use client';

import { useState, useEffect, useCallback } from 'react';
import { getNillionService, ReputationData, PrivateComputation } from '@/lib/nillion';

export interface UseNillionReturn {
  // Reputation
  reputationData: ReputationData | null;
  calculateReputation: (userId: string, data: any) => Promise<void>;
  isCalculatingReputation: boolean;
  
  // Tanda Verification
  verifyTandaEligibility: (userId: string, tandaId: string) => Promise<boolean>;
  isVerifyingEligibility: boolean;
  
  // UBI Distribution
  calculateUBIDistribution: (communityData: any) => Promise<Record<string, number>>;
  isCalculatingUBI: boolean;
  
  // Computations
  computations: PrivateComputation[];
  getComputationStatus: (computationId: string) => PrivateComputation | null;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export function useNillion(): UseNillionReturn {
  const [reputationData, setReputationData] = useState<ReputationData | null>(null);
  const [isCalculatingReputation, setIsCalculatingReputation] = useState(false);
  const [isVerifyingEligibility, setIsVerifyingEligibility] = useState(false);
  const [isCalculatingUBI, setIsCalculatingUBI] = useState(false);
  const [computations, setComputations] = useState<PrivateComputation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const nillionService = getNillionService();

  // Actualizar computaciones cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const allComputations = nillionService.getAllComputations();
      setComputations(allComputations);
    }, 5000);

    return () => clearInterval(interval);
  }, [nillionService]);

  const calculateReputation = useCallback(async (userId: string, data: any) => {
    try {
      setError(null);
      setIsCalculatingReputation(true);
      
      const reputation = await nillionService.calculateReputationScore(userId, data);
      setReputationData(reputation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error calculating reputation');
    } finally {
      setIsCalculatingReputation(false);
    }
  }, [nillionService]);

  const verifyTandaEligibility = useCallback(async (userId: string, tandaId: string): Promise<boolean> => {
    try {
      setError(null);
      setIsVerifyingEligibility(true);
      
      const isEligible = await nillionService.verifyTandaEligibility(userId, tandaId);
      return isEligible;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying tanda eligibility');
      return false;
    } finally {
      setIsVerifyingEligibility(false);
    }
  }, [nillionService]);

  const calculateUBIDistribution = useCallback(async (communityData: any): Promise<Record<string, number>> => {
    try {
      setError(null);
      setIsCalculatingUBI(true);
      
      const distribution = await nillionService.calculateUBIDistribution(communityData);
      return distribution;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error calculating UBI distribution');
      return {};
    } finally {
      setIsCalculatingUBI(false);
    }
  }, [nillionService]);

  const getComputationStatus = useCallback((computationId: string): PrivateComputation | null => {
    return nillionService.getComputationStatus(computationId);
  }, [nillionService]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    reputationData,
    calculateReputation,
    isCalculatingReputation,
    verifyTandaEligibility,
    isVerifyingEligibility,
    calculateUBIDistribution,
    isCalculatingUBI,
    computations,
    getComputationStatus,
    error,
    clearError
  };
}
