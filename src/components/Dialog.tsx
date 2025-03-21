import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function Dialog({ open, onClose, children, className, title }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div 
        className="absolute inset-0 bg-black/50"
        style={{ animation: 'fadeIn 0.2s ease-out' }}
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        className={cn(
          'relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl',
          'animate-dialogSlideIn',
          className
        )}
      >
        <div className="flex items-center justify-between py-3 px-6 border-b">
          {title && <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Añadir estilos de animación
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes dialogSlideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .animate-dialogSlideIn {
    animation: dialogSlideIn 0.2s ease-out;
  }
`;
document.head.appendChild(style);