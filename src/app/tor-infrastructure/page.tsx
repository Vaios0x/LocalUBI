'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, Lock, Eye, Network, CheckCircle, AlertCircle } from 'lucide-react';
import { getLogosTorService } from '@/lib/logos-tor';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function TorInfrastructurePage() {
  const [torNodes, setTorNodes] = useState<any[]>([]);
  const [onionServices, setOnionServices] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logosTorService = getLogosTorService();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [nodesData, servicesData, metricsData] = await Promise.all([
        logosTorService.getAvailableTorNodes(),
        logosTorService.getOnionServices(),
        logosTorService.getNetworkMetrics()
      ]);
      
      setTorNodes(nodesData);
      setOnionServices(servicesData);
      setMetrics(metricsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    }
  };

  const handleCreateNode = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const node = await logosTorService.createTorNode('relay', 9001, 1000);
      setTorNodes(prev => [...prev, node]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating node');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateService = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const service = await logosTorService.createOnionService(
        80,
        'LocalUBI Privacy Service',
        'web',
        'maximum'
      );
      setOnionServices(prev => [...prev, service]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating service');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateConnection = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const connection = await logosTorService.establishTorConnection(
        'source_123',
        'destination_456',
        'maximum'
      );
      setConnections(prev => [...prev, connection]);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating connection');
    } finally {
      setIsCreating(false);
    }
  };

  const handleVerifyPrivacy = async (connectionId: string) => {
    try {
      const result = await logosTorService.verifyConnectionPrivacy(connectionId);
      
      if (result.isPrivate) {
        alert(`Conexión verificada: ${result.privacyScore.toFixed(1)}% privacidad`);
      } else {
        alert(`Conexión no segura: ${result.vulnerabilities.join(', ')}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying privacy');
    }
  };

  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case 'exit': return 'text-red-400';
      case 'relay': return 'text-blue-400';
      case 'bridge': return 'text-green-400';
      default: return 'text-white/60';
    }
  };

  const getNodeTypeLabel = (type: string) => {
    switch (type) {
      case 'exit': return 'Exit Node';
      case 'relay': return 'Relay Node';
      case 'bridge': return 'Bridge Node';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'inactive': return 'text-red-400';
      case 'blocked': return 'text-yellow-400';
      default: return 'text-white/60';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900">
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-white">
              Tor Infrastructure
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Infraestructura de privacidad con Tor para comunicación segura y anónima
          </p>
        </motion.div>

        {/* Network Metrics */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-slate-500/20 rounded-lg">
                <Network className="w-6 h-6 text-slate-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Métricas de Red</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{metrics.totalNodes}</div>
                <div className="text-sm text-white/70">Nodos Totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{metrics.activeNodes}</div>
                <div className="text-sm text-white/70">Nodos Activos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{metrics.totalBandwidth.toLocaleString()}</div>
                <div className="text-sm text-white/70">Ancho de Banda</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{metrics.averageLatency.toFixed(0)}ms</div>
                <div className="text-sm text-white/70">Latencia Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{metrics.privacyScore.toFixed(1)}%</div>
                <div className="text-sm text-white/70">Score de Privacidad</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateNode}
            disabled={isCreating}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all disabled:opacity-50"
          >
            <Globe className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Crear Nodo Tor
            </h3>
            <p className="text-white/70 text-sm">
              Añadir nodo a la red Tor
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateService}
            disabled={isCreating}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all disabled:opacity-50"
          >
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Crear Servicio Onion
            </h3>
            <p className="text-white/70 text-sm">
              Servicio anónimo en la red
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreateConnection}
            disabled={isCreating}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all disabled:opacity-50"
          >
            <Lock className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Establecer Conexión
            </h3>
            <p className="text-white/70 text-sm">
              Conexión segura a través de Tor
            </p>
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Tor Nodes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Globe className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Nodos Tor</h2>
            </div>

            {torNodes.length === 0 ? (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">No hay nodos disponibles</p>
              </div>
            ) : (
              <div className="space-y-4">
                {torNodes.slice(0, 5).map((node, index) => (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          node.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <div>
                          <h4 className="text-white font-medium">
                            {node.address}
                          </h4>
                          <p className="text-sm text-white/70">
                            {node.country} • Puerto {node.port}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-sm font-medium ${getNodeTypeColor(node.type)}`}>
                          {getNodeTypeLabel(node.type)}
                        </div>
                        <div className={`text-xs ${getStatusColor(node.status)}`}>
                          {node.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/70">Ancho de Banda:</span>
                        <div className="text-white">
                          {node.bandwidth.toLocaleString()} KB/s
                        </div>
                      </div>
                      <div>
                        <span className="text-white/70">Uptime:</span>
                        <div className="text-white">
                          {node.uptime.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Onion Services */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Servicios Onion</h2>
            </div>

            {onionServices.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">No hay servicios disponibles</p>
              </div>
            ) : (
              <div className="space-y-4">
                {onionServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          service.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                        }`} />
                        <div>
                          <h4 className="text-white font-medium">
                            {service.address}
                          </h4>
                          <p className="text-sm text-white/70">
                            {service.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm text-white/70">
                          {service.category}
                        </div>
                        <div className="text-xs text-white/60">
                          {service.privacyLevel}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">
                        Puerto: {service.port}
                      </span>
                      <span className="text-white/70">
                        {new Date(service.createdAt).toLocaleDateString('es-MX')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Connections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Lock className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Conexiones Tor</h2>
          </div>

          {connections.length === 0 ? (
            <div className="text-center py-8">
              <Lock className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No hay conexiones establecidas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {connections.map((connection, index) => (
                <motion.div
                  key={connection.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full" />
                      <div>
                        <h4 className="text-white font-medium">
                          Conexión {connection.id.slice(-8)}
                        </h4>
                        <p className="text-sm text-white/70">
                          {connection.source} → {connection.destination}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleVerifyPrivacy(connection.id)}
                      className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full hover:bg-purple-500/30 transition-colors"
                    >
                      Verificar
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-white/70">Ruta:</span>
                      <div className="text-white font-mono text-xs">
                        {connection.route.length} saltos
                      </div>
                    </div>
                    <div>
                      <span className="text-white/70">Encriptación:</span>
                      <div className="text-white text-xs">
                        {connection.encryption.length} capas
                      </div>
                    </div>
                    <div>
                      <span className="text-white/70">Duración:</span>
                      <div className="text-white">
                        {connection.duration.toFixed(1)}s
                      </div>
                    </div>
                    <div>
                      <span className="text-white/70">Privacidad:</span>
                      <div className="text-white">
                        {connection.privacyScore.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
