'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'strong' | 'neural' | 'glow';
  hover?: boolean;
  shimmer?: boolean;
  neural?: boolean;
}

export function GlassCard({ 
  children, 
  className, 
  variant = 'default', 
  hover = true, 
  shimmer = false,
  neural = false,
  ...props 
}: GlassCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'strong':
        return 'glass-morphism-strong';
      case 'neural':
        return 'glass-morphism neural-glow';
      case 'glow':
        return 'glass-morphism neural-glow-lg';
      default:
        return 'glass-morphism';
    }
  };

  return (
    <motion.div 
      className={cn(
        'rounded-2xl border backdrop-blur-glass transition-all duration-300',
        getVariantClasses(),
        shimmer && 'shimmer',
        neural && 'neural-glow',
        hover && 'hover:scale-105 hover:shadow-neural-lg',
        className
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={hover ? { 
        scale: 1.02, 
        boxShadow: '0 20px 40px 0 rgba(31, 38, 135, 0.25)',
        y: -5
      } : undefined}
      transition={{ 
        duration: 0.3, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100
      }}
      {...props}
    >
      {/* Shimmer effect overlay */}
      {shimmer && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="shimmer-overlay" />
        </div>
      )}
      
      {/* Neural glow effect */}
      {neural && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 opacity-50" />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}