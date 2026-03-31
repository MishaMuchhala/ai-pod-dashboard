import { formatDistanceToNow } from 'date-fns';
import { GitPullRequest, Bug, AlertTriangle, Shield, Clock, TrendingUp } from 'lucide-react';
import type { PodMetrics } from '../../types';

interface Props {
  metrics: PodMetrics;
}

export function MetricsGrid({ metrics }: Props) {
  const velPct = Math.round((metrics.velocity / metrics.velocityTarget) * 100);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {/* Velocity */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <TrendingUp size={14} />
          <span className="text-xs font-medium uppercase tracking-wide">Velocity</span>
        </div>
        <div className="flex items-end gap-1">
          <span className={`text-2xl font-bold ${velPct >= 90 ? 'text-green-400' : velPct >= 70 ? 'text-yellow-400' : 'text-orange-400'}`}>
            {metrics.velocity}
          </span>
          <span className="text-gray-500 text-sm mb-0.5">/ {metrics.velocityTarget} pts</span>
        </div>
        <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${velPct >= 90 ? 'bg-green-500' : velPct >= 70 ? 'bg-yellow-500' : 'bg-orange-500'}`}
            style={{ width: `${Math.min(velPct, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">{velPct}% of target</p>
      </div>

      {/* Open PRs */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <GitPullRequest size={14} />
          <span className="text-xs font-medium uppercase tracking-wide">Open PRs</span>
        </div>
        <span className="text-2xl font-bold text-white">{metrics.openPRs}</span>
        <p className="text-xs text-gray-600 mt-1">{metrics.mergedPRsThisWeek} merged this week</p>
      </div>

      {/* Open Issues */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <Bug size={14} />
          <span className="text-xs font-medium uppercase tracking-wide">Issues</span>
        </div>
        <span className="text-2xl font-bold text-white">{metrics.openIssues}</span>
        <p className="text-xs text-gray-600 mt-1">open</p>
      </div>

      {/* Blockers */}
      <div className={`bg-gray-900 border rounded-xl p-4 ${metrics.blockerCount > 0 ? 'border-orange-900' : 'border-gray-800'}`}>
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <AlertTriangle size={14} className={metrics.blockerCount > 0 ? 'text-orange-400' : ''} />
          <span className="text-xs font-medium uppercase tracking-wide">Blockers</span>
        </div>
        <span className={`text-2xl font-bold ${metrics.blockerCount > 0 ? 'text-orange-400' : 'text-white'}`}>
          {metrics.blockerCount}
        </span>
        <p className="text-xs text-gray-600 mt-1">active blockers</p>
      </div>

      {/* Test Coverage */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <Shield size={14} />
          <span className="text-xs font-medium uppercase tracking-wide">Coverage</span>
        </div>
        <span className={`text-2xl font-bold ${metrics.testCoverage >= 80 ? 'text-green-400' : metrics.testCoverage >= 60 ? 'text-yellow-400' : 'text-orange-400'}`}>
          {metrics.testCoverage}%
        </span>
        <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${metrics.testCoverage >= 80 ? 'bg-green-500' : metrics.testCoverage >= 60 ? 'bg-yellow-500' : 'bg-orange-500'}`}
            style={{ width: `${metrics.testCoverage}%` }}
          />
        </div>
      </div>

      {/* Last Deploy */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-2 text-gray-500 mb-2">
          <Clock size={14} />
          <span className="text-xs font-medium uppercase tracking-wide">Last Deploy</span>
        </div>
        <span className="text-sm font-semibold text-white">
          {formatDistanceToNow(new Date(metrics.lastDeployedAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
