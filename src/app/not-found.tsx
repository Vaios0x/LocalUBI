'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md mx-auto">
        {/* 404 Animation */}
        <div className="relative">
          <div className="text-8xl font-bold text-gradient">404</div>
          <div className="absolute -top-4 -right-4 text-4xl">🤖</div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Página no encontrada</h1>
          <p className="text-muted-foreground">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Ir al Inicio
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          Si crees que esto es un error, por favor{' '}
          <Link href="/support" className="text-green-500 hover:underline">
            contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}
