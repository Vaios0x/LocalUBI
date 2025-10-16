/**
 * Resilient Activist Technology
 * Technology for activists and human rights defenders
 */

export interface ActivistTool {
  id: string;
  name: string;
  description: string;
  category: 'communication' | 'documentation' | 'security' | 'coordination' | 'evacuation';
  features: string[];
  privacyLevel: 'basic' | 'enhanced' | 'maximum';
  encryption: string[];
  status: 'active' | 'maintenance' | 'deprecated';
  createdAt: Date;
  lastUpdated: Date;
}

export interface SecureCommunication {
  id: string;
  participants: string[];
  encryption: string;
  messageType: 'text' | 'voice' | 'video' | 'file';
  timestamp: Date;
  message: string;
  attachments?: string[];
  metadata: {
    location?: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
  };
}

export interface Documentation {
  id: string;
  title: string;
  content: string;
  type: 'incident' | 'evidence' | 'testimony' | 'report';
  location: {
    coordinates: [number, number];
    address: string;
    timestamp: Date;
  };
  evidence: {
    photos: string[];
    videos: string[];
    audio: string[];
    documents: string[];
  };
  witnesses: string[];
  verified: boolean;
  createdAt: Date;
}

export interface EmergencyProtocol {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  actions: string[];
  contacts: string[];
  resources: string[];
  status: 'active' | 'triggered' | 'resolved';
  createdAt: Date;
}

export interface ActivistNetwork {
  id: string;
  name: string;
  description: string;
  members: string[];
  securityLevel: 'basic' | 'enhanced' | 'maximum';
  communicationChannels: string[];
  emergencyContacts: string[];
  protocols: string[];
  createdAt: Date;
}

