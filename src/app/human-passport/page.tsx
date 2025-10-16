'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle, User, Key, Eye, AlertCircle } from 'lucide-react';
import { getHumanPassportService } from '@/lib/human-passport';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function HumanPassportPage() {
  const [passport, setPassport] = useState<any>(null);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [keycard, setKeycard] = useState<any>(null);
  const [newCredential, setNewCredential] = useState({
    type: 'identity',
    issuer: '',
    subject: '',
    claims: '',
    expiresAt: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const humanPassportService = getHumanPassportService();

  useEffect(() => {
    initializePassport();
  }, []);

  const initializePassport = async () => {
    try {
      const newPassport = await humanPassportService.createHumanPassport('user_123');
      setPassport(newPassport);
      
      // Crear tarjeta clave
      const newKeycard = await humanPassportService.createKeycardIdentity(
        'user_123',
        'biometric_hash_123'
      );
      setKeycard(newKeycard);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error initializing passport');
    }
  };

  const handleIssueCredential = async () => {
    try {
      setIsCreating(true);
      setError(null);

      if (!passport) return;

      const claims = JSON.parse(newCredential.claims || '{}');
      
      const credential = await humanPassportService.issueCredential(
        passport.id,
        newCredential.type,
        newCredential.issuer,
        newCredential.subject,
        claims,
        newCredential.expiresAt ? new Date(newCredential.expiresAt) : undefined
      );

      setCredentials(prev => [...prev, credential]);
      
      // Limpiar formulario
      setNewCredential({
        type: 'identity',
        issuer: '',
        subject: '',
        claims: '',
        expiresAt: ''
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error issuing credential');
    } finally {
      setIsCreating(false);
    }
  };

  const handleVerifyIdentity = async (credentialId: string) => {
    try {
      const result = await humanPassportService.verifyCredential(credentialId, 'verifier_123');
      
      if (result.valid) {
        alert('Credencial verificada exitosamente');
      } else {
        alert('Credencial no válida o expirada');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying credential');
    }
  };

  const handleCreateAttestation = async (subjectId: string, claim: string) => {
    try {
      const attestation = await humanPassportService.createAttestation(
        'attester_123',
        subjectId,
        claim,
        ['evidence_1', 'evidence_2'],
        0.95
      );
      
      console.log('Attestation created:', attestation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating attestation');
    }
  };

  const getCredentialTypeColor = (type: string) => {
    switch (type) {
      case 'identity': return 'text-blue-400';
      case 'education': return 'text-green-400';
      case 'employment': return 'text-purple-400';
      case 'health': return 'text-red-400';
      case 'financial': return 'text-yellow-400';
      case 'social': return 'text-pink-400';
      default: return 'text-white/60';
    }
  };

  const getCredentialTypeLabel = (type: string) => {
    switch (type) {
      case 'identity': return 'Identidad';
      case 'education': return 'Educación';
      case 'employment': return 'Empleo';
      case 'health': return 'Salud';
      case 'financial': return 'Financiero';
      case 'social': return 'Social';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
              Human Passport
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Identidad portátil y verificable con tarjetas clave NFC
          </p>
        </motion.div>

        {/* Passport Status */}
        {passport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <CreditCard className="w-6 h-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Pasaporte Humano Activo
                  </h3>
                  <p className="text-sm text-white/70">
                    ID: {passport.id} • {credentials.length} credenciales
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">Activo</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Keycard */}
        {keycard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <Key className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Tarjeta Clave NFC
                </h3>
                <p className="text-sm text-white/70">
                  ID: {keycard.cardId}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-white/70">Estado:</span>
                <div className="text-white">
                  {keycard.status === 'active' ? 'Activa' : 'Inactiva'}
                </div>
              </div>
              <div>
                <span className="text-white/70">Credenciales:</span>
                <div className="text-white">
                  {keycard.credentials.length}
                </div>
              </div>
              <div>
                <span className="text-white/70">Biométrico:</span>
                <div className="text-white font-mono text-xs">
                  {keycard.biometricHash.slice(0, 8)}...
                </div>
              </div>
              <div>
                <span className="text-white/70">NFC:</span>
                <div className="text-white font-mono text-xs">
                  {keycard.nfcData.slice(0, 8)}...
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Issue Credential */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Emitir Credencial</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Tipo de Credencial
                </label>
                <select
                  value={newCredential.type}
                  onChange={(e) => setNewCredential(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-green-400"
                >
                  <option value="identity">Identidad</option>
                  <option value="education">Educación</option>
                  <option value="employment">Empleo</option>
                  <option value="health">Salud</option>
                  <option value="financial">Financiero</option>
                  <option value="social">Social</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Emisor
                </label>
                <input
                  type="text"
                  value={newCredential.issuer}
                  onChange={(e) => setNewCredential(prev => ({ ...prev, issuer: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-400"
                  placeholder="Universidad Nacional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Sujeto
                </label>
                <input
                  type="text"
                  value={newCredential.subject}
                  onChange={(e) => setNewCredential(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-400"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Claims (JSON)
                </label>
                <textarea
                  value={newCredential.claims}
                  onChange={(e) => setNewCredential(prev => ({ ...prev, claims: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-400"
                  placeholder='{"degree": "Computer Science", "year": 2023}'
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Fecha de Expiración
                </label>
                <input
                  type="date"
                  value={newCredential.expiresAt}
                  onChange={(e) => setNewCredential(prev => ({ ...prev, expiresAt: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-400"
                />
              </div>

              <button
                onClick={handleIssueCredential}
                disabled={isCreating || !newCredential.issuer || !newCredential.subject}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Emitiendo...' : 'Emitir Credencial'}
              </button>
            </div>
          </motion.div>

          {/* Credentials List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Credenciales</h2>
            </div>

            {credentials.length === 0 ? (
              <div className="text-center py-8">
                <User className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">No hay credenciales emitidas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {credentials.map((credential, index) => (
                  <motion.div
                    key={credential.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          credential.revoked ? 'bg-red-400' : 'bg-green-400'
                        }`} />
                        <div>
                          <h4 className="text-white font-medium">
                            {getCredentialTypeLabel(credential.type)}
                          </h4>
                          <p className="text-sm text-white/70">
                            {credential.issuer} → {credential.subject}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleVerifyIdentity(credential.id)}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full hover:bg-blue-500/30 transition-colors"
                      >
                        Verificar
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">Emitido:</span>
                        <span className="text-white">
                          {new Date(credential.issuedAt).toLocaleDateString('es-MX')}
                        </span>
                      </div>
                      {credential.expiresAt && (
                        <div className="flex justify-between">
                          <span className="text-white/70">Expira:</span>
                          <span className="text-white">
                            {new Date(credential.expiresAt).toLocaleDateString('es-MX')}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-white/70">Estado:</span>
                        <span className={`font-medium ${
                          credential.revoked ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {credential.revoked ? 'Revocada' : 'Válida'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCreateAttestation('user_123', 'Has completed KYC verification')}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all"
          >
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Crear Atestación
            </h3>
            <p className="text-white/70 text-sm">
              Atestiguar verificación KYC
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleVerifyIdentity(credentials[0]?.id || 'credential_1')}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all"
          >
            <Eye className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Verificar Identidad
            </h3>
            <p className="text-white/70 text-sm">
              Verificación sin exponer datos
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log('NFC scan simulation')}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all"
          >
            <CreditCard className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Escanear NFC
            </h3>
            <p className="text-white/70 text-sm">
              Simular escaneo de tarjeta
            </p>
          </motion.button>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-red-500/20 border border-red-400/30 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">Error</span>
            </div>
            <p className="text-red-300 mt-2">{error}</p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
