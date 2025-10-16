'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  color: string;
  opacity: number;
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const colors = [
      'bg-green-500/30',
      'bg-emerald-500/25',
      'bg-blue-500/20',
      'bg-purple-500/25',
      'bg-cyan-500/20',
      'bg-pink-500/25'
    ];
    
    const generatedParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size: Math.random() * 6 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.8 + 0.2,
    }));
    setParticles(generatedParticles);
  }, []);

  if (particles.length === 0) {
    return null; // Don't render anything until particles are generated
  }

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute w-2 h-2 ${particle.color} rounded-full`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
          }}
          animate={{
            y: [-30, 30, -30],
            x: [-15, 15, -15],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Additional floating elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-500/40 rounded-full"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-500/40 rounded-full"
        animate={{
          y: [20, -20, 20],
          x: [10, -10, 10],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      
      <motion.div
        className="absolute top-1/2 right-1/3 w-5 h-5 bg-purple-500/30 rounded-full"
        animate={{
          y: [-15, 15, -15],
          x: [-8, 8, -8],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />
    </div>
  );
}