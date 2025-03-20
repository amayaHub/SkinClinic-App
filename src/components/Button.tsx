import { cn } from '../lib/utils';
import { ButtonHTMLAttributes, forwardRef, ElementType } from 'react';
import { Link } from 'react-router-dom';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  as?: ElementType;
  to?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', as, to, ...props }, ref) => {
    const Component = as || 'button';
    
    if (Component === Link && to) {
      return (
        <Link
          to={to}
          className={cn(
            'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50',
            variant === 'primary' && 'bg-rose-200 text-rose-950 hover:bg-rose-300',
            variant === 'secondary' && 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
            variant === 'outline' && 'border border-neutral-200 bg-white hover:bg-neutral-100',
            size === 'sm' && 'h-8 px-3 text-sm',
            size === 'md' && 'h-10 px-4',
            size === 'lg' && 'h-12 px-6 text-lg',
            className
          )}
          {...props}
        />
      );
    }

    return (
      <Component
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50',
          variant === 'primary' && 'bg-rose-200 text-rose-950 hover:bg-rose-300',
          variant === 'secondary' && 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
          variant === 'outline' && 'border border-neutral-200 bg-white hover:bg-neutral-100',
          size === 'sm' && 'h-8 px-3 text-sm',
          size === 'md' && 'h-10 px-4',
          size === 'lg' && 'h-12 px-6 text-lg',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };