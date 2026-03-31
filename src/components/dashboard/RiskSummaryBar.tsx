import type { Pod, RiskLevel } from '../../types';
import { RISK_META } from '../../types';

interface Props {
  pods: Pod[];
  filter: RiskLevel | null;
  onFilter: (level: RiskLevel | null) => void;
}

const LEVELS: RiskLevel[] = ['critical', 'high', 'medium', 'low'];

export function RiskSummaryBar({ pods, filter, onFilter }: Props) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {LEVELS.map(level => {
        const count = pods.filter(p => p.riskLevel === level).length;
        const meta = RISK_META[level];
        const isActive = filter === level;
        return (
          <button
            key={level}
            onClick={() => onFilter(isActive ? null : level)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${
              isActive
                ? `${meta.bg} ${meta.color} scale-105`
                : count > 0
                  ? 'bg-gray-900 border-gray-800 hover:border-gray-600 text-gray-300'
                  : 'bg-gray-900/50 border-gray-800/50 text-gray-600 cursor-default'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${meta.dot} ${level === 'critical' && count > 0 ? 'animate-pulse' : ''}`} />
            <span className="text-2xl font-bold">{count}</span>
            <div className="text-left">
              <p className="text-xs font-semibold leading-none">{meta.label}</p>
              <p className="text-xs text-gray-500 leading-none mt-0.5">pod{count !== 1 ? 's' : ''}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
