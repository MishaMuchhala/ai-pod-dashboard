import { NavLink } from 'react-router-dom';
import { RiskBadge } from '../shared/RiskBadge';
import { formatDistanceToNow } from 'date-fns';
import type { Pod, MeetingNote } from '../../types';
import { RISK_META } from '../../types';
import { clsx } from 'clsx';

interface Props {
  pods: Pod[];
  notes: MeetingNote[];
}

const RISK_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

export function Sidebar({ pods, notes }: Props) {
  const sorted = [...pods].sort(
    (a, b) => RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]
  );

  function lastNoteFor(podId: string): MeetingNote | undefined {
    return notes
      .filter(n => n.podId === podId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }

  return (
    <nav className="w-56 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col h-full overflow-y-auto">
      <div className="px-3 py-3 border-b border-gray-800">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pods</p>
      </div>
      <div className="flex-1 py-1">
        {sorted.map(pod => {
          const last = lastNoteFor(pod.id);
          const meta = RISK_META[pod.riskLevel];
          return (
            <NavLink
              key={pod.id}
              to={`/pods/${pod.id}`}
              className={({ isActive }) => clsx(
                'flex flex-col px-3 py-2.5 hover:bg-gray-800 transition-colors border-l-2',
                isActive
                  ? `bg-gray-800 ${meta.color} border-current`
                  : 'border-transparent text-gray-300'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-base leading-none">{pod.emoji}</span>
                <span className="text-sm font-medium truncate flex-1">{pod.name}</span>
                <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', meta.dot,
                  pod.riskLevel === 'critical' && 'animate-pulse'
                )} />
              </div>
              {last && (
                <p className="text-xs text-gray-600 mt-0.5 pl-6 truncate">
                  {formatDistanceToNow(new Date(last.createdAt), { addSuffix: true })}
                </p>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
