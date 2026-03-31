import { useNavigate } from 'react-router-dom';
import { RiskBadge } from '../shared/RiskBadge';
import { VelocitySparkline } from './VelocitySparkline';
import { formatDistanceToNow } from 'date-fns';
import { GitBranch, AlertTriangle, Clock } from 'lucide-react';
import type { Pod, MeetingNote } from '../../types';

interface Props {
  pod: Pod;
  latestNote?: MeetingNote;
}

export function PodCard({ pod, latestNote }: Props) {
  const navigate = useNavigate();
  const velPct = Math.round((pod.metrics.velocity / pod.metrics.velocityTarget) * 100);

  return (
    <div
      onClick={() => navigate(`/pods/${pod.id}`)}
      className="bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-gray-700 hover:bg-gray-800/60 transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl">{pod.emoji}</span>
          <div className="min-w-0">
            <h3 className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors truncate">
              {pod.name}
            </h3>
            <p className="text-xs text-gray-500 truncate">{pod.currentSprint}</p>
          </div>
        </div>
        <RiskBadge level={pod.riskLevel} size="sm" pulse />
      </div>

      {/* Sparkline */}
      <div className="mb-2">
        <VelocitySparkline history={pod.statusHistory} />
      </div>

      {/* Metrics row */}
      <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
        <span className={velPct >= 90 ? 'text-green-400' : velPct >= 70 ? 'text-yellow-400' : 'text-orange-400'}>
          {pod.metrics.velocity}/{pod.metrics.velocityTarget} pts
        </span>
        <span className="flex items-center gap-1">
          <GitBranch size={11} />
          {pod.metrics.openPRs} PRs
        </span>
        {pod.metrics.blockerCount > 0 && (
          <span className="flex items-center gap-1 text-orange-400">
            <AlertTriangle size={11} />
            {pod.metrics.blockerCount} blocker{pod.metrics.blockerCount > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Velocity bar */}
      <div className="h-1 bg-gray-800 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all ${velPct >= 90 ? 'bg-green-500' : velPct >= 70 ? 'bg-yellow-500' : 'bg-orange-500'}`}
          style={{ width: `${Math.min(velPct, 100)}%` }}
        />
      </div>

      {/* Latest note */}
      {latestNote && (
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Clock size={10} />
          <span className="truncate">
            {latestNote.title} · {formatDistanceToNow(new Date(latestNote.createdAt), { addSuffix: true })}
          </span>
        </div>
      )}

      {/* Contacts */}
      <div className="mt-2 flex gap-2 text-xs text-gray-600">
        <span>TPM: {pod.tpmName.split(' ')[0]}</span>
        <span>·</span>
        <span>Eng: {pod.engineeringLead.split(' ')[0]}</span>
      </div>
    </div>
  );
}
