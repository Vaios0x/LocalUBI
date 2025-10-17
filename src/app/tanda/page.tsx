'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';
import { useTanda } from '@/hooks/useTanda';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { 
  Users, 
  DollarSign, 
  Calendar,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function TandasPage() {
  const { userTandas, loadingTandas } = useTanda();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredTandas = userTandas?.filter(tanda => {
    const matchesSearch = tanda.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && tanda.isActive && !tanda.isCompleted) ||
                         (filter === 'completed' && tanda.isCompleted) ||
                         (filter === 'pending' && !tanda.isActive);
    
    return matchesSearch && matchesFilter;
  }) || [];

  if (loadingTandas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <Header />
        <div className="p-4 md:p-6 lg:p-8 pt-24">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gradient mb-4">Mis Tandas</h1>
            <p className="text-muted-foreground">Cargando tus tandas...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-muted/20 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <Header />
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 pt-24 sm:pt-28">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Mis Tandas</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona todas tus tandas activas y completadas
            </p>
          </div>
          <Button asChild size="sm" className="text-xs sm:text-sm">
            <Link href="/tanda/create">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Crear Nueva Tanda
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <GlassCard className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar tandas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="all">Todas</option>
                <option value="active">Activas</option>
                <option value="pending">Pendientes</option>
                <option value="completed">Completadas</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Tandas Grid */}
        {filteredTandas.length === 0 ? (
          <GlassCard className="p-8 sm:p-12 text-center">
            <Users className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              {searchTerm || filter !== 'all' ? 'No se encontraron tandas' : 'No tienes tandas aún'}
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Intenta ajustar tu búsqueda o filtros'
                : 'Crea tu primera tanda o únete a una existente'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button asChild size="sm" className="text-xs sm:text-sm">
                <Link href="/tanda/create">Crear Tanda</Link>
              </Button>
              <Button variant="outline" asChild size="sm" className="text-xs sm:text-sm">
                <Link href="/tanda/join">Explorar Tandas</Link>
              </Button>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTandas.map((tanda, idx) => (
              <motion.div
                key={tanda.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/tanda/${tanda.id}`}>
                  <GlassCard className="p-4 sm:p-6 h-full flex flex-col cursor-pointer hover:scale-105 transition-transform">
                    <div className="flex-1 space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-base sm:text-lg">{tanda.name}</h3>
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                          tanda.isActive ? 'bg-green-500' : 
                          tanda.isCompleted ? 'bg-blue-500' : 'bg-orange-500'
                        }`} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 mx-auto text-green-500 mb-1" />
                          <p className="text-xs sm:text-sm text-muted-foreground">Monto</p>
                          <p className="font-semibold text-sm sm:text-base">{tanda.monthlyAmount} G$</p>
                        </div>
                        <div className="text-center p-2 sm:p-3 rounded-lg bg-muted/50">
                          <Users className="w-3 h-3 sm:w-4 sm:h-4 mx-auto text-blue-500 mb-1" />
                          <p className="text-xs sm:text-sm text-muted-foreground">Miembros</p>
                          <p className="font-semibold text-sm sm:text-base">{tanda.currentMembers}/{tanda.maxMembers}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium">
                            {Math.round((tanda.currentRound / tanda.maxMembers) * 100)}%
                          </span>
                        </div>
                        <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                            style={{ width: `${(tanda.currentRound / tanda.maxMembers) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        {tanda.needsPayment && (
                          <span className="bg-orange-500/20 text-orange-500 px-2 py-1 rounded-full text-xs">
                            Pago Pendiente
                          </span>
                        )}
                        {tanda.isActive && !tanda.needsPayment && (
                          <span className="bg-green-500/20 text-green-500 px-2 py-1 rounded-full text-xs">
                            Al Día
                          </span>
                        )}
                        {tanda.isCompleted && (
                          <span className="bg-blue-500/20 text-blue-500 px-2 py-1 rounded-full text-xs">
                            Completada
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-4 flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        Ronda {tanda.currentRound}/{tanda.maxMembers}
                      </span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {filteredTandas.length > 0 && (
          <GlassCard className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Resumen de Tandas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 rounded-lg bg-muted/50">
                <div className="text-lg sm:text-2xl font-bold text-green-500">
                  {filteredTandas.filter(t => t.isActive).length}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Activas</div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-muted/50">
                <div className="text-lg sm:text-2xl font-bold text-blue-500">
                  {filteredTandas.filter(t => t.isCompleted).length}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Completadas</div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-muted/50">
                <div className="text-lg sm:text-2xl font-bold text-orange-500">
                  {filteredTandas.filter(t => t.needsPayment).length}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Pagos Pendientes</div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-muted/50">
                <div className="text-lg sm:text-2xl font-bold text-purple-500">
                  {filteredTandas.reduce((acc, t) => acc + (t.totalContributed || 0), 0)}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Total Ahorrado (G$)</div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20">
                <Plus className="w-4 h-4 sm:w-6 sm:h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Crear Nueva Tanda</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Inicia tu propia tanda y invita a familiares y amigos
                </p>
              </div>
            </div>
            <Button className="w-full mt-3 sm:mt-4 text-xs sm:text-sm" asChild size="sm">
              <Link href="/tanda/create">Crear Tanda</Link>
            </Button>
          </GlassCard>

          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Explorar Tandas</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Únete a tandas existentes en tu comunidad
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-3 sm:mt-4 text-xs sm:text-sm" asChild size="sm">
              <Link href="/tanda/join">Explorar Tandas</Link>
            </Button>
          </GlassCard>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
