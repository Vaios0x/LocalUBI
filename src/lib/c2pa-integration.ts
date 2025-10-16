/**
 * C2PA Integration for Content Provenance
 * Content Authenticity Initiative (CAI) implementation
 */

export interface C2PAManifest {
  id: string;
  version: string;
  claim_generator: string;
  claim_generator_info: string;
  assertions: C2PAAssertion[];
  ingredients: C2PAIngredient[];
  created_at: string;
  modified_at: string;
}

export interface C2PAAssertion {
  label: string;
  data: any;
  hash: string;
  url?: string;
}

export interface C2PAIngredient {
  title: string;
  format: string;
  hash: string;
  length: number;
  url?: string;
}

export interface ContentProvenance {
  contentId: string;
  author: string;
  createdAt: Date;
  modifiedAt: Date;
  source: string;
  verification: {
    c2pa: boolean;
    blockchain: boolean;
    signature: string;
  };
  metadata: Record<string, any>;
}

export class C2PAService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.C2PA_API_KEY || '';
    this.baseUrl = process.env.C2PA_BASE_URL || 'https://api.c2pa.org';
  }

  /**
   * Firmar imagen con metadata de provenance
   */
  async signImage(
    imageFile: File,
    metadata: {
      author: string;
      source: string;
      location?: string;
      timestamp: Date;
      device?: string;
    }
  ): Promise<{ signedImage: Blob; manifest: C2PAManifest }> {
    try {
      // Crear manifest C2PA
      const manifest = await this.createManifest(metadata);
      
      // Firmar imagen con manifest
      const signedImage = await this.signImageWithManifest(imageFile, manifest);
      
      return { signedImage, manifest };
    } catch (error) {
      console.error('Error signing image:', error);
      throw error;
    }
  }

  /**
   * Verificar autenticidad de imagen
   */
  async verifyImage(imageFile: File): Promise<{
    isValid: boolean;
    manifest?: C2PAManifest;
    provenance?: ContentProvenance;
    errors?: string[];
  }> {
    try {
      // Extraer manifest de la imagen
      const manifest = await this.extractManifest(imageFile);
      
      if (!manifest) {
        return { isValid: false, errors: ['No C2PA manifest found'] };
      }

      // Verificar integridad del manifest
      const isValid = await this.verifyManifest(manifest);
      
      if (!isValid) {
        return { isValid: false, errors: ['Invalid C2PA manifest'] };
      }

      // Crear provenance data
      const provenance = await this.createProvenanceFromManifest(manifest);
      
      return { isValid: true, manifest, provenance };
    } catch (error) {
      console.error('Error verifying image:', error);
      return { 
        isValid: false, 
        errors: [error instanceof Error ? error.message : 'Unknown error'] 
      };
    }
  }

  /**
   * Crear manifest para contenido generado por IA
   */
  async createAIGeneratedManifest(
    content: string,
    aiModel: string,
    prompt: string,
    parameters: Record<string, any>
  ): Promise<C2PAManifest> {
    const manifest: C2PAManifest = {
      id: `ai_${Date.now()}`,
      version: '1.0',
      claim_generator: 'LocalUBI AI Generator',
      claim_generator_info: 'AI content generation with provenance',
      assertions: [
        {
          label: 'ai.generated',
          data: {
            model: aiModel,
            prompt: prompt,
            parameters: parameters,
            generated_at: new Date().toISOString()
          },
          hash: await this.hashData({ model: aiModel, prompt, parameters })
        },
        {
          label: 'content.original',
          data: {
            type: 'text',
            length: content.length,
            created_at: new Date().toISOString()
          },
          hash: await this.hashData(content)
        }
      ],
      ingredients: [],
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString()
    };

    return manifest;
  }

  /**
   * Firmar video con metadata
   */
  async signVideo(
    videoFile: File,
    metadata: {
      author: string;
      location: string;
      timestamp: Date;
      duration: number;
      resolution: string;
    }
  ): Promise<{ signedVideo: Blob; manifest: C2PAManifest }> {
    try {
      const manifest = await this.createVideoManifest(metadata);
      const signedVideo = await this.signVideoWithManifest(videoFile, manifest);
      
      return { signedVideo, manifest };
    } catch (error) {
      console.error('Error signing video:', error);
      throw error;
    }
  }

  /**
   * Crear manifest para contenido de renta
   */
  async createRentalManifest(
    propertyData: {
      address: string;
      landlord: string;
      tenant: string;
      rentAmount: number;
      contractHash: string;
    },
    photos: File[]
  ): Promise<C2PAManifest> {
    const manifest: C2PAManifest = {
      id: `rental_${Date.now()}`,
      version: '1.0',
      claim_generator: 'LocalUBI Rental System',
      claim_generator_info: 'Rental property documentation with provenance',
      assertions: [
        {
          label: 'rental.property',
          data: {
            address: propertyData.address,
            landlord: propertyData.landlord,
            tenant: propertyData.tenant,
            rent_amount: propertyData.rentAmount,
            contract_hash: propertyData.contractHash,
            documented_at: new Date().toISOString()
          },
          hash: await this.hashData(propertyData)
        },
        {
          label: 'rental.photos',
          data: {
            count: photos.length,
            formats: photos.map(p => p.type),
            captured_at: new Date().toISOString()
          },
          hash: await this.hashData(photos.map(p => p.name))
        }
      ],
      ingredients: await Promise.all(photos.map(async (photo, index) => ({
        title: `rental_photo_${index + 1}`,
        format: photo.type,
        hash: await this.hashFile(photo),
        length: photo.size
      }))),
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString()
    };

    return manifest;
  }

  /**
   * Verificar cadena de custody
   */
  async verifyCustodyChain(manifest: C2PAManifest): Promise<{
    isValid: boolean;
    chain: string[];
    gaps: string[];
  }> {
    try {
      const chain: string[] = [];
      const gaps: string[] = [];
      
      // Verificar cada assertion
      for (const assertion of manifest.assertions) {
        const isValid = await this.verifyAssertion(assertion);
        if (isValid) {
          chain.push(assertion.label);
        } else {
          gaps.push(assertion.label);
        }
      }
      
      return {
        isValid: gaps.length === 0,
        chain,
        gaps
      };
    } catch (error) {
      console.error('Error verifying custody chain:', error);
      return { isValid: false, chain: [], gaps: ['Verification failed'] };
    }
  }

  // Métodos privados
  private async createManifest(metadata: any): Promise<C2PAManifest> {
    return {
      id: `manifest_${Date.now()}`,
      version: '1.0',
      claim_generator: 'LocalUBI C2PA Service',
      claim_generator_info: 'Content provenance for LocalUBI',
      assertions: [
        {
          label: 'content.original',
          data: metadata,
          hash: await this.hashData(metadata)
        }
      ],
      ingredients: [],
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString()
    };
  }

  private async signImageWithManifest(imageFile: File, manifest: C2PAManifest): Promise<Blob> {
    // Simular firma de imagen con manifest
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('manifest', JSON.stringify(manifest));
    
    const response = await fetch(`${this.baseUrl}/api/sign`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      body: formData
    });
    
    return await response.blob();
  }

  private async extractManifest(imageFile: File): Promise<C2PAManifest | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/extract`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${this.apiKey}` },
        body: imageFile
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  private async verifyManifest(manifest: C2PAManifest): Promise<boolean> {
    // Verificar integridad del manifest
    for (const assertion of manifest.assertions) {
      const isValid = await this.verifyAssertion(assertion);
      if (!isValid) return false;
    }
    return true;
  }

  private async verifyAssertion(assertion: C2PAAssertion): Promise<boolean> {
    // Verificar assertion individual
    const expectedHash = await this.hashData(assertion.data);
    return expectedHash === assertion.hash;
  }

  private async createProvenanceFromManifest(manifest: C2PAManifest): Promise<ContentProvenance> {
    const originalAssertion = manifest.assertions.find(a => a.label === 'content.original');
    
    return {
      contentId: manifest.id,
      author: originalAssertion?.data.author || 'Unknown',
      createdAt: new Date(manifest.created_at),
      modifiedAt: new Date(manifest.modified_at),
      source: originalAssertion?.data.source || 'Unknown',
      verification: {
        c2pa: true,
        blockchain: false,
        signature: manifest.id
      },
      metadata: originalAssertion?.data || {}
    };
  }

  private async createVideoManifest(metadata: any): Promise<C2PAManifest> {
    return {
      id: `video_${Date.now()}`,
      version: '1.0',
      claim_generator: 'LocalUBI Video Service',
      claim_generator_info: 'Video content provenance',
      assertions: [
        {
          label: 'video.original',
          data: metadata,
          hash: await this.hashData(metadata)
        }
      ],
      ingredients: [],
      created_at: new Date().toISOString(),
      modified_at: new Date().toISOString()
    };
  }

  private async signVideoWithManifest(videoFile: File, manifest: C2PAManifest): Promise<Blob> {
    // Simular firma de video con manifest
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('manifest', JSON.stringify(manifest));
    
    const response = await fetch(`${this.baseUrl}/api/sign-video`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
      body: formData
    });
    
    return await response.blob();
  }

  private async hashData(data: any): Promise<string> {
    const encoder = new TextEncoder();
    const dataStr = JSON.stringify(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(dataStr));
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async hashFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
}

// Instancia singleton
let c2paService: C2PAService | null = null;

export function getC2PAService(): C2PAService {
  if (!c2paService) {
    c2paService = new C2PAService();
  }
  return c2paService;
}
