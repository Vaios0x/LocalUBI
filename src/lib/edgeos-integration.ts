/**
 * EdgeOS Integration for Civic Tech
 * Network Societies and Civic Technology
 */

export interface CivicProject {
  id: string;
  name: string;
  description: string;
  category: 'governance' | 'infrastructure' | 'social' | 'environmental';
  location: {
    city: string;
    state: string;
    coordinates: [number, number];
  };
  stakeholders: string[];
  budget: number;
  status: 'proposed' | 'voting' | 'approved' | 'in_progress' | 'completed';
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  createdAt: Date;
  deadline: Date;
}

export interface NetworkSociety {
  id: string;
  name: string;
  description: string;
  members: string[];
  governance: {
    type: 'direct' | 'representative' | 'hybrid';
    votingPower: Record<string, number>;
    quorum: number;
  };
  treasury: {
    balance: number;
    currency: string;
    allocations: Array<{
      projectId: string;
      amount: number;
      status: 'pending' | 'approved' | 'rejected';
    }>;
  };
  projects: string[];
  createdAt: Date;
}

export interface CivicVote {
  id: string;
  voterId: string;
  projectId: string;
  societyId: string;
  vote: 'for' | 'against' | 'abstain';
  weight: number;
  timestamp: Date;
  signature: string;
}

export class EdgeOSService {
  private apiUrl: string;
  private networkId: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_EDGEOS_API_URL || 'https://api.edgecity.live';
    this.networkId = process.env.NEXT_PUBLIC_EDGEOS_NETWORK_ID || 'edgeos-mainnet';
  }

  /**
   * Crear proyecto cívico
   */
  async createCivicProject(
    name: string,
    description: string,
    category: string,
    location: { city: string; state: string; coordinates: [number, number] },
    budget: number,
    deadline: Date
  ): Promise<CivicProject> {
    const project: CivicProject = {
      id: `project_${Date.now()}`,
      name,
      description,
      category: category as any,
      location,
      stakeholders: [],
      budget,
      status: 'proposed',
      votes: { for: 0, against: 0, abstain: 0 },
      createdAt: new Date(),
      deadline
    };

    await this.submitProjectToNetwork(project);
    return project;
  }

  /**
   * Crear sociedad de red
   */
  async createNetworkSociety(
    name: string,
    description: string,
    governanceType: 'direct' | 'representative' | 'hybrid',
    quorum: number
  ): Promise<NetworkSociety> {
    const society: NetworkSociety = {
      id: `society_${Date.now()}`,
      name,
      description,
      members: [],
      governance: {
        type: governanceType,
        votingPower: {},
        quorum
      },
      treasury: {
        balance: 0,
        currency: 'USD',
        allocations: []
      },
      projects: [],
      createdAt: new Date()
    };

    await this.registerSocietyOnNetwork(society);
    return society;
  }

  /**
   * Votar en proyecto cívico
   */
  async voteOnProject(
    projectId: string,
    societyId: string,
    voterId: string,
    vote: 'for' | 'against' | 'abstain',
    weight: number = 1
  ): Promise<CivicVote> {
    const civicVote: CivicVote = {
      id: `vote_${Date.now()}`,
      voterId,
      projectId,
      societyId,
      vote,
      weight,
      timestamp: new Date(),
      signature: await this.signVote(voterId, projectId, vote)
    };

    await this.submitVoteToNetwork(civicVote);
    return civicVote;
  }

  /**
   * Obtener proyectos por categoría
   */
  async getProjectsByCategory(category: string): Promise<CivicProject[]> {
    try {
      const response = await fetch(`${this.apiUrl}/projects/category/${category}`);
      const data = await response.json();
      return data.projects || [];
    } catch (error) {
      console.error('Error fetching projects by category:', error);
      return [];
    }
  }

  /**
   * Obtener sociedades de red
   */
  async getNetworkSocieties(): Promise<NetworkSociety[]> {
    try {
      const response = await fetch(`${this.apiUrl}/societies`);
      const data = await response.json();
      return data.societies || [];
    } catch (error) {
      console.error('Error fetching network societies:', error);
      return [];
    }
  }

  /**
   * Obtener resultados de votación
   */
  async getVotingResults(projectId: string): Promise<{
    project: CivicProject;
    votes: CivicVote[];
    totalVotes: number;
    participation: number;
    result: 'approved' | 'rejected' | 'pending';
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/projects/${projectId}/results`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching voting results:', error);
      return {
        project: {} as CivicProject,
        votes: [],
        totalVotes: 0,
        participation: 0,
        result: 'pending'
      };
    }
  }

  /**
   * Asignar fondos del tesoro
   */
  async allocateTreasuryFunds(
    societyId: string,
    projectId: string,
    amount: number
  ): Promise<{ success: boolean; transactionHash?: string; error?: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/societies/${societyId}/allocate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          amount,
          currency: 'USD'
        })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error allocating funds'
      };
    }
  }

  /**
   * Obtener métricas de participación
   */
  async getParticipationMetrics(societyId: string): Promise<{
    totalMembers: number;
    activeVoters: number;
    participationRate: number;
    totalProjects: number;
    completedProjects: number;
    totalBudget: number;
    allocatedBudget: number;
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/societies/${societyId}/metrics`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching participation metrics:', error);
      return {
        totalMembers: 0,
        activeVoters: 0,
        participationRate: 0,
        totalProjects: 0,
        completedProjects: 0,
        totalBudget: 0,
        allocatedBudget: 0
      };
    }
  }

  // Métodos privados
  private async submitProjectToNetwork(project: CivicProject): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
    } catch (error) {
      console.error('Error submitting project to network:', error);
    }
  }

  private async registerSocietyOnNetwork(society: NetworkSociety): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/societies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(society)
      });
    } catch (error) {
      console.error('Error registering society on network:', error);
    }
  }

  private async signVote(voterId: string, projectId: string, vote: string): Promise<string> {
    // Simular firma de voto
    const payload = `${voterId}_${projectId}_${vote}_${Date.now()}`;
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload));
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async submitVoteToNetwork(vote: CivicVote): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/votes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vote)
      });
    } catch (error) {
      console.error('Error submitting vote to network:', error);
    }
  }
}

// Instancia singleton
let edgeOSService: EdgeOSService | null = null;

export function getEdgeOSService(): EdgeOSService {
  if (!edgeOSService) {
    edgeOSService = new EdgeOSService();
  }
  return edgeOSService;
}
