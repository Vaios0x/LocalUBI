'use client';

import { useState, useEffect, useCallback } from 'react';
import { getEnhancedGoodDollar, UBIUser, UBICommunity, UBIClaim, UBICalculation } from '@/lib/gooddollar-enhanced';

export interface UseEnhancedUBIReturn {
  // User UBI
  user: UBIUser | null;
  setUser: (user: UBIUser) => void;
  
  // Community
  community: UBICommunity | null;
  setCommunity: (community: UBICommunity) => void;
  
  // Claims
  claims: UBIClaim[];
  processClaim: () => Promise<{ success: boolean; claim?: UBIClaim; error?: string }>;
  isProcessingClaim: boolean;
  
  // Calculations
  calculation: UBICalculation | null;
  calculateUBI: () => void;
  isCalculating: boolean;
  
  // Eligibility
  eligibility: { eligible: boolean; reason?: string; nextEligible?: Date } | null;
  checkEligibility: () => void;
  
  // Stats
  stats: {
    totalMembers: number;
    eligibleMembers: number;
    totalClaimed: number;
    averageClaim: number;
    topContributors: Array<{ user: UBIUser; score: number }>;
  } | null;
  getStats: () => void;
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export function useEnhancedUBI(): UseEnhancedUBIReturn {
  const [user, setUser] = useState<UBIUser | null>(null);
  const [community, setCommunity] = useState<UBICommunity | null>(null);
  const [claims, setClaims] = useState<UBIClaim[]>([]);
  const [calculation, setCalculation] = useState<UBICalculation | null>(null);
  const [eligibility, setEligibility] = useState<{ eligible: boolean; reason?: string; nextEligible?: Date } | null>(null);
  const [stats, setStats] = useState<{
    totalMembers: number;
    eligibleMembers: number;
    totalClaimed: number;
    averageClaim: number;
    topContributors: Array<{ user: UBIUser; score: number }>;
  } | null>(null);
  
  const [isProcessingClaim, setIsProcessingClaim] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhancedGoodDollar = getEnhancedGoodDollar();

  // Cargar datos del usuario desde localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('ubi_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    }
  }, []);

  // Guardar datos del usuario en localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('ubi_user', JSON.stringify(user));
    }
  }, [user]);

  // Cargar claims desde localStorage
  useEffect(() => {
    const savedClaims = localStorage.getItem('ubi_claims');
    if (savedClaims) {
      try {
        const claimsData = JSON.parse(savedClaims);
        setClaims(claimsData);
      } catch (err) {
        console.error('Error loading claims data:', err);
      }
    }
  }, []);

  // Guardar claims en localStorage
  useEffect(() => {
    if (claims.length > 0) {
      localStorage.setItem('ubi_claims', JSON.stringify(claims));
    }
  }, [claims]);

  const processClaim = useCallback(async (): Promise<{ success: boolean; claim?: UBIClaim; error?: string }> => {
    if (!user || !community) {
      return {
        success: false,
        error: 'Usuario o comunidad no configurados'
      };
    }

    try {
      setError(null);
      setIsProcessingClaim(true);
      
      const result = await enhancedGoodDollar.processUBIClaim(user, community);
      
      if (result.success && result.claim) {
        // Actualizar usuario
        const updatedUser: UBIUser = {
          ...user,
          totalClaimed: user.totalClaimed + result.claim.amount,
          streak: result.claim.reason === 'daily' ? user.streak + 1 : user.streak,
          lastClaimDate: result.claim.timestamp,
          claimHistory: [...user.claimHistory, result.claim]
        };
        
        setUser(updatedUser);
        setClaims(prev => [...prev, result.claim!]);
        
        return { success: true, claim: result.claim };
      } else {
        setError(result.error || 'Error procesando claim');
        return { success: false, error: result.error };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error procesando claim';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessingClaim(false);
    }
  }, [user, community, enhancedGoodDollar]);

  const calculateUBI = useCallback(() => {
    if (!user || !community) {
      setError('Usuario o comunidad no configurados');
      return;
    }

    try {
      setError(null);
      setIsCalculating(true);
      
      const calculation = enhancedGoodDollar.calculatePersonalizedUBI(user, community);
      setCalculation(calculation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error calculando UBI');
    } finally {
      setIsCalculating(false);
    }
  }, [user, community, enhancedGoodDollar]);

  const checkEligibility = useCallback(() => {
    if (!user) {
      setError('Usuario no configurado');
      return;
    }

    try {
      setError(null);
      const eligibility = enhancedGoodDollar.isEligibleForClaim(user);
      setEligibility(eligibility);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verificando elegibilidad');
    }
  }, [user, enhancedGoodDollar]);

  const getStats = useCallback(() => {
    if (!community) {
      setError('Comunidad no configurada');
      return;
    }

    try {
      setError(null);
      const stats = enhancedGoodDollar.getUBIStats(community);
      setStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error obteniendo estadísticas');
    }
  }, [community, enhancedGoodDollar]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Verificar elegibilidad automáticamente cuando cambia el usuario
  useEffect(() => {
    if (user) {
      checkEligibility();
    }
  }, [user, checkEligibility]);

  // Calcular UBI automáticamente cuando cambian usuario o comunidad
  useEffect(() => {
    if (user && community) {
      calculateUBI();
    }
  }, [user, community, calculateUBI]);

  // Obtener estadísticas automáticamente cuando cambia la comunidad
  useEffect(() => {
    if (community) {
      getStats();
    }
  }, [community, getStats]);

  return {
    user,
    setUser,
    community,
    setCommunity,
    claims,
    processClaim,
    isProcessingClaim,
    calculation,
    calculateUBI,
    isCalculating,
    eligibility,
    checkEligibility,
    stats,
    getStats,
    error,
    clearError
  };
}
