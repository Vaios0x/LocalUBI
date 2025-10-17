'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, Shield, Globe, Search, Plus, Lock, AlertCircle } from 'lucide-react';
import { getTorService } from '@/lib/tor-integration';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function AnonymousPublishingPage() {
  const [publishingNode, setPublishingNode] = useState<any>(null);
  const [content, setContent] = useState({
    title: '',
    text: '',
    tags: '',
    encrypted: false
  });
  const [publishedContent, setPublishedContent] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const torService = getTorService();

  useEffect(() => {
    initializePublishingNode();
  }, []);

  const initializePublishingNode = async () => {
    try {
      const node = await torService.createPublishingNode();
      setPublishingNode(node);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating publishing node');
    }
  };

  const handlePublishContent = async () => {
    try {
      setIsCreating(true);
      setError(null);

      if (!publishingNode) {
        throw new Error('Publishing node not initialized');
      }

      const anonymousContent = await torService.publishAnonymousContent(
        {
          title: content.title,
          content: content.text,
          author: `author_${Math.random().toString(36).substr(2, 9)}`,
          tags: content.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          encrypted: content.encrypted
        },
        publishingNode.onionService
      );

      setPublishedContent(prev => [...prev, anonymousContent]);
      
      // Limpiar formulario
      setContent({
        title: '',
        text: '',
        tags: '',
        encrypted: false
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error publishing content');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSearchContent = async () => {
    try {
      const results = await torService.discoverContent(searchQuery);
      // En una implementación real, esto actualizaría la lista de contenido
      console.log('Search results:', results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching content');
    }
  };

  const handleVerifyContent = async (content: any) => {
    try {
      const isValid = await torService.verifyContentIntegrity(content);
      if (isValid) {
        alert('Contenido verificado exitosamente');
      } else {
        alert('Contenido no válido o corrupto');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error verifying content');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900">
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-white">
              Anonymous Publishing
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Publica contenido de forma anónima y resistente a la censura usando Tor
          </p>
        </motion.div>

        {/* Publishing Node Status */}
        {publishingNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Globe className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Nodo de Publicación Activo
                  </h3>
                  <p className="text-sm text-white/70">
                    Onion Address: {publishingNode.onionService.address}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">Online</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Publish Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Plus className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Publicar Contenido</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={content.title}
                  onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                  placeholder="Título del contenido"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Contenido
                </label>
                <textarea
                  value={content.text}
                  onChange={(e) => setContent(prev => ({ ...prev, text: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                  placeholder="Escribe tu contenido aquí..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Tags (separados por comas)
                </label>
                <input
                  type="text"
                  value={content.tags}
                  onChange={(e) => setContent(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                  placeholder="privacy, crypto, freedom"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="encrypted"
                  checked={content.encrypted}
                  onChange={(e) => setContent(prev => ({ ...prev, encrypted: e.target.checked }))}
                  className="w-4 h-4 text-blue-400 bg-white/10 border-white/20 rounded focus:ring-blue-400"
                />
                <label htmlFor="encrypted" className="text-sm text-white/80">
                  Encriptar contenido
                </label>
              </div>

              <button
                onClick={handlePublishContent}
                disabled={isCreating || !content.title || !content.text}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Publicando...' : 'Publicar Anónimamente'}
              </button>
            </div>
          </motion.div>

          {/* Search Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Search className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Buscar Contenido</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Buscar
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                    placeholder="Buscar contenido anónimo..."
                  />
                  <button
                    onClick={handleSearchContent}
                    className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-white/60">
                <p>• Busca contenido por palabras clave</p>
                <p>• Los resultados son anónimos y descentralizados</p>
                <p>• No se almacena información de búsqueda</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Published Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Contenido Publicado</h2>
          </div>

          {publishedContent.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No hay contenido publicado aún</p>
            </div>
          ) : (
            <div className="space-y-4">
              {publishedContent.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {item.encrypted && <Lock className="w-4 h-4 text-yellow-400" />}
                      <h4 className="text-white font-medium">{item.title}</h4>
                    </div>
                    <button
                      onClick={() => handleVerifyContent(item)}
                      className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full hover:bg-green-500/30 transition-colors"
                    >
                      Verificar
                    </button>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-3 line-clamp-3">
                    {item.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <div className="flex items-center space-x-4">
                      <span>Autor: {item.author}</span>
                      <span>Onion: {item.onionAddress}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>{new Date(item.publishedAt).toLocaleDateString('es-MX')}</span>
                      {item.cid && <span>IPFS: {item.cid.slice(0, 8)}...</span>}
                    </div>
                  </div>
                  
                  {item.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.map((tag: string, tagIndex: number) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Anonimato Total</h3>
            <p className="text-white/70 text-sm">
              Publica sin revelar tu identidad usando Tor onion services
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
            <Eye className="w-8 h-8 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Resistente a Censura</h3>
            <p className="text-white/70 text-sm">
              Contenido distribuido que no puede ser censurado o eliminado
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center">
            <Globe className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Descentralizado</h3>
            <p className="text-white/70 text-sm">
              Red P2P sin puntos centrales de falla
            </p>
          </div>
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
