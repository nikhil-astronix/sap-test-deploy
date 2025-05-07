import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'px-4 py-2 rounded text-white font-medium',
          variant === 'default' && 'bg-emerald-600 hover:bg-emerald-700',
          variant === 'outline' && 'bg-[#F4F6F8]  border-gray-300 text-gray-700 hover:bg-gray-100',
          variant === 'ghost' && 'bg-transparent text-[#000] hover:underline focus:ring-emerald-500',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
