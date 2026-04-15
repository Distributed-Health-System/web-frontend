'use client';

import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 32, height = 32, className }: LogoProps) {
  return (
    <Image
      src="/assets/logo/logo.svg"
      alt="Healthcare Platform Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
