import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/providers/WalletProvider';
import { NeuralBackground } from '@/components/effects/NeuralBackground';
import { FloatingParticles } from '@/components/effects/FloatingParticles';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3002'),
  title: 'LocalUBI México - UBI + Tandas Digitales',
  description: 'Recibe UBI diario y únete a tandas cooperativas en blockchain',
  openGraph: {
    title: 'LocalUBI México',
    description: 'UBI + Tandas para comunidades mexicanas',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#10b981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <WalletProvider>
          <PWAInstallBanner />
          <NeuralBackground />
          <FloatingParticles />
          {children}
          <Toaster position="top-right" />
        </WalletProvider>
      </body>
    </html>
  );
}