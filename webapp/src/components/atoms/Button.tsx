import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`bg-p4-yellow text-p4-black font-bold py-2 px-6 rounded-none border-2 border-p4-black shadow-[4px_4px_0px_0px_#111111] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
