'use client';

import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 24, className }: IconProps) {
  const IconComponent = LucideIcons[name] as React.ComponentType<{ size?: number; className?: string }>;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }
  
  return <IconComponent size={size} className={className} />;
}
