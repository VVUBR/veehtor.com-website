import { Button } from '@/components/ui/button';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GlareButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

const GlareButton = forwardRef<HTMLButtonElement, GlareButtonProps>(
  ({ className, children, variant = 'default', size = 'lg', ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn('glare-effect relative overflow-hidden font-semibold', className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

GlareButton.displayName = 'GlareButton';

export default GlareButton;
