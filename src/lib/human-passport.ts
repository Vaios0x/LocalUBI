/**
 * Human Passport Integration
 * Portable Keycard Identity System
 */

export interface HumanPassport {
  id: string;
  holderId: string;
  credentials: Credential[];
  attestations: Attestation[];
  status: 'active' | 'suspended' | 'revoked';
  createdAt: Date;
  lastUpdated: Date;
  expirationDate?: Date;
}

export interface Credential {
  id: string;
  type: 'identity' | 'education' | 'employment' | 'health' | 'financial' | 'social';
  issuer: string;
  subject: string;
  claims: Record<string, any>;
  proof: string;
  issuedAt: Date;
  expiresAt?: Date;
  revoked: boolean;
}

export interface Attestation {
  id: string;
  attesterId: string;
  subjectId: string;
  claim: string;
  evidence: string[];
  confidence: number;
  timestamp: Date;
  signature: string;
}

export interface KeycardIdentity {
  cardId: string;
  holderId: string;
  publicKey: string;
  privateKey: string; // Encriptada
  credentials: string[];
  biometricHash: string;
  nfcData: string;
  status: 'active' | 'blocked' | 'lost';
  createdAt: Date;
}

export interface IdentityProof {
  id: string;
  holderId: string;
  claim: string;
  proof: string;
  verifier: string;
  timestamp: Date;
  valid: boolean;
}

