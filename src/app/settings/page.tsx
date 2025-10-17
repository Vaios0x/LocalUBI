'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';
import { useHumanWallet } from '@/hooks/useHumanWallet';
import { 
  User, 
  Bell, 
  Shield, 
  Globe,
  Moon,
  Sun,
  LogOut,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { address, disconnect } = useHumanWallet();
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    language: 'es',
    currency: 'G$',
    privacy: 'public'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Configuración actualizada');
  };

  const handleExportData = () => {
    // Mock data export
    const data = {
      address,
      settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'localubi-data.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Datos exportados exitosamente');
  };

  const handleDeleteAccount = () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      toast.success('Cuenta eliminada');
      disconnect();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gradient">Configuración</h1>
          <p className="text-muted-foreground">
            Gestiona tu cuenta y preferencias de LocalUBI
          </p>
        </div>

        {/* Account Settings */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20">
              <User className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Cuenta</h2>
              <p className="text-sm text-muted-foreground">
                Gestiona tu información de cuenta
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dirección de Wallet</p>
                <p className="text-sm text-muted-foreground">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Copiar
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Privacidad</p>
                <p className="text-sm text-muted-foreground">
                  {settings.privacy === 'public' ? 'Público' : 'Privado'}
                </p>
              </div>
              <select
                value={settings.privacy}
                onChange={(e) => handleSettingChange('privacy', e.target.value)}
                className="px-3 py-2 rounded-lg border border-input bg-background"
              >
                <option value="public">Público</option>
                <option value="private">Privado</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Appearance Settings */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Apariencia</h2>
              <p className="text-sm text-muted-foreground">
                Personaliza tu experiencia visual
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tema</p>
                <p className="text-sm text-muted-foreground">
                  {settings.theme === 'light' ? 'Claro' : 'Oscuro'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={settings.theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSettingChange('theme', 'light')}
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Claro
                </Button>
                <Button
                  variant={settings.theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleSettingChange('theme', 'dark')}
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Oscuro
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Idioma</p>
                <p className="text-sm text-muted-foreground">
                  {settings.language === 'es' ? 'Español' : 'English'}
                </p>
              </div>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="px-3 py-2 rounded-lg border border-input bg-background"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <Bell className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Notificaciones</h2>
              <p className="text-sm text-muted-foreground">
                Configura cómo recibes notificaciones
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notificaciones Push</p>
                <p className="text-sm text-muted-foreground">
                  Recibe notificaciones en tiempo real
                </p>
              </div>
              <Button
                variant={settings.notifications ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSettingChange('notifications', !settings.notifications)}
              >
                {settings.notifications ? 'Activado' : 'Desactivado'}
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Security */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20">
              <Shield className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Seguridad</h2>
              <p className="text-sm text-muted-foreground">
                Gestiona la seguridad de tu cuenta
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Exportar Datos</p>
                <p className="text-sm text-muted-foreground">
                  Descarga una copia de tus datos
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-500">Eliminar Cuenta</p>
                <p className="text-sm text-muted-foreground">
                  Esta acción no se puede deshacer
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteAccount}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => disconnect()}>
            <LogOut className="w-4 h-4 mr-2" />
            Desconectar
          </Button>
          <Button>
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
