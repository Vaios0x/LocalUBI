'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Search,
  Filter,
  Star,
  Heart,
  ShoppingBag,
  DollarSign,
  Users,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface MarketplaceItem {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  seller: string;
  rating: number;
  reviews: number;
  isFavorite: boolean;
}

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState<MarketplaceItem[]>([
    {
      id: 1,
      name: 'Artesanías de Oaxaca',
      description: 'Hermosas artesanías tradicionales de Oaxaca',
      price: 150,
      currency: 'G$',
      image: '/products/artesania.jpg',
      category: 'artesanias',
      seller: 'María González',
      rating: 4.8,
      reviews: 24,
      isFavorite: false,
    },
    {
      id: 2,
      name: 'Servicios de Limpieza',
      description: 'Servicios de limpieza doméstica y comercial',
      price: 200,
      currency: 'G$',
      image: '/products/limpieza.jpg',
      category: 'servicios',
      seller: 'Carlos Ramírez',
      rating: 4.6,
      reviews: 18,
      isFavorite: true,
    },
    {
      id: 3,
      name: 'Comida Tradicional',
      description: 'Deliciosa comida tradicional mexicana',
      price: 80,
      currency: 'G$',
      image: '/products/comida.jpg',
      category: 'comida',
      seller: 'Ana López',
      rating: 4.9,
      reviews: 32,
      isFavorite: false,
    },
  ]);

  const handleToggleFavorite = (id: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  const handleAddToCart = (item: MarketplaceItem) => {
    toast.success(`${item.name} agregado al carrito`);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || item.category === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gradient">Marketplace LocalUBI</h1>
          <p className="text-muted-foreground">
            Compra y vende productos y servicios usando G$ tokens
          </p>
        </div>

        {/* Search and Filters */}
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos y servicios..."
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
                <option value="all">Todas las categorías</option>
                <option value="artesanias">Artesanías</option>
                <option value="servicios">Servicios</option>
                <option value="comida">Comida</option>
                <option value="productos">Productos</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Featured Items */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Productos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-6 h-full flex flex-col">
                  <div className="flex-1 space-y-4">
                    <div className="relative">
                      <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <button
                        onClick={() => handleToggleFavorite(item.id)}
                        className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${
                          item.isFavorite ? 'text-red-500 fill-red-500' : 'text-muted-foreground'
                        }`} />
                      </button>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({item.reviews} reseñas)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Vendedor</p>
                        <p className="font-medium">{item.seller}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gradient">
                          {item.price} {item.currency}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ≈ ${(item.price * 0.01).toFixed(2)} USD
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button 
                      onClick={() => handleAddToCart(item)}
                      className="w-full"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar al Carrito
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold mb-4">Categorías Populares</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Artesanías', icon: '🎨', count: 24 },
              { name: 'Servicios', icon: '🔧', count: 18 },
              { name: 'Comida', icon: '🍽️', count: 32 },
              { name: 'Productos', icon: '📦', count: 15 },
            ].map((category, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-muted/50 text-center hover:bg-muted/80 transition-colors cursor-pointer">
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium">{category.name}</div>
                <div className="text-sm text-muted-foreground">{category.count} items</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Info Card */}
        <GlassCard className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
          <div className="flex gap-4">
            <DollarSign className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold">¿Cómo funciona el Marketplace?</h3>
              <p className="text-sm text-muted-foreground">
                El Marketplace LocalUBI permite a los usuarios comprar y vender productos y servicios 
                usando G$ tokens. Es una economía circular donde el UBI se convierte en valor real 
                para la comunidad.
              </p>
              <p className="text-sm text-muted-foreground">
                Los vendedores pueden listar sus productos y servicios, y los compradores pueden 
                pagar con los G$ tokens que han acumulado a través del UBI diario y las tandas.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