export class HumanPassportService {
  private apiUrl: string;
  private networkId: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_HUMAN_PASSPORT_API_URL || 'https://api.human.tech';
    this.networkId = process.env.NEXT_PUBLIC_HUMAN_NETWORK_ID || 'human-mainnet';
  }

  /**
   * Crear pasaporte humano
   */
  async createHumanPassport(
    holderId: string,
    initialCredentials: Credential[] = []
  ): Promise<HumanPassport> {
    const passport: HumanPassport = {
      id: `passport_${Date.now()}`,
      holderId,
      credentials: initialCredentials,
      attestations: [],
      status: 'active',
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    await this.registerPassportOnNetwork(passport);
    return passport;
  }

  /**
   * Emitir credencial
   */
  async issueCredential(
    passportId: string,
    type: string,
    issuer: string,
    subject: string,
    claims: Record<string, any>,
    expiresAt?: Date
  ): Promise<Credential> {
    const credential: Credential = {
      id: `credential_${Date.now()}`,
      type: type as any,
      issuer,
      subject,
      claims,
      proof: await this.generateCredentialProof(issuer, subject, claims),
      issuedAt: new Date(),
      expiresAt,
      revoked: false
    };

    await this.addCredentialToPassport(passportId, credential);
    return credential;
  }

  /**
   * Crear identidad de tarjeta clave
   */
  async createKeycardIdentity(
    holderId: string,
    biometricData: string
  ): Promise<KeycardIdentity> {
    const keyPair = await this.generateKeyPair();
    const biometricHash = await this.hashData(biometricData);
    
    const keycard: KeycardIdentity = {
      cardId: `keycard_${Date.now()}`,
      holderId,
      publicKey: keyPair.publicKey,
      privateKey: await this.encryptPrivateKey(keyPair.privateKey, biometricHash),
      credentials: [],
      biometricHash,
      nfcData: await this.generateNFCData(holderId, keyPair.publicKey),
      status: 'active',
      createdAt: new Date()
    };

    await this.registerKeycardOnNetwork(keycard);
    return keycard;
  }

  /**
   * Verificar identidad sin revelar datos
   */
  async verifyIdentity(
    passportId: string,
    claim: string,
    verifier: string
  ): Promise<IdentityProof> {
    const passport = await this.getPassport(passportId);
    if (!passport) {
      throw new Error('Passport not found');
    }

    const proof = await this.generateZeroKnowledgeProof(passport, claim);
    
    const identityProof: IdentityProof = {
      id: `proof_${Date.now()}`,
      holderId: passport.holderId,
      claim,
      proof,
      verifier,
      timestamp: new Date(),
      valid: true
    };

    await this.storeProofOnNetwork(identityProof);
    return identityProof;
  }

  /**
   * Crear atestación
   */
  async createAttestation(
    attesterId: string,
    subjectId: string,
    claim: string,
    evidence: string[],
    confidence: number
  ): Promise<Attestation> {
    const attestation: Attestation = {
      id: `attestation_${Date.now()}`,
      attesterId,
      subjectId,
      claim,
      evidence,
      confidence,
      timestamp: new Date(),
      signature: await this.signAttestation(attesterId, subjectId, claim)
    };

    await this.submitAttestationToNetwork(attestation);
    return attestation;
  }

  /**
   * Verificar credencial
   */
  async verifyCredential(
    credentialId: string,
    verifier: string
  ): Promise<{
    valid: boolean;
    claims: Record<string, any>;
    issuer: string;
    issuedAt: Date;
    expiresAt?: Date;
  }> {
    try {
      const credential = await this.getCredential(credentialId);
      if (!credential) {
        return {
          valid: false,
          claims: {},
          issuer: '',
          issuedAt: new Date()
        };
      }

      const isValid = await this.verifyCredentialProof(credential);
      const isExpired = credential.expiresAt ? new Date() > credential.expiresAt : false;
      const isRevoked = credential.revoked;

      return {
        valid: isValid && !isExpired && !isRevoked,
        claims: credential.claims,
        issuer: credential.issuer,
        issuedAt: credential.issuedAt,
        expiresAt: credential.expiresAt
      };
    } catch (error) {
      console.error('Error verifying credential:', error);
      return {
        valid: false,
        claims: {},
        issuer: '',
        issuedAt: new Date()
      };
    }
  }

  /**
   * Obtener pasaporte
   */
  async getPassport(passportId: string): Promise<HumanPassport | null> {
    try {
      const response = await fetch(`${this.apiUrl}/passports/${passportId}`);
      const data = await response.json();
      return data.passport || null;
    } catch (error) {
      console.error('Error fetching passport:', error);
      return null;
    }
  }

  /**
   * Obtener credencial
   */
  async getCredential(credentialId: string): Promise<Credential | null> {
    try {
      const response = await fetch(`${this.apiUrl}/credentials/${credentialId}`);
      const data = await response.json();
      return data.credential || null;
    } catch (error) {
      console.error('Error fetching credential:', error);
      return null;
    }
  }

  /**
   * Revocar credencial
   */
  async revokeCredential(credentialId: string, reason: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/credentials/${credentialId}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error revoking credential:', error);
      return false;
    }
  }

  /**
   * Obtener historial de verificaciones
   */
  async getVerificationHistory(passportId: string): Promise<IdentityProof[]> {
    try {
      const response = await fetch(`${this.apiUrl}/passports/${passportId}/verifications`);
      const data = await response.json();
      return data.verifications || [];
    } catch (error) {
      console.error('Error fetching verification history:', error);
      return [];
    }
  }

  // Métodos privados
  private async registerPassportOnNetwork(passport: HumanPassport): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/passports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passport)
      });
    } catch (error) {
      console.error('Error registering passport on network:', error);
    }
  }

  private async addCredentialToPassport(passportId: string, credential: Credential): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/passports/${passportId}/credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credential)
      });
    } catch (error) {
      console.error('Error adding credential to passport:', error);
    }
  }

  private async registerKeycardOnNetwork(keycard: KeycardIdentity): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/keycards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keycard)
      });
    } catch (error) {
      console.error('Error registering keycard on network:', error);
    }
  }

  private async generateCredentialProof(
    issuer: string,
    subject: string,
    claims: Record<string, any>
  ): Promise<string> {
    const payload = { issuer, subject, claims, timestamp: Date.now() };
    return await this.hashData(payload);
  }

  private async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    // Simular generación de par de claves
    return {
      publicKey: `pub_${Date.now()}`,
      privateKey: `priv_${Date.now()}`
    };
  }

  private async encryptPrivateKey(privateKey: string, biometricHash: string): Promise<string> {
    // Simular encriptación de clave privada con hash biométrico
    return `encrypted_${privateKey}_${biometricHash}`;
  }

  private async generateNFCData(holderId: string, publicKey: string): Promise<string> {
    // Simular generación de datos NFC
    return `nfc_${holderId}_${publicKey}`;
  }

  private async generateZeroKnowledgeProof(
    passport: HumanPassport,
    claim: string
  ): Promise<string> {
    // Simular prueba de conocimiento cero
    const payload = {
      passportId: passport.id,
      holderId: passport.holderId,
      claim,
      credentials: passport.credentials.length,
      timestamp: Date.now()
    };
    
    return await this.hashData(payload);
  }

  private async signAttestation(
    attesterId: string,
    subjectId: string,
    claim: string
  ): Promise<string> {
    const payload = { attesterId, subjectId, claim, timestamp: Date.now() };
    return await this.hashData(payload);
  }

  private async verifyCredentialProof(credential: Credential): Promise<boolean> {
    // Simular verificación de prueba de credencial
    return Math.random() > 0.1; // 90% de éxito
  }

  private async storeProofOnNetwork(proof: IdentityProof): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/proofs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proof)
      });
    } catch (error) {
      console.error('Error storing proof on network:', error);
    }
  }

  private async submitAttestationToNetwork(attestation: Attestation): Promise<void> {
    try {
      await fetch(`${this.apiUrl}/attestations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attestation)
      });
    } catch (error) {
      console.error('Error submitting attestation to network:', error);
    }
  }

  private async hashData(data: any): Promise<string> {
    const encoder = new TextEncoder();
    const dataStr = JSON.stringify(data);
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(dataStr));
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

// Instancia singleton
let humanPassportService: HumanPassportService | null = null;

export function getHumanPassportService(): HumanPassportService {
  if (!humanPassportService) {
    humanPassportService = new HumanPassportService();
  }
  return humanPassportService;
}
