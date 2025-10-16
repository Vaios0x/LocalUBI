/**
 * Numbers Protocol Integration
 * ERC-7053 commits para verificación de transacciones
 */

export interface ReceiptProof {
  nid: string;
  eventType: 'tanda_contribution' | 'ubi_claim' | 'payment_received' | 'rental_payment' | 'gpu_usage';
  timestamp: Date;
  amount: number;
  proof: string;
  metadata: Record<string, any>;
  cid?: string; // Content ID para archivos
}

export interface RentalReceipt {
  nid: string;
  propertyId: string;
  tenantId: string;
  landlordId: string;
  amount: number;
  currency: string;
  paymentDate: Date;
  proof: string;
  inspectionPhotos?: string[];
  contractHash: string;
}

export interface GPUUsageReceipt {
  nid: string;
  jobId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  gpuHours: number;
  taskType: 'ai_training' | 'rendering' | 'mining' | 'research';
  outputHash: string;
  proof: string;
}

export class NumbersProtocolService {
  private networkUrl: string;
  private apiKey: string;

  constructor() {
    this.networkUrl = process.env.NEXT_PUBLIC_NUMBERS_NETWORK_URL || 'https://numbers-mainnet.avax.network';
    this.apiKey = process.env.NUMBERS_API_KEY || '';
  }

  /**
   * Crear recibo de pago de tanda
   */
  async createTandaReceipt(
    tandaId: string,
    memberId: string,
    amount: number,
    round: number
  ): Promise<ReceiptProof> {
    const nid = `tanda_${tandaId}_${memberId}_${Date.now()}`;
    
    const receipt: ReceiptProof = {
      nid,
      eventType: 'tanda_contribution',
      timestamp: new Date(),
      amount,
      proof: await this.generateProof(nid, { tandaId, memberId, amount, round }),
      metadata: {
        tandaId,
        memberId,
        round,
        network: 'celo',
        contractAddress: process.env.NEXT_PUBLIC_TANDA_ADDRESS
      }
    };

    await this.commitToNumbers(receipt);
    return receipt;
  }

  /**
   * Crear recibo de claim UBI
   */
  async createUBIReceipt(
    userId: string,
    amount: number,
    multiplier: number
  ): Promise<ReceiptProof> {
    const nid = `ubi_${userId}_${Date.now()}`;
    
    const receipt: ReceiptProof = {
      nid,
      eventType: 'ubi_claim',
      timestamp: new Date(),
      amount,
      proof: await this.generateProof(nid, { userId, amount, multiplier }),
      metadata: {
        userId,
        multiplier,
        network: 'celo',
        goodDollarAddress: process.env.NEXT_PUBLIC_GOODDOLLAR_ADDRESS
      }
    };

    await this.commitToNumbers(receipt);
    return receipt;
  }

  /**
   * Crear recibo de pago de renta
   */
  async createRentalReceipt(
    propertyId: string,
    tenantId: string,
    landlordId: string,
    amount: number,
    contractHash: string
  ): Promise<RentalReceipt> {
    const nid = `rental_${propertyId}_${tenantId}_${Date.now()}`;
    
    const receipt: RentalReceipt = {
      nid,
      propertyId,
      tenantId,
      landlordId,
      amount,
      currency: 'USD',
      paymentDate: new Date(),
      proof: await this.generateProof(nid, { propertyId, tenantId, landlordId, amount }),
      contractHash
    };

    await this.commitRentalToNumbers(receipt);
    return receipt;
  }

  /**
   * Crear recibo de uso de GPU
   */
  async createGPUReceipt(
    jobId: string,
    userId: string,
    startTime: Date,
    endTime: Date,
    taskType: string,
    outputHash: string
  ): Promise<GPUUsageReceipt> {
    const nid = `gpu_${jobId}_${Date.now()}`;
    const gpuHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    
    const receipt: GPUUsageReceipt = {
      nid,
      jobId,
      userId,
      startTime,
      endTime,
      gpuHours,
      taskType: taskType as any,
      outputHash,
      proof: await this.generateProof(nid, { jobId, userId, gpuHours, outputHash })
    };

    await this.commitGPUToNumbers(receipt);
    return receipt;
  }

  /**
   * Obtener historial de recibos por NID
   */
  async getReceiptHistory(nid: string): Promise<ReceiptProof[]> {
    try {
      const response = await fetch(`${this.networkUrl}/api/receipts/${nid}`);
      const data = await response.json();
      return data.receipts || [];
    } catch (error) {
      console.error('Error fetching receipt history:', error);
      return [];
    }
  }

  /**
   * Verificar autenticidad de recibo
   */
  async verifyReceipt(receipt: ReceiptProof): Promise<boolean> {
    try {
      const response = await fetch(`${this.networkUrl}/api/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          nid: receipt.nid,
          proof: receipt.proof,
          metadata: receipt.metadata
        })
      });
      
      const result = await response.json();
      return result.verified;
    } catch (error) {
      console.error('Error verifying receipt:', error);
      return false;
    }
  }

  /**
   * Generar prueba criptográfica
   */
  private async generateProof(nid: string, data: any): Promise<string> {
    // Simular generación de prueba criptográfica
    const payload = JSON.stringify({ nid, data, timestamp: Date.now() });
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(payload));
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Commit a Numbers Network
   */
  private async commitToNumbers(receipt: ReceiptProof): Promise<void> {
    try {
      await fetch(`${this.networkUrl}/api/commit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(receipt)
      });
    } catch (error) {
      console.error('Error committing to Numbers:', error);
    }
  }

  /**
   * Commit recibo de renta
   */
  private async commitRentalToNumbers(receipt: RentalReceipt): Promise<void> {
    try {
      await fetch(`${this.networkUrl}/api/rental/commit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(receipt)
      });
    } catch (error) {
      console.error('Error committing rental receipt:', error);
    }
  }

  /**
   * Commit recibo de GPU
   */
  private async commitGPUToNumbers(receipt: GPUUsageReceipt): Promise<void> {
    try {
      await fetch(`${this.networkUrl}/api/gpu/commit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(receipt)
      });
    } catch (error) {
      console.error('Error committing GPU receipt:', error);
    }
  }
}

// Instancia singleton
let numbersService: NumbersProtocolService | null = null;

export function getNumbersService(): NumbersProtocolService {
  if (!numbersService) {
    numbersService = new NumbersProtocolService();
  }
  return numbersService;
}
