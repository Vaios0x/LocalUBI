'use client';

import Link from 'next/link';
import { Heart, Twitter, Github, Mail } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    product: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Claim UBI', href: '/claim' },
      { name: 'Tandas', href: '/tanda' },
      { name: 'Marketplace', href: '/marketplace' },
    ],
    support: [
      { name: 'Centro de Ayuda', href: '#' },
      { name: 'Documentación', href: '#' },
      { name: 'Comunidad', href: '#' },
      { name: 'Contacto', href: '#' },
    ],
    legal: [
      { name: 'Privacidad', href: '#' },
      { name: 'Términos', href: '#' },
      { name: 'Cookies', href: '#' },
      { name: 'Licencia', href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Email', href: '#', icon: Mail },
  ];

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold text-gradient">LocalUBI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              UBI + Tandas Digitales para comunidades mexicanas. 
              Construyendo el futuro financiero descentralizado.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Producto</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Soporte</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-muted">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 LocalUBI México. Hecho con{' '}
              <Heart className="inline w-4 h-4 text-red-500" /> para comunidades mexicanas.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Powered by Celo & GoodDollar</span>
              <span>•</span>
              <span>100% Descentralizado</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
