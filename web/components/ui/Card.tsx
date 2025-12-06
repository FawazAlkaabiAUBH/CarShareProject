import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'solid';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'glass',
  onClick,
}) => {
  const variants = {
    default: 'bg-[#101828] border-2 border-white/10',
    glass: 'bg-white/5 border-2 border-white/10',
    solid: 'bg-[#101828]',
  };
  
  return (
    <div
      className={`
        rounded-[18px] p-5
        ${variants[variant]}
        ${onClick ? 'cursor-pointer hover:bg-white/10 transition-all' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
