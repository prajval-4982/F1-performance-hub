'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface TeamLogoProps {
  src: string;
  name: string;
  color: string;
  size?: number | string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

const TeamLogo: React.FC<TeamLogoProps> = ({ 
  src, 
  name, 
  color, 
  size = '100%', 
  width, 
  height, 
  className = '', 
  style = {} 
}) => {
  const [error, setError] = useState(false);

  // Fallback: A colored circle with the team's first letter
  if (error || !src) {
    const initials = name.substring(0, 1).toUpperCase();
    return (
      <div 
        className={`team-logo-fallback ${className}`}
        style={{
          width: width || size,
          height: height || size,
          background: color,
          color: '#fff',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 900,
          fontFamily: 'var(--font-mono)',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
          ...style
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={`team-logo-root ${className}`} style={{ position: 'relative', width: width || size, height: height || size, ...style }}>
      <Image
        src={src}
        alt={`${name} logo`}
        fill
        style={{ objectFit: 'contain' }}
        onError={() => setError(true)}
        unoptimized
      />
    </div>
  );
};

export default TeamLogo;
