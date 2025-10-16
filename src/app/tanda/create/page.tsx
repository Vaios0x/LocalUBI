'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/effects/GlassCard';
import { Button } from '@/components/ui/button';
import { useTanda } from '@/hooks/useTanda';
import { 
  Users, 
  DollarSign, 
  Calendar,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CreateTandaPage() {
  const { createTanda } = useTanda();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monthlyAmount: 500,
    maxMembers: 8,
    frequency: 30, // days
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsCreating(true);
    try {
      await createTanda.mutateAsync({
        amount: formData.monthlyAmount,
        members: formData.maxMembers,
        frequency: formData.frequency * 24 * 60 * 60, // Convert to seconds
      });
      
      toast.success('¡Tanda creada exitosamente!');
      // Redirect to dashboard or tanda detail
    } catch (error) {
      console.error('Error creating tanda:', error);
      toast.error('Error al crear la tanda');
    } finally {
      setIsCreating(false);
    }
  };

  const steps = [
    { number: 1, title: 'Información Básica', icon: Users },
    { number: 2, title: 'Configuración', icon: DollarSign },
    { number: 3, title: 'Confirmación', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Crear Nueva Tanda</h1>
            <p className="text-muted-foreground">Configura tu tanda digital paso a paso</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-8 mb-8">
          {steps.map((stepItem, idx) => (
            <div key={idx} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step >= stepItem.number 
                  ? 'border-green-500 bg-green-500 text-white' 
                  : 'border-muted text-muted-foreground'
              }`}>
                {step > stepItem.number ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <stepItem.icon className="w-5 h-5" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  step >= stepItem.number ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {stepItem.title}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-16 h-0.5 ml-4 ${
                  step > stepItem.number ? 'bg-green-500' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <GlassCard className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Información Básica</h2>
                  <p className="text-muted-foreground mb-6">
                    Proporciona los detalles básicos de tu tanda
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nombre de la Tanda *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ej: Tanda Familia González"
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Descripción (Opcional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe el propósito de esta tanda..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNext} disabled={!formData.name}>
                    Siguiente
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Configuración Financiera</h2>
                  <p className="text-muted-foreground mb-6">
                    Define los parámetros económicos de tu tanda
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Monto Mensual (G$) *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        value={formData.monthlyAmount}
                        onChange={(e) => handleInputChange('monthlyAmount', parseInt(e.target.value))}
                        placeholder="500"
                        min="100"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mínimo: 100 G$ • Máximo: 10,000 G$
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Número de Participantes *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        value={formData.maxMembers}
                        onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value))}
                        placeholder="8"
                        min="3"
                        max="20"
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mínimo: 3 • Máximo: 20 participantes
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Frecuencia de Pagos *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                      value={formData.frequency}
                      onChange={(e) => handleInputChange('frequency', parseInt(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={7}>Semanal (7 días)</option>
                      <option value={15}>Quincenal (15 días)</option>
                      <option value={30}>Mensual (30 días)</option>
                      <option value={60}>Bimestral (60 días)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Anterior
                  </Button>
                  <Button onClick={handleNext}>
                    Siguiente
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Confirmación</h2>
                  <p className="text-muted-foreground mb-6">
                    Revisa los detalles antes de crear tu tanda
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h3 className="font-semibold text-lg">{formData.name}</h3>
                    {formData.description && (
                      <p className="text-muted-foreground mt-1">{formData.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Monto Mensual</p>
                      <p className="text-xl font-semibold">{formData.monthlyAmount} G$</p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Participantes</p>
                      <p className="text-xl font-semibold">{formData.maxMembers}</p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Frecuencia</p>
                      <p className="text-xl font-semibold">{formData.frequency} días</p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <p className="text-sm text-muted-foreground">Duración Total</p>
                      <p className="text-xl font-semibold">
                        {formData.frequency * formData.maxMembers} días
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-700">Información Importante</h4>
                        <ul className="text-sm text-green-600 mt-2 space-y-1">
                          <li>• La tanda se activará automáticamente cuando se complete el número de participantes</li>
                          <li>• El orden de pago se asignará aleatoriamente al inicio</li>
                          <li>• Se cobrará una comisión del 0.5% por transacción</li>
                          <li>• Puedes invitar participantes compartiendo el enlace de la tanda</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    Anterior
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isCreating}
                    className="min-w-[120px]"
                  >
                    {isCreating ? 'Creando...' : 'Crear Tanda'}
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
