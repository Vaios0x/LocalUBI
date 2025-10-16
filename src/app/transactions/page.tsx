'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';
import { 
  ArrowUp, 
  ArrowDown, 
  Search,
  Filter,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Transaction {
  id: string;
  type: 'received' | 'sent';
  amount: number;
  currency: string;
  description: string;
  txHash: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      // Mock data - replace with actual API call
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'received',
          amount: 50,
          currency: 'G$',
          description: 'UBI Diario',
          txHash: '0x1234...5678',
          timestamp: new Date().toISOString(),
          status: 'confirmed'
        },
        {
          id: '2',
          type: 'sent',
          amount: 500,
          currency: 'G$',
          description: 'Pago Tanda #3',
          txHash: '0x8765...4321',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'confirmed'
        },
        {
          id: '3',
          type: 'received',
          amount: 5000,
          currency: 'G$',
          description: 'Payout Tanda #2',
          txHash: '0x1111...2222',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          status: 'confirmed'
        },
        {
          id: '4',
          type: 'sent',
          amount: 200,
          currency: 'G$',
          description: 'Compra Marketplace',
          txHash: '0x3333...4444',
          timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          status: 'pending'
        },
        {
          id: '5',
          type: 'received',
          amount: 50,
          currency: 'G$',
          description: 'UBI Diario',
          txHash: '0x5555...6666',
          timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
          status: 'failed'
        }
      ];
      
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.txHash.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'received' && tx.type === 'received') ||
                         (filter === 'sent' && tx.type === 'sent') ||
                         (filter === 'pending' && tx.status === 'pending') ||
                         (filter === 'confirmed' && tx.status === 'confirmed');
    
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendiente';
      case 'failed':
        return 'Fallido';
      default:
        return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gradient mb-4">Transacciones</h1>
            <p className="text-muted-foreground">Cargando transacciones...</p>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-muted/20 rounded-lg animate-pulse" />
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gradient">Transacciones</h1>
            <p className="text-muted-foreground">
              Historial completo de tus transacciones
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={fetchTransactions}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar transacciones..."
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
                <option value="all">Todas</option>
                <option value="received">Recibidas</option>
                <option value="sent">Enviadas</option>
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmadas</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">
              {searchTerm || filter !== 'all' ? 'No se encontraron transacciones' : 'No hay transacciones aún'}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || filter !== 'all' 
                ? 'Intenta ajustar tu búsqueda o filtros'
                : 'Tus transacciones aparecerán aquí'
              }
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx, idx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        tx.type === 'received' 
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {tx.type === 'received' ? (
                          <ArrowDown className="w-5 h-5" />
                        ) : (
                          <ArrowUp className="w-5 h-5" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">{tx.description}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(tx.timestamp), { 
                              addSuffix: true, 
                              locale: es 
                            })}
                          </span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            {tx.txHash}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-semibold ${
                        tx.type === 'received' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {tx.type === 'received' ? '+' : '-'}{tx.amount} {tx.currency}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusIcon(tx.status)}
                        <span className="text-sm text-muted-foreground">
                          {getStatusText(tx.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Resumen de Transacciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-green-500">
                {transactions.filter(t => t.type === 'received').length}
              </div>
              <div className="text-sm text-muted-foreground">Recibidas</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-red-500">
                {transactions.filter(t => t.type === 'sent').length}
              </div>
              <div className="text-sm text-muted-foreground">Enviadas</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-yellow-500">
                {transactions.filter(t => t.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-2xl font-bold text-blue-500">
                {transactions.filter(t => t.status === 'confirmed').length}
              </div>
              <div className="text-sm text-muted-foreground">Confirmadas</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
