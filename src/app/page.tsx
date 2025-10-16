'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/effects/GlassCard';
import { ConnectButton } from '@/components/wallet/ConnectButton';
import { InteractiveButton } from '@/components/ui/InteractiveButton';
import { 
  ArrowRight, 
  Users, 
  Coins, 
  Shield, 
  Zap, 
  Heart, 
  TrendingUp, 
  CheckCircle,
  Sparkles,
  Star,
  Gift
} from 'lucide-react';
import Link from 'next/link';
import { useHumanWallet } from '@/hooks/useHumanWallet';

export default function HomePage() {
  const { isConnected } = useHumanWallet();

  const features = [
    { 
      icon: Coins, 
      title: 'UBI Diario', 
      description: 'Recibe G$ gratis cada día. Tu ingreso básico universal en blockchain.',
      color: 'from-green-500 to-emerald-500',
      glow: 'shadow-neural'
    },
    { 
      icon: Users, 
      title: 'Tandas Digitales', 
      description: 'Ahorra en grupo de forma segura. Transparencia total, sin intermediarios.',
      color: 'from-blue-500 to-indigo-500',
      glow: 'shadow-neural'
    },
    { 
      icon: Shield, 
      title: '100% Seguro', 
      description: 'Contratos inteligentes auditados. Tus fondos protegidos siempre.',
      color: 'from-purple-500 to-pink-500',
      glow: 'shadow-neural'
    },
    { 
      icon: Zap, 
      title: 'Sin Comisiones', 
      description: 'Transacciones gratis en Celo. Más dinero en tu bolsillo.',
      color: 'from-cyan-500 to-blue-500',
      glow: 'shadow-neural'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Usuarios activos', icon: Users },
    { value: '$2M', label: 'Ahorrado en tandas', icon: TrendingUp },
    { value: '1,000+', label: 'Tandas activas', icon: Heart },
    { value: '0.5%', label: 'Comisión', icon: Zap }
  ];

  const testimonials = [
    { 
      name: 'María González', 
      role: 'Artesana, Oaxaca', 
      content: 'Con LocalUBI ahorro $500 al mes en mi tanda. ¡Primera vez tengo ahorro formal!',
      avatar: '/avatars/maria.jpg',
      rating: 5
    },
    { 
      name: 'Carlos Ramírez', 
      role: 'Comerciante, Puebla', 
      content: 'El UBI diario me ayuda con gastos pequeños. Y las tandas son súper confiables.',
      avatar: '/avatars/carlos.jpg',
      rating: 5
    },
    { 
      name: 'Ana López', 
      role: 'Maestra, Querétaro', 
      content: 'Creé una tanda con mis compañeras. En 6 meses juntamos $30,000 pesos.',
      avatar: '/avatars/ana.jpg',
      rating: 5
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Header */}
      <header className="relative z-10 w-full p-4 md:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-white group">
          <motion.div 
            className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-white font-bold text-lg">L</span>
          </motion.div>
          <span className="text-gradient text-3xl font-extrabold">LocalUBI</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-white/80">
          <a href="#how-it-works" className="hover:text-white transition-colors duration-300 hover:scale-105">
            Cómo Funciona
          </a>
          <a href="#tandas" className="hover:text-white transition-colors duration-300 hover:scale-105">
            Tandas
          </a>
          <a href="#testimonials" className="hover:text-white transition-colors duration-300 hover:scale-105">
            Testimonios
          </a>
        </nav>
        
        <ConnectButton />
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-16 md:py-24">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-glass border border-white/20"
            >
              <Sparkles className="w-4 h-4" />
              Powered by GoodDollar & Celo
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-7xl font-extrabold leading-tight text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              UBI + Tandas{' '}
              <span className="text-gradient text-6xl md:text-7xl font-extrabold">
                para tu comunidad
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/80 mb-8 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Recibe ingreso básico universal cada día y ahorra en tandas digitales. 
              100% transparente, seguro y sin intermediarios.
            </motion.p>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + idx * 0.1, duration: 0.5 }}
                >
                  <GlassCard className="p-4 text-center neural" hover={false}>
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-white/70">{stat.label}</p>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {isConnected ? (
                <>
                  <InteractiveButton 
                    href="/dashboard"
                    variant="neural"
                    size="lg"
                    className="px-8 py-4 text-lg"
                    icon={<ArrowRight className="ml-2 h-5 w-5" />}
                  >
                    Ir al Dashboard
                  </InteractiveButton>
                  <InteractiveButton 
                    href="/claim"
                    variant="glass"
                    size="lg"
                    className="px-8 py-4 text-lg"
                    icon={<Gift className="mr-2 h-5 w-5" />}
                  >
                    Claim UBI Diario
                  </InteractiveButton>
                </>
              ) : (
                <>
                  <InteractiveButton 
                    variant="neural"
                    size="lg"
                    className="px-8 py-4 text-lg"
                    icon={<ArrowRight className="ml-2 h-5 w-5" />}
                  >
                    Comenzar Ahora
                  </InteractiveButton>
                  <InteractiveButton 
                    variant="glass"
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    Ver Demo
                  </InteractiveButton>
                </>
              )}
            </motion.div>
            
            <motion.p 
              className="text-sm text-white/60 mt-6 flex items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Sin ID requerido
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Gratis para siempre
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                100% descentralizado
              </span>
            </motion.p>
          </motion.div>

          {/* Right: Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative hidden lg:flex justify-center items-center"
          >
            <div className="relative w-[500px] h-[600px] rounded-3xl p-8 neural-gradient-animated flex flex-col justify-between shadow-2xl">
              {/* UBI Claim Card */}
              <GlassCard variant="neural" className="p-6 mb-6 flex-shrink-0" hover={false}>
                <div className="flex items-center justify-between text-white/80 text-sm mb-2">
                  <span>UBI Disponible</span>
                  <Gift className="w-5 h-5" />
                </div>
                <p className="text-5xl font-bold text-white mb-4">50 G$</p>
                <InteractiveButton 
                  size="sm" 
                  variant="neural"
                  className="w-full"
                >
                  Claim Ahora
                </InteractiveButton>
              </GlassCard>

              {/* Tanda Preview */}
              <GlassCard variant="glow" className="p-6 flex-grow mb-6" hover={false}>
                <h3 className="text-xl font-semibold text-white mb-4">Tu Tanda Activa</h3>
                <div className="space-y-3 text-white/80">
                  <div className="flex justify-between">
                    <span>Monto mensual</span>
                    <span className="font-semibold">500 G$</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Participantes</span>
                    <span className="font-semibold">8/10</span>
                  </div>
                  <div className="h-3 bg-white/20 rounded-full overflow-hidden mt-3">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                      initial={{ width: '0%' }}
                      animate={{ width: '80%' }}
                      transition={{ duration: 2, delay: 1 }}
                    />
                  </div>
                  <p className="text-sm mt-3">Ronda 3 de 10 • Siguiente pago: 5 días</p>
                </div>
              </GlassCard>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                <GlassCard className="p-4 text-center" hover={false}>
                  <p className="text-2xl font-bold text-white">$4,000</p>
                  <p className="text-xs text-white/70">Ahorrado total</p>
                </GlassCard>
                <GlassCard className="p-4 text-center" hover={false}>
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-xs text-white/70">Tandas activas</p>
                </GlassCard>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -top-4 left-1/4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm px-4 py-2 rounded-full shadow-lg rotate-3 neural-glow"
            >
              ✨ 100% Gratis
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -bottom-4 right-1/4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm px-4 py-2 rounded-full shadow-lg -rotate-6 neural-glow"
            >
              🔒 Super Seguro
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-gradient mb-4"
          >
            Todo lo que necesitas
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-white/80 mb-16 max-w-2xl mx-auto"
          >
            UBI, tandas y más. Todo en una sola app.
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <GlassCard 
                  className="p-8 h-full flex flex-col items-center text-center neural" 
                  variant="neural"
                >
                  <motion.div 
                    className={`p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/80 text-lg">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-gradient mb-4"
          >
            Historias reales
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-white/80 mb-16 max-w-2xl mx-auto"
          >
            Usuarios de todo México confían en LocalUBI
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <GlassCard className="p-8 h-full flex flex-col" variant="glow">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-lg">{testimonial.name}</p>
                      <p className="text-sm text-white/70">{testimonial.role}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-white/90 italic text-lg leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 md:py-32">
        <div className="container mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-6xl font-bold text-gradient mb-6"
          >
            ¿Listo para empezar?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-2xl text-white/90 mb-10 max-w-3xl mx-auto"
          >
            Únete a miles de mexicanos que ya ahorran con LocalUBI
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <InteractiveButton 
              size="xl" 
              variant="neural"
              className="px-12 py-6 text-2xl shadow-2xl"
              icon={<ArrowRight className="ml-3 h-6 w-6" />}
            >
              Crear Cuenta Gratis
            </InteractiveButton>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-white/70 mt-8"
          >
            Sin tarjeta de crédito • Sin ID • Sin complicaciones
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 md:py-16">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-white/80 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-xl font-bold text-gradient">LocalUBI México</span>
          </div>
          
          <p className="text-center md:text-left">
            © 2025 LocalUBI. Hecho con <Heart className="inline w-4 h-4 text-red-500" /> para comunidades mexicanas.
          </p>
          
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Términos
            </Link>
            <Link href="/support" className="hover:text-white transition-colors">
              Soporte
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}