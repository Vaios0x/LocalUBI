'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/effects/GlassCard';
import { useHumanWallet } from '@/hooks/useHumanWallet';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { 
  Wallet, 
  Users, 
  TrendingUp, 
  Gift,
  Clock,
  ArrowUp,
  ArrowDown,
  Plus,
  Calendar,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTanda } from '@/hooks/useTanda';
import { useGoodDollar } from '@/hooks/useGoodDollar';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DashboardPage() {
  const { address, balance } = useHumanWallet();
  const { userTandas, loadingTandas } = useTanda();
  const { dailyUBI, canClaim, claimHistory, totalClaimed } = useGoodDollar();
  
  const [stats, setStats] = useState({
    totalSaved: 0,
    activeTandas: 0,
    pendingPayments: 0,
    nextPayout: null as Date | null,
  });

  useEffect(() => {
    // Calculate stats from user tandas
    if (userTandas) {
      const active = userTandas.filter(t => t.isActive).length;
      const saved = userTandas.reduce((acc, t) => acc + (t.totalContributed || 0), 0);
      const pending = userTandas.filter(t => t.needsPayment).length;
      const nextDate = userTandas
        .filter(t => t.nextPayoutDate)
        .sort((a, b) => a.nextPayoutDate!.getTime() - b.nextPayoutDate!.getTime())[0]?.nextPayoutDate;

      setStats({
        totalSaved: saved,
        activeTandas: active,
        pendingPayments: pending,
        nextPayout: nextDate || null,
      });
    }
  }, [userTandas]);

  const quickActions = [
    {
      title: 'Claim UBI',
      description: `${dailyUBI} G$ disponible`,
      icon: Gift,
      href: '/claim',
      color: 'from-green-500 to-emerald-500',
      disabled: !canClaim,
    },
    {
      title: 'Crear Tanda',
      description: 'Inicia nuevo grupo',
      icon: Plus,
      href: '/tanda/create',
      color: 'from-blue-500 to-indigo-500',
      disabled: false,
    },
    {
      title: 'Unirse a Tanda',
      description: 'Explorar activas',
      icon: Users,
      href: '/tanda/join',
      color: 'from-purple-500 to-pink-500',
      disabled: false,
    },
  ];

  const transactions = [
    {
      type: 'received' as const,
      amount: 50,
      currency: 'G$',
      description: 'UBI Diario',
      date: new Date(),
    },
    {
      type: 'sent' as const,
      amount: 500,
      currency: 'G$',
      description: 'Pago Tanda #3',
      date: new Date(Date.now() - 86400000),
    },
    {
      type: 'received' as const,
      amount: 5000,
      currency: 'G$',
      description: 'Payout Tanda #2',
      date: new Date(Date.now() - 172800000),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <Header />
      <div className="p-4 md:p-6 lg:p-8 space-y-6 pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">
            Bienvenid@ de vuelta
          </h1>
          <p className="text-muted-foreground mt-1">
            Tu resumen financiero del día
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/settings">
              Configuración
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Balance Total</p>
              <p className="text-2xl font-bold mt-1">
                {balance?.formatted || '0'} G$
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ ${(Number(balance?.value || 0) * 0.01).toFixed(2)} USD
              </p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20">
              <Wallet className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Ahorrado</p>
              <p className="text-2xl font-bold mt-1">
                {stats.totalSaved.toLocaleString()} G$
              </p>
              <p className="text-xs text-green-500 mt-1 flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                +12% este mes
              </p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tandas Activas</p>
              <p className="text-2xl font-bold mt-1">{stats.activeTandas}</p>
              <p className="text-xs text-orange-500 mt-1">
                {stats.pendingPayments > 0 && `${stats.pendingPayments} pagos pendientes`}
              </p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">UBI Total</p>
              <p className="text-2xl font-bold mt-1">
                {totalClaimed.toLocaleString()} G$
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {claimHistory.length} claims
              </p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20">
              <Gift className="w-6 h-6 text-amber-500" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link href={action.href}>
              <GlassCard 
                className={`p-6 cursor-pointer transition-all ${
                  action.disabled ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color}`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <ArrowUp className="w-5 h-5 text-muted-foreground rotate-45" />
                </div>
                <h3 className="font-semibold text-lg">{action.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {action.description}
                </p>
              </GlassCard>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tandas */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Tus Tandas Activas</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/tanda">Ver todas →</Link>
              </Button>
            </div>
            
            {loadingTandas ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : userTandas?.filter(t => t.isActive).length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No tienes tandas activas</p>
                <Button className="mt-4" asChild>
                  <Link href="/tanda/create">Crear Primera Tanda</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {userTandas?.filter(t => t.isActive).slice(0, 3).map((tanda) => (
                  <Link key={tanda.id} href={`/tanda/${tanda.id}`}>
                    <div className="p-4 rounded-xl border bg-card/50 hover:bg-card/80 transition-all cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{tanda.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {tanda.members.length}/{tanda.maxMembers} miembros • Ronda {tanda.currentRound}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{tanda.monthlyAmount} G$/mes</p>
                          {tanda.needsPayment && (
                            <span className="text-xs bg-orange-500/20 text-orange-500 px-2 py-1 rounded-full">
                              Pago pendiente
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-3">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                            style={{ width: `${(tanda.currentRound / tanda.maxMembers) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Actividad</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/transactions">Ver todo →</Link>
              </Button>
            </div>
            
            <div className="space-y-2">
              {transactions.map((tx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      tx.type === 'received' 
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {tx.type === 'received' ? (
                        <ArrowDown className="w-4 h-4" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(tx.date, { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-semibold ${
                    tx.type === 'received' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {tx.type === 'received' ? '+' : '-'}{tx.amount} {tx.currency}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Upcoming Events */}
      {stats.nextPayout && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20">
                <Calendar className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold">Próximo Payout</h3>
                <p className="text-sm text-muted-foreground">
                  Recibirás tu pago de tanda {formatDistanceToNow(stats.nextPayout, { 
                    addSuffix: true, 
                    locale: es 
                  })}
                </p>
              </div>
            </div>
            <Button asChild>
              <Link href="/tanda">Ver Detalles</Link>
            </Button>
          </div>
        </GlassCard>
      )}
      </div>
      <Footer />
    </div>
  );
}
