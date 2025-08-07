'use client';

import React from 'react';

const Button = ({ 
  children,
  color = 'blue',
  size = 'md',
  icon,
  onClick,
  disabled = false,
  className = '',
  ...props
}) => {
  
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm', 
    lg: 'px-6 py-3 text-base'
  };
  
  // Color styles
  const colorStyles = {
    blue: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    green: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    red: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    gray: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500'
  };
  
  const buttonClasses = `${baseStyles} ${sizeStyles[size]} ${colorStyles[color]} ${className}`;
  
  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && (
        <span className="mr-2">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;