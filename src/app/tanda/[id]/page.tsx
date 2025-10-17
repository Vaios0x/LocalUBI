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
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  User
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface TandaDetail {
  id: number;
  name: string;
  description: string;
  monthlyAmount: number;
  maxMembers: number;
  currentMembers: number;
  currentRound: number;
  isActive: boolean;
  isCompleted: boolean;
  members: string[];
  startTime: string;
  creator: string;
  needsPayment: boolean;
}

export default function TandaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { payRound } = useTanda();
  const [tanda, setTanda] = useState<TandaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [tandaId, setTandaId] = useState<string | null>(null);

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setTandaId(resolvedParams.id);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (tandaId) {
      fetchTandaDetail();
    }
  }, [tandaId]);

  const fetchTandaDetail = async () => {
    if (!tandaId) return;
    
    try {
      // Mock data - replace with actual API call
      const mockTanda: TandaDetail = {
        id: parseInt(tandaId),
        name: 'Tanda Familia González',
        description: 'Tanda familiar para ahorro navideño',
        monthlyAmount: 1000,
        maxMembers: 8,
        currentMembers: 6,
        currentRound: 2,
        isActive: true,
        isCompleted: false,
        members: [
          '0x1234...5678',
          '0x8765...4321',
          '0x1111...2222',
          '0x3333...4444',
          '0x5555...6666',
          '0x7777...8888',
        ],
        startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        creator: '0x1234...5678',
        needsPayment: true,
      };
      
      setTanda(mockTanda);
    } catch (error) {
      console.error('Error fetching tanda detail:', error);
      toast.error('Error al cargar detalles de la tanda');
    } finally {
      setLoading(false);
    }
  };

  const handlePayRound = async () => {
    if (!tandaId) return;
    
    setPaying(true);
    try {
      await payRound.mutateAsync(parseInt(tandaId));
      toast.success('¡Pago realizado exitosamente!');
      fetchTandaDetail(); // Refresh data
    } catch (error) {
      console.error('Error paying round:', error);
      toast.error('Error al realizar el pago');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <Header />
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 pt-20 sm:pt-24">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="h-6 sm:h-8 bg-muted/20 rounded-lg animate-pulse" />
          <div className="h-48 sm:h-64 bg-muted/20 rounded-lg animate-pulse" />
        </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tanda) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
        <Header />
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 pt-20 sm:pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-muted-foreground mb-3 sm:mb-4" />
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Tanda no encontrada</h1>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            La tanda que buscas no existe o no tienes acceso a ella
          </p>
          <Button asChild size="sm" className="text-xs sm:text-sm">
            <Link href="/tanda">Ver Todas las Tandas</Link>
          </Button>
        </div>
        </div>
        <Footer />
      </div>
    );
  }

  const progress = (tanda.currentRound / tanda.maxMembers) * 100;
  const nextPayoutDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <Header />
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 pt-20 sm:pt-24">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient">{tanda.name}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">{tanda.description}</p>
          </div>
        </div>

        {/* Status Card */}
        <GlassCard className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                tanda.isActive ? 'bg-green-500' : 'bg-muted'
              }`} />
              <span className="font-semibold text-sm sm:text-base">
                {tanda.isActive ? 'Activa' : 'Inactiva'}
              </span>
            </div>
            {tanda.needsPayment && (
              <span className="bg-orange-500/20 text-orange-500 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                Pago Pendiente
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center p-3 sm:p-4 rounded-lg bg-muted/50">
              <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 mx-auto text-green-500 mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm text-muted-foreground">Monto Mensual</p>
              <p className="text-lg sm:text-xl font-bold">{tanda.monthlyAmount} G$</p>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-lg bg-muted/50">
              <Users className="w-4 h-4 sm:w-6 sm:h-6 mx-auto text-blue-500 mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm text-muted-foreground">Miembros</p>
              <p className="text-lg sm:text-xl font-bold">{tanda.currentMembers}/{tanda.maxMembers}</p>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-lg bg-muted/50">
              <Calendar className="w-4 h-4 sm:w-6 sm:h-6 mx-auto text-purple-500 mb-1 sm:mb-2" />
              <p className="text-xs sm:text-sm text-muted-foreground">Ronda Actual</p>
              <p className="text-lg sm:text-xl font-bold">{tanda.currentRound}/{tanda.maxMembers}</p>
            </div>
          </div>
        </GlassCard>

        {/* Progress */}
        <GlassCard className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Progreso de la Tanda</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-muted-foreground">Progreso General</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 text-xs sm:text-sm text-muted-foreground">
              <span>Inicio: {formatDistanceToNow(new Date(tanda.startTime), { addSuffix: true, locale: es })}</span>
              <span>Próximo pago: {formatDistanceToNow(nextPayoutDate, { addSuffix: true, locale: es })}</span>
            </div>
          </div>
        </GlassCard>

        {/* Members */}
        <GlassCard className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Miembros de la Tanda</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {tanda.members.map((member, idx) => (
              <div key={idx} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm sm:text-base">{member}</p>
                  <p className="text-xs text-muted-foreground">
                    {member === tanda.creator ? 'Creador' : 'Miembro'}
                  </p>
                </div>
                {idx < tanda.currentRound && (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Payment Section */}
        {tanda.needsPayment && (
          <GlassCard className="p-4 sm:p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-700 text-sm sm:text-base">Pago Pendiente</h3>
                <p className="text-xs sm:text-sm text-orange-600">
                  Tienes un pago pendiente para la ronda actual
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Monto a pagar</p>
                <p className="text-lg sm:text-2xl font-bold">{tanda.monthlyAmount} G$</p>
              </div>
              <Button 
                onClick={handlePayRound}
                disabled={paying}
                className="bg-orange-500 hover:bg-orange-600 text-xs sm:text-sm w-full sm:w-auto"
                size="sm"
              >
                {paying ? 'Procesando...' : 'Pagar Ahora'}
              </Button>
            </div>
          </GlassCard>
        )}

        {/* Round History */}
        <GlassCard className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Historial de Rondas</h2>
          <div className="space-y-2 sm:space-y-3">
            {Array.from({ length: tanda.currentRound }, (_, i) => (
              <div key={i} className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">Ronda {i + 1}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Pagado a {tanda.members[i] || 'Miembro'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm sm:text-base">{tanda.monthlyAmount * tanda.currentMembers} G$</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(Date.now() - (tanda.currentRound - i) * 30 * 24 * 60 * 60 * 1000), { addSuffix: true, locale: es })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Info Card */}
        <GlassCard className="p-4 sm:p-6 bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
          <div className="flex gap-3 sm:gap-4">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-sm sm:text-base">Información de la Tanda</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Esta tanda tiene una duración total de {tanda.maxMembers * 30} días. 
                Cada miembro contribuye {tanda.monthlyAmount} G$ por ronda y recibe 
                {tanda.monthlyAmount * tanda.currentMembers} G$ en su ronda asignada.
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                El orden de pago se asigna aleatoriamente al inicio de la tanda 
                para garantizar equidad entre todos los participantes.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
      </div>
      <Footer />
    </div>
  );
}
