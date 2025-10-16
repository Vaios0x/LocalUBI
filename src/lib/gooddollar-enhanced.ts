/**
 * Enhanced GoodDollar Integration
 * Mejoras avanzadas para el sistema UBI
 */

export interface UBIUser {
  id: string;
  address: string;
  reputationScore: number;
  claimHistory: UBIClaim[];
  totalClaimed: number;
  streak: number;
  lastClaimDate: Date;
  eligibility: boolean;
}

export interface UBIClaim {
  id: string;
  userId: string;
  amount: number;
  timestamp: Date;
  multiplier: number;
  reason: 'daily' | 'bonus' | 'community' | 'streak';
  transactionHash?: string;
}

export interface UBICommunity {
  id: string;
  name: string;
  members: UBIUser[];
  totalPool: number;
  distributionRules: DistributionRule[];
  createdAt: Date;
}

export interface DistributionRule {
  id: string;
  type: 'reputation' | 'activity' | 'streak' | 'community';
  weight: number;
  minValue: number;
  maxValue: number;
}

export interface UBICalculation {
  baseAmount: number;
  reputationMultiplier: number;
  streakMultiplier: number;
  communityMultiplier: number;
  finalAmount: number;
  factors: {
    reputation: number;
    streak: number;
    community: number;
    base: number;
  };
}

export class EnhancedGoodDollar {
  private baseUBIAmount: number = 10; // G$ base por día
  private maxMultiplier: number = 3.0;
  private streakBonus: number = 0.1; // 10% por día de racha

  /**
   * Calcular UBI personalizado basado en reputación y actividad
   */
  calculatePersonalizedUBI(user: UBIUser, community: UBICommunity): UBICalculation {
    const baseAmount = this.baseUBIAmount;
    
    // Multiplicador por reputación (0.5x a 2.0x)
    const reputationMultiplier = Math.max(0.5, Math.min(2.0, user.reputationScore / 50));
    
    // Multiplicador por racha (hasta 1.5x)
    const streakMultiplier = Math.min(1.5, 1 + (user.streak * this.streakBonus));
    
    // Multiplicador por contribución comunitaria
    const communityMultiplier = this.calculateCommunityMultiplier(user, community);
    
    // Aplicar límite máximo
    const totalMultiplier = Math.min(
      this.maxMultiplier,
      reputationMultiplier * streakMultiplier * communityMultiplier
    );
    
    const finalAmount = Math.round(baseAmount * totalMultiplier);
    
    return {
      baseAmount,
      reputationMultiplier,
      streakMultiplier,
      communityMultiplier,
      finalAmount,
      factors: {
        reputation: reputationMultiplier,
        streak: streakMultiplier,
        community: communityMultiplier,
        base: baseAmount
      }
    };
  }

  /**
   * Calcular multiplicador por contribución comunitaria
   */
  private calculateCommunityMultiplier(user: UBIUser, community: UBICommunity): number {
    const userActivity = this.getUserActivityScore(user);
    const communityAverage = this.getCommunityAverageActivity(community);
    
    // Si el usuario está por encima del promedio, recibe bonus
    if (userActivity > communityAverage) {
      return Math.min(1.3, 1 + ((userActivity - communityAverage) / 100));
    }
    
    return 1.0;
  }

  /**
   * Obtener score de actividad del usuario
   */
  private getUserActivityScore(user: UBIUser): number {
    const recentClaims = user.claimHistory.filter(
      claim => claim.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );
    
    const consistency = recentClaims.length / 30;
    const averageAmount = recentClaims.reduce((sum, claim) => sum + claim.amount, 0) / recentClaims.length;
    
    return (consistency * 50) + (averageAmount * 0.1);
  }

  /**
   * Obtener promedio de actividad de la comunidad
   */
  private getCommunityAverageActivity(community: UBICommunity): number {
    const activities = community.members.map(member => this.getUserActivityScore(member));
    return activities.reduce((sum, activity) => sum + activity, 0) / activities.length;
  }

  /**
   * Verificar elegibilidad para claim
   */
  isEligibleForClaim(user: UBIUser): { eligible: boolean; reason?: string; nextEligible?: Date } {
    const now = new Date();
    const lastClaim = user.lastClaimDate;
    const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
    
    // Debe haber pasado al menos 24 horas
    if (hoursSinceLastClaim < 24) {
      const nextEligible = new Date(lastClaim.getTime() + 24 * 60 * 60 * 1000);
      return {
        eligible: false,
        reason: 'Debes esperar 24 horas entre claims',
        nextEligible
      };
    }
    
    // Verificar reputación mínima
    if (user.reputationScore < 20) {
      return {
        eligible: false,
        reason: 'Reputación insuficiente. Participa más en la comunidad'
      };
    }
    
    return { eligible: true };
  }

