import { useInView } from '../hooks/useInView';
import { cn } from '../lib/utils';

interface AnimatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export function AnimatedImage({ wrapperClassName, className, ...props }: AnimatedImageProps) {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'relative transition-all duration-1000 ease-out',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        wrapperClassName
      )}
    >
      <img
        className={cn('w-full h-full object-cover', className)}
        {...props}
      />
    </div>
  );
}