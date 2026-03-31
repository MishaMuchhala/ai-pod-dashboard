import { RISK_META } from '../../types';
import type { RiskLevel } from '../../types';
import { clsx } from 'clsx';

interface Props {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
}

export function RiskBadge({ level, size = 'md', pulse = false }: Props) {
  const meta = RISK_META[level];
  const sizes = {
    sm: 'px-1.5 py-0.5 text-xs gap-1',
    md: 'px-2 py-0.5 text-xs gap-1.5',
    lg: 'px-3 py-1 text-sm gap-1.5',
  };

  return (
    <span className={clsx(
      'inline-flex items-center rounded-full border font-semibold tracking-wide',
      meta.bg, meta.color, sizes[size]
    )}>
      <span className={clsx('rounded-full', size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2', meta.dot, pulse && level === 'critical' && 'animate-pulse')} />
      {meta.label}
    </span>
  );
}