export class ActivistTechService {
  private apiUrl: string;
  private encryptionKey: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_ACTIVIST_API_URL || 'https://activist.localubi.mx';
    this.encryptionKey = process.env.ACTIVIST_ENCRYPTION_KEY || '';
  }

  /**
   * Crear herramienta para activistas
   */
  async createActivistTool(
    name: string,
    description: string,
    category: string,
    features: string[],
    privacyLevel: string
  ): Promise<ActivistTool> {
    const tool: ActivistTool = {
      id: `tool_${Date.now()}`,
      name,
      description,
      category: category as any,
      features,
      privacyLevel: privacyLevel as any,
      encryption: this.getEncryptionForPrivacyLevel(privacyLevel),
      status: 'active',
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    await this.registerToolOnNetwork(tool);
    return tool;
  }

  /**
   * Establecer comunicación segura
   */
  async establishSecureCommunication(
    participants: string[],
    messageType: string,
    message: string,
    urgency: string = 'medium',
    location?: string
  ): Promise<SecureCommunication> {
    const communication: SecureCommunication = {
      id: `comm_${Date.now()}`,
      participants,
      encryption: 'AES-256-GCM',
      messageType: messageType as any,
      timestamp: new Date(),
      message: await this.encryptMessage(message),
      metadata: {
        location,
        urgency: urgency as any,
        tags: ['secure', 'encrypted']
      }
    };

    await this.sendSecureMessage(communication);
    return communication;
  }

  /**
   * Documentar incidente
   */
  async documentIncident(
    title: string,
    content: string,
    type: string,
    location: { coordinates: [number, number]; address: string },
    evidence: { photos: string[]; videos: string[]; audio: string[]; documents: string[] },
    witnesses: string[]
  ): Promise<Documentation> {
    const documentation: Documentation = {
      id: `doc_${Date.now()}`,
      title,
      content: await this.encryptContent(content),
      type: type as any,
      location: {
        ...location,
        timestamp: new Date()
      },
      evidence,
      witnesses,
      verified: false,
      createdAt: new Date()
    };

    await this.storeDocumentationSecurely(documentation);
    return documentation;
  }

  /**
   * Crear protocolo de emergencia
   */
  async createEmergencyProtocol(
    name: string,
    description: string,
    triggers: string[],
    actions: string[],
    contacts: string[],
    resources: string[]
  ): Promise<EmergencyProtocol> {
    const protocol: EmergencyProtocol = {
      id: `protocol_${Date.now()}`,
      name,
      description,
      triggers,
      actions,
      contacts,
      resources,
      status: 'active',
      createdAt: new Date()
    };

    await this.registerEmergencyProtocol(protocol);
    return protocol;
  }

  /**
   * Crear red de activistas
   */
  async createActivistNetwork(
    name: string,
    description: string,
    securityLevel: string,
    communicationChannels: string[],
    emergencyContacts: string[]
  ): Promise<ActivistNetwork> {
    const network: ActivistNetwork = {
      id: `network_${Date.now()}`,
      name,
      description,
      members: [],
      securityLevel: securityLevel as any,
      communicationChannels,
      emergencyContacts,
      protocols: [],
      createdAt: new Date()
    };

    await this.registerActivistNetwork(network);
    return network;
  }

  /**
   * Obtener herramientas disponibles
   */
  async getAvailableTools(): Promise<ActivistTool[]> {
    try {
      const response = await fetch(`${this.apiUrl}/tools`);
      const data = await response.json();
      return data.tools || [];
    } catch (error) {
      console.error('Error fetching activist tools:', error);
      return [];
    }
  }

  /**
   * Obtener documentación
   */
  async getDocumentation(filters?: {
    type?: string;
    verified?: boolean;
    dateRange?: { start: Date; end: Date };
  }): Promise<Documentation[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.type) queryParams.append('type', filters.type);
      if (filters?.verified !== undefined) queryParams.append('verified', filters.verified.toString());
      
      const response = await fetch(`${this.apiUrl}/documentation?${queryParams}`);
      const data = await response.json();
      return data.documentation || [];
    } catch (error) {
      console.error('Error fetching documentation:', error);
      return [];
    }
  }

  /**
   * Verificar seguridad de comunicación
   */
  async verifyCommunicationSecurity(communicationId: string): Promise<{
    isSecure: boolean;
    encryptionStrength: number;
    vulnerabilities: string[];
    recommendations: string[];
  }> {
    try {
      // Simular verificación de seguridad
      const encryptionStrength = Math.random() * 40 + 60; // 60-100%
      const isSecure = encryptionStrength > 80;
      
      const vulnerabilities = isSecure ? [] : [
        'Weak encryption detected',
        'Metadata leakage possible',
        'Timing attacks vulnerable'
      ];
      
      const recommendations = [
        'Use end-to-end encryption',
        'Enable perfect forward secrecy',
        'Use secure key exchange'
      ];
      
      return {
        isSecure,
        encryptionStrength,
        vulnerabilities,
        recommendations
      };
    } catch (error) {
      console.error('Error verifying communication security:', error);
      return {
        isSecure: false,
        encryptionStrength: 0,
        vulnerabilities: ['Verification failed'],
        recommendations: ['Check communication settings']
      };
    }
  }

  /**
   * Obtener métricas de red
   */
  async getNetworkMetrics(): Promise<{
    totalTools: number;
    activeCommunications: number;
    documentedIncidents: number;
    emergencyProtocols: number;
    securityScore: number;
  }> {
    try {
      const [tools, communications, documentation, protocols] = await Promise.all([
        this.getAvailableTools(),
        this.getActiveCommunications(),
        this.getDocumentation(),
        this.getEmergencyProtocols()
      ]);
      
      const securityScore = this.calculateSecurityScore(tools, communications);
      
      return {
        totalTools: tools.length,
        activeCommunications: communications.length,
        documentedIncidents: documentation.length,
        emergencyProtocols: protocols.length,
        securityScore
      };
    } catch (error) {
      console.error('Error fetching network metrics:', error);
      return {
        totalTools: 0,
        activeCommunications: 0,
        documentedIncidents: 0,
        emergencyProtocols: 0,
        securityScore: 0
      };
    }
  }

  // Métodos privados
  private getEncryptionForPrivacyLevel(privacyLevel: string): string[] {
    switch (privacyLevel) {
      case 'maximum':
        return ['AES-256-GCM', 'ChaCha20-Poly1305', 'X25519', 'Ed25519'];
      case 'enhanced':
        return ['AES-256-GCM', 'ChaCha20-Poly1305'];
      default:
        return ['AES-256-GCM'];
    }
  }

  private async encryptMessage(message: string): Promise<string> {
    // Simular encriptación de mensaje
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const key = await crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      data
    );
    
    return Array.from(new Uint8Array(encrypted))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async encryptContent(content: string): Promise<string> {
    // Simular encriptación de contenido
    return await this.encryptMessage(content);
  }

  private async registerToolOnNetwork(tool: ActivistTool): Promise<void> {
    // Simular registro de herramienta en la red
    console.log('Registering activist tool:', tool.id);
  }

  private async sendSecureMessage(communication: SecureCommunication): Promise<void> {
    // Simular envío de mensaje seguro
    console.log('Sending secure message:', communication.id);
  }

  private async storeDocumentationSecurely(documentation: Documentation): Promise<void> {
    // Simular almacenamiento seguro de documentación
    console.log('Storing documentation securely:', documentation.id);
  }

  private async registerEmergencyProtocol(protocol: EmergencyProtocol): Promise<void> {
    // Simular registro de protocolo de emergencia
    console.log('Registering emergency protocol:', protocol.id);
  }

  private async registerActivistNetwork(network: ActivistNetwork): Promise<void> {
    // Simular registro de red de activistas
    console.log('Registering activist network:', network.id);
  }

  private async getActiveCommunications(): Promise<SecureCommunication[]> {
    // Simular obtención de comunicaciones activas
    return [];
  }

  private async getEmergencyProtocols(): Promise<EmergencyProtocol[]> {
    // Simular obtención de protocolos de emergencia
    return [];
  }

  private calculateSecurityScore(tools: ActivistTool[], communications: SecureCommunication[]): number {
    const toolSecurity = tools.reduce((sum, tool) => {
      const level = tool.privacyLevel === 'maximum' ? 100 : 
                   tool.privacyLevel === 'enhanced' ? 75 : 50;
      return sum + level;
    }, 0);
    
    const avgToolSecurity = tools.length > 0 ? toolSecurity / tools.length : 0;
    const commSecurity = communications.length > 0 ? 85 : 0; // Asumir comunicaciones seguras
    
    return Math.round((avgToolSecurity + commSecurity) / 2);
  }
}

// Instancia singleton
let activistTechService: ActivistTechService | null = null;

export function getActivistTechService(): ActivistTechService {
  if (!activistTechService) {
    activistTechService = new ActivistTechService();
  }
  return activistTechService;
}
