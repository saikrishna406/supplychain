
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = true }) => {
  return (
    <div className={`
      brutal-card rounded-none p-6 
      ${className}
    `}>
      {children}
    </div>
  );
};
