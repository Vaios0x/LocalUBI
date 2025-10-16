'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Vote, MapPin, DollarSign, TrendingUp, CheckCircle } from 'lucide-react';
import { getEdgeOSService } from '@/lib/edgeos-integration';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function CivicTechPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [societies, setSocieties] = useState<any[]>([]);
  const [selectedSociety, setSelectedSociety] = useState<any>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    category: 'governance',
    city: '',
    state: '',
    budget: '',
    deadline: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const edgeOSService = getEdgeOSService();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsData, societiesData] = await Promise.all([
        edgeOSService.getProjectsByCategory('governance'),
        edgeOSService.getNetworkSocieties()
      ]);
      
      setProjects(projectsData);
      setSocieties(societiesData);
      
      if (societiesData.length > 0) {
        setSelectedSociety(societiesData[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading data');
    }
  };

  const handleCreateProject = async () => {
    try {
      setIsCreating(true);
      setError(null);

      const project = await edgeOSService.createCivicProject(
        newProject.name,
        newProject.description,
        newProject.category,
        {
          city: newProject.city,
          state: newProject.state,
          coordinates: [0, 0] // Simulado
        },
        parseFloat(newProject.budget),
        new Date(newProject.deadline)
      );

      setProjects(prev => [...prev, project]);
      
      // Limpiar formulario
      setNewProject({
        name: '',
        description: '',
        category: 'governance',
        city: '',
        state: '',
        budget: '',
        deadline: ''
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleVote = async (projectId: string, vote: 'for' | 'against' | 'abstain') => {
    try {
      if (!selectedSociety) return;
      
      await edgeOSService.voteOnProject(
        projectId,
        selectedSociety.id,
        'user_123', // Simulado
        vote,
        1
      );
      
      // Recargar datos
      await loadData();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error voting');
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'proposed': return 'text-yellow-400';
      case 'voting': return 'text-blue-400';
      case 'approved': return 'text-green-400';
      case 'in_progress': return 'text-purple-400';
      case 'completed': return 'text-gray-400';
      default: return 'text-white/60';
    }
  };

  const getProjectStatusLabel = (status: string) => {
    switch (status) {
      case 'proposed': return 'Propuesto';
      case 'voting': return 'En Votación';
      case 'approved': return 'Aprobado';
      case 'in_progress': return 'En Progreso';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Civic Tech
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Tecnología cívica para sociedades de red y gobernanza descentralizada
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Create Project */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Crear Proyecto</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Nombre del Proyecto
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-400"
                    placeholder="Parque comunitario"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-400"
                    placeholder="Descripción del proyecto..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={newProject.city}
                      onChange={(e) => setNewProject(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-400"
                      placeholder="Ciudad de México"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={newProject.state}
                      onChange={(e) => setNewProject(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-400"
                      placeholder="CDMX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Presupuesto (USD)
                  </label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-400"
                    placeholder="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Fecha Límite
                  </label>
                  <input
                    type="date"
                    value={newProject.deadline}
                    onChange={(e) => setNewProject(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-green-400"
                  />
                </div>

                <button
                  onClick={handleCreateProject}
                  disabled={isCreating || !newProject.name || !newProject.description}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? 'Creando...' : 'Crear Proyecto'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Projects List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Vote className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-white">Proyectos Cívicos</h2>
              </div>

              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">No hay proyectos disponibles</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white/5 rounded-lg p-4 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            project.status === 'approved' ? 'bg-green-400' :
                            project.status === 'voting' ? 'bg-blue-400' :
                            project.status === 'proposed' ? 'bg-yellow-400' :
                            'bg-gray-400'
                          }`} />
                          <div>
                            <h4 className="text-white font-medium">{project.name}</h4>
                            <p className="text-sm text-white/70">
                              {project.location.city}, {project.location.state}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getProjectStatusColor(project.status)}`}>
                            {getProjectStatusLabel(project.status)}
                          </span>
                          <span className="text-sm text-white/60">
                            ${project.budget.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-white/70 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-white/60">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{project.location.city}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4" />
                            <span>${project.budget.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{project.votes.for} votos</span>
                          </div>
                        </div>
                        
                        {project.status === 'voting' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleVote(project.id, 'for')}
                              className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full hover:bg-green-500/30 transition-colors"
                            >
                              ✓ Aprobar
                            </button>
                            <button
                              onClick={() => handleVote(project.id, 'against')}
                              className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full hover:bg-red-500/30 transition-colors"
                            >
                              ✗ Rechazar
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Societies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Sociedades de Red</h2>
          </div>

          {societies.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/60">No hay sociedades disponibles</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {societies.map((society, index) => (
                <motion.div
                  key={society.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{society.name}</h4>
                      <p className="text-sm text-white/60">
                        {society.members.length} miembros
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {society.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">
                      {society.governance.type} governance
                    </span>
                    <span className="text-white/60">
                      ${society.treasury.balance.toLocaleString()}
                    </span>
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
              <CheckCircle className="w-5 h-5 text-red-400" />
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
