'use client';

import { Button } from './button';
import { ArrowRight, Gift } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface InteractiveButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'outline' | 'neural' | 'glass';
  size?: 'sm' | 'default' | 'lg' | 'xl';
  className?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-describedby'?: string;
  tabIndex?: number;
}

export function InteractiveButton({ 
  children, 
  href, 
  onClick, 
  variant = 'default', 
  size = 'lg',
  className = '',
  icon,
  disabled = false,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  tabIndex = 0,
  ...props 
}: InteractiveButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'neural':
        return 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg neural-glow-lg';
      case 'glass':
        return 'text-white border-white/30 hover:bg-white/10 btn-glass';
      case 'outline':
        return 'text-white border-white/30 hover:bg-white/10';
      default:
        return 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg neural-glow-lg';
    }
  };

  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        size={size}
        className={`${getVariantClasses()} ${className}`}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        tabIndex={tabIndex}
        {...props}
      >
        {icon && <span className="mr-2" aria-hidden="true">{icon}</span>}
        {children}
      </Button>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
}
