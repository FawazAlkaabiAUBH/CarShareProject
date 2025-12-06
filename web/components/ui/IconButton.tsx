import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = 'md',
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'w-10 h-10',
    md: 'w-[45px] h-[45px]',
    lg: 'w-14 h-14',
  };
  
  return (
    <button
      className={`
        ${sizes[size]}
        flex items-center justify-center
        bg-white/[0.00001] rounded-full
        shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]
        hover:bg-white/10 transition-all
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
};