  /**
   * Procesar claim de UBI
   */
  async processUBIClaim(user: UBIUser, community: UBICommunity): Promise<{
    success: boolean;
    claim?: UBIClaim;
    error?: string;
  }> {
    try {
      // Verificar elegibilidad
      const eligibility = this.isEligibleForClaim(user);
      if (!eligibility.eligible) {
        return {
          success: false,
          error: eligibility.reason
        };
      }
      
      // Calcular UBI personalizado
      const calculation = this.calculatePersonalizedUBI(user, community);
      
      // Crear claim
      const claim: UBIClaim = {
        id: `claim_${Date.now()}_${user.id}`,
        userId: user.id,
        amount: calculation.finalAmount,
        timestamp: new Date(),
        multiplier: calculation.finalAmount / calculation.baseAmount,
        reason: 'daily'
      };
      
      // Aplicar bonus por racha
      if (user.streak >= 7) {
        claim.reason = 'streak';
        claim.amount = Math.round(claim.amount * 1.2); // 20% bonus por racha de 7+ días
      }
      
      return {
        success: true,
        claim
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error procesando claim'
      };
    }
  }

  /**
   * Distribuir UBI comunitario
   */
  async distributeCommunityUBI(community: UBICommunity, totalAmount: number): Promise<{
    distribution: Record<string, number>;
    success: boolean;
    error?: string;
  }> {
    try {
      const distribution: Record<string, number> = {};
      const eligibleMembers = community.members.filter(member => member.eligibility);
      
      if (eligibleMembers.length === 0) {
        return {
          distribution: {},
          success: false,
          error: 'No hay miembros elegibles'
        };
      }
      
      // Calcular pesos basados en reputación y actividad
      const weights = eligibleMembers.map(member => {
        const activityScore = this.getUserActivityScore(member);
        const reputationWeight = member.reputationScore / 100;
        const activityWeight = Math.min(activityScore / 100, 1);
        
        return reputationWeight * 0.6 + activityWeight * 0.4;
      });
      
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      
      // Distribuir proporcionalmente
      eligibleMembers.forEach((member, index) => {
        const weight = weights[index];
        const share = (weight / totalWeight) * totalAmount;
        distribution[member.id] = Math.round(share);
      });
      
      return {
        distribution,
        success: true
      };
    } catch (error) {
      return {
        distribution: {},
        success: false,
        error: error instanceof Error ? error.message : 'Error en distribución'
      };
    }
  }

  /**
   * Obtener estadísticas de UBI
   */
  getUBIStats(community: UBICommunity): {
    totalMembers: number;
    eligibleMembers: number;
    totalClaimed: number;
    averageClaim: number;
    topContributors: Array<{ user: UBIUser; score: number }>;
  } {
    const eligibleMembers = community.members.filter(member => member.eligibility);
    const totalClaimed = community.members.reduce(
      (sum, member) => sum + member.totalClaimed, 0
    );
    const averageClaim = totalClaimed / community.members.length;
    
    const topContributors = community.members
      .map(member => ({
        user: member,
        score: this.getUserActivityScore(member)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    return {
      totalMembers: community.members.length,
      eligibleMembers: eligibleMembers.length,
      totalClaimed,
      averageClaim,
      topContributors
    };
  }

  /**
   * Crear comunidad UBI
   */
  createCommunity(name: string, creator: UBIUser): UBICommunity {
    return {
      id: `community_${Date.now()}`,
      name,
      members: [creator],
      totalPool: 0,
      distributionRules: [
        {
          id: 'reputation_rule',
          type: 'reputation',
          weight: 0.6,
          minValue: 20,
          maxValue: 100
        },
        {
          id: 'activity_rule',
          type: 'activity',
          weight: 0.4,
          minValue: 0,
          maxValue: 100
        }
      ],
      createdAt: new Date()
    };
  }
}

// Instancia singleton
let enhancedGoodDollar: EnhancedGoodDollar | null = null;

export function getEnhancedGoodDollar(): EnhancedGoodDollar {
  if (!enhancedGoodDollar) {
    enhancedGoodDollar = new EnhancedGoodDollar();
  }
  return enhancedGoodDollar;
}
