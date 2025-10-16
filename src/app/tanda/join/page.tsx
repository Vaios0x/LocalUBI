'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';
import { useTanda } from '@/hooks/useTanda';
import { 
  Users, 
  DollarSign, 
  Calendar,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface TandaCard {
  id: number;
  name: string;
  description: string;
  monthlyAmount: number;
  maxMembers: number;
  currentMembers: number;
  isActive: boolean;
  creator: string;
  startTime: string;
}

export default function JoinTandaPage() {
  const { joinTanda } = useTanda();
  const [tandas, setTandas] = useState<TandaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [joining, setJoining] = useState<number | null>(null);

  useEffect(() => {
    fetchTandas();
  }, []);

  const fetchTandas = async () => {
    try {
      const response = await fetch('/api/tanda?status=available');
      const data = await response.json();
      setTandas(data.tandas || []);
    } catch (error) {
      console.error('Error fetching tandas:', error);
      toast.error('Error al cargar tandas');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTanda = async (tandaId: number) => {
    setJoining(tandaId);
    try {
      await joinTanda.mutateAsync(tandaId);
      toast.success('¡Te has unido a la tanda exitosamente!');
      fetchTandas(); // Refresh list
    } catch (error) {
      console.error('Error joining tanda:', error);
      toast.error('Error al unirse a la tanda');
    } finally {
      setJoining(null);
    }
  };

  const filteredTandas = tandas.filter(tanda => {
    const matchesSearch = tanda.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tanda.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'low' && tanda.monthlyAmount <= 500) ||
                         (filter === 'medium' && tanda.monthlyAmount > 500 && tanda.monthlyAmount <= 1000) ||
                         (filter === 'high' && tanda.monthlyAmount > 1000);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gradient mb-4">Explorar Tandas</h1>
            <p className="text-muted-foreground">Cargando tandas disponibles...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-muted/20 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gradient">Explorar Tandas</h1>
          <p className="text-muted-foreground">
            Únete a tandas activas y comienza a ahorrar con tu comunidad
          </p>
        </div>

        {/* Search and Filters */}
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar tandas por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">Todos los montos</option>
                <option value="low">Bajo (≤500 G$)</option>
                <option value="medium">Medio (500-1000 G$)</option>
                <option value="high">Alto (&gt;1000 G$)</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Tandas Grid */}
        {filteredTandas.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No hay tandas disponibles</h3>
            <p className="text-muted-foreground mb-6">
              No se encontraron tandas que coincidan con tu búsqueda
            </p>
            <Button asChild>
              <Link href="/tanda/create">Crear Nueva Tanda</Link>
            </Button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTandas.map((tanda, idx) => (
              <motion.div
                key={tanda.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-6 h-full flex flex-col">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{tanda.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {tanda.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <DollarSign className="w-4 h-4 mx-auto text-green-500 mb-1" />
                        <p className="text-sm text-muted-foreground">Monto</p>
                        <p className="font-semibold">{tanda.monthlyAmount} G$</p>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-muted/50">
                        <Users className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                        <p className="text-sm text-muted-foreground">Miembros</p>
                        <p className="font-semibold">{tanda.currentMembers}/{tanda.maxMembers}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">
                          {Math.round((tanda.currentMembers / tanda.maxMembers) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                          style={{ width: `${(tanda.currentMembers / tanda.maxMembers) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>
                        {tanda.maxMembers - tanda.currentMembers} espacios disponibles
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      onClick={() => handleJoinTanda(tanda.id)}
                      disabled={joining === tanda.id || tanda.currentMembers >= tanda.maxMembers}
                      className="w-full"
                    >
                      {joining === tanda.id ? (
                        'Uniéndose...'
                      ) : tanda.currentMembers >= tanda.maxMembers ? (
                        'Tanda Completa'
                      ) : (
                        <>
                          Unirse a la Tanda
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <GlassCard className="p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
          <div className="flex gap-4">
            <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold">¿Cómo funcionan las tandas?</h3>
              <p className="text-sm text-muted-foreground">
                Las tandas son grupos de ahorro donde cada miembro contribuye una cantidad fija 
                en cada ronda. Un miembro diferente recibe el pago total en cada ronda, 
                hasta que todos hayan recibido su pago. Es una forma segura y transparente 
                de ahorrar en grupo.
              </p>
              <p className="text-sm text-muted-foreground">
                Todas las transacciones se registran en blockchain, garantizando transparencia 
                y seguridad para todos los participantes.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
