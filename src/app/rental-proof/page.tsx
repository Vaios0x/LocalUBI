'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Receipt, Camera, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { getNumbersService } from '@/lib/numbers-protocol';
import { getC2PAService } from '@/lib/c2pa-integration';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function RentalProofPage() {
  const [rentalData, setRentalData] = useState({
    propertyAddress: '',
    landlordName: '',
    tenantName: '',
    rentAmount: '',
    contractHash: ''
  });
  
  const [photos, setPhotos] = useState<File[]>([]);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const numbersService = getNumbersService();
  const c2paService = getC2PAService();

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPhotos(prev => [...prev, ...files]);
  };

  const handleCreateRentalReceipt = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Crear manifest C2PA para las fotos
      const manifest = await c2paService.createRentalManifest(
        {
          address: rentalData.propertyAddress,
          landlord: rentalData.landlordName,
          tenant: rentalData.tenantName,
          rentAmount: parseFloat(rentalData.rentAmount),
          contractHash: rentalData.contractHash
        },
        photos
      );

      // Crear recibo en Numbers Protocol
      const receipt = await numbersService.createRentalReceipt(
        `property_${Date.now()}`,
        rentalData.tenantName,
        rentalData.landlordName,
        parseFloat(rentalData.rentAmount),
        rentalData.contractHash
      );

      setReceipts(prev => [...prev, { ...receipt, manifest }]);
      
      // Limpiar formulario
      setRentalData({
        propertyAddress: '',
        landlordName: '',
        tenantName: '',
        rentAmount: '',
        contractHash: ''
      });
      setPhotos([]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating receipt');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyReceipt = async (receipt: any) => {
    try {
      const isValid = await numbersService.verifyReceipt(receipt);
      if (isValid) {
        alert('Recibo verificado exitosamente');
      } else {
        alert('Recibo no válido');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying receipt');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Rental Proof
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Documenta y verifica pagos de renta con pruebas criptográficas inmutables
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Create Receipt Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Receipt className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Crear Recibo de Renta</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Dirección de la Propiedad
                </label>
                <input
                  type="text"
                  value={rentalData.propertyAddress}
                  onChange={(e) => setRentalData(prev => ({ ...prev, propertyAddress: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                  placeholder="Calle, Colonia, Ciudad"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Propietario
                  </label>
                  <input
                    type="text"
                    value={rentalData.landlordName}
                    onChange={(e) => setRentalData(prev => ({ ...prev, landlordName: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                    placeholder="Nombre del propietario"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Inquilino
                  </label>
                  <input
                    type="text"
                    value={rentalData.tenantName}
                    onChange={(e) => setRentalData(prev => ({ ...prev, tenantName: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Monto de Renta (USD)
                </label>
                <input
                  type="number"
                  value={rentalData.rentAmount}
                  onChange={(e) => setRentalData(prev => ({ ...prev, rentAmount: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                  placeholder="500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Hash del Contrato
                </label>
                <input
                  type="text"
                  value={rentalData.contractHash}
                  onChange={(e) => setRentalData(prev => ({ ...prev, contractHash: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                  placeholder="0x..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Fotos de la Propiedad
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                />
                {photos.length > 0 && (
                  <div className="mt-2 text-sm text-white/70">
                    {photos.length} foto(s) seleccionada(s)
                  </div>
                )}
              </div>

              <button
                onClick={handleCreateRentalReceipt}
                disabled={isProcessing || !rentalData.propertyAddress || !rentalData.rentAmount}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Creando Recibo...' : 'Crear Recibo de Renta'}
              </button>
            </div>
          </motion.div>

          {/* Receipts List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Recibos Creados</h2>
            </div>

            {receipts.length === 0 ? (
              <div className="text-center py-8">
                <Home className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">No hay recibos creados aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                {receipts.map((receipt, index) => (
                  <motion.div
                    key={receipt.nid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-white">
                          Recibo #{index + 1}
                        </span>
                      </div>
                      <button
                        onClick={() => handleVerifyReceipt(receipt)}
                        className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full hover:bg-green-500/30 transition-colors"
                      >
                        Verificar
                      </button>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/70">NID:</span>
                        <span className="text-white font-mono text-xs">
                          {receipt.nid.slice(0, 16)}...
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Monto:</span>
                        <span className="text-white">${receipt.amount} USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Fecha:</span>
                        <span className="text-white">
                          {new Date(receipt.paymentDate).toLocaleDateString('es-MX')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Propiedad:</span>
                        <span className="text-white text-xs">
                          {receipt.propertyId.slice(0, 12)}...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
            <Camera className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">C2PA Provenance</h3>
            <p className="text-white/70 text-sm">
              Fotos firmadas con metadata de autenticidad usando C2PA
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
            <Receipt className="w-8 h-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">ERC-7053 Receipts</h3>
            <p className="text-white/70 text-sm">
              Recibos inmutables en Numbers Protocol para verificación
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
            <Shield className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Verificación</h3>
            <p className="text-white/70 text-sm">
              Pruebas criptográficas para demostrar historial de pagos
            </p>
          </div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-400/30 rounded-lg p-4"
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
