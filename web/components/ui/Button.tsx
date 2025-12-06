import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'font-medium rounded-[18px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-b from-[#dc143c] to-[#8b0000] text-white shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] hover:opacity-90',
    secondary: 'bg-white/5 border-2 border-white/20 text-white hover:bg-white/10',
    outline: 'border-2 border-[#dc143c]/30 bg-[#dc143c]/10 text-[#dc143c] hover:bg-[#dc143c]/20',
    ghost: 'bg-white/[0.00001] text-white hover:bg-white/5 shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1)]',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm h-10',
    md: 'px-6 py-4 text-base h-[72px]',
    lg: 'px-8 py-5 text-lg h-20',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
