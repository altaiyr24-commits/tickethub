import { cn } from '@/lib/utils';

const variants = {
  default:  'bg-white/10 text-white/70',
  primary:  'bg-brand-500/20 text-brand-400 border border-brand-500/30',
  success:  'bg-green-500/20 text-green-400',
  warning:  'bg-yellow-500/20 text-yellow-400',
  danger:   'bg-red-500/20 text-red-400',
  hot:      'bg-red-500 text-white',
  featured: 'bg-brand-500 text-white',
};

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span className={cn('badge', variants[variant], className)}>
      {children}
    </span>
  );
}
