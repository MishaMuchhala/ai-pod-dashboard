import { useState } from 'react';
import { RiskSummaryBar } from '../components/dashboard/RiskSummaryBar';
import { WeeklyTrendChart } from '../components/dashboard/WeeklyTrendChart';
import { DashboardGrid } from '../components/dashboard/DashboardGrid';
import type { Pod, MeetingNote, RiskLevel } from '../types';
import { format } from 'date-fns';

interface Props {
  pods: Pod[];
  notes: MeetingNote[];
}

export function DashboardPage({ pods, notes }: Props) {
  const [filter, setFilter] = useState<RiskLevel | null>(null);

  const criticalCount = pods.filter(p => p.riskLevel === 'critical').length;
  const highCount = pods.filter(p => p.riskLevel === 'high').length;

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Pod Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {format(new Date(), 'EEEE, MMMM d, yyyy')} · {pods.length} pods
          </p>
        </div>
        {(criticalCount > 0 || highCount > 0) && (
          <div className="flex items-center gap-2 bg-red-950/50 border border-red-900 rounded-xl px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm text-red-400 font-medium">
              {criticalCount > 0 && `${criticalCount} critical`}
              {criticalCount > 0 && highCount > 0 && ', '}
              {highCount > 0 && `${highCount} high`} risk — needs attention
            </span>
          </div>
        )}
      </div>

      {/* Risk summary */}
      <RiskSummaryBar pods={pods} filter={filter} onFilter={setFilter} />

      {/* Weekly trend */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Portfolio Risk — 4 Week Trend
        </h3>
        <WeeklyTrendChart pods={pods} />
      </div>

      {/* Pod grid */}
      {filter && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Filtering by:</span>
          <button
            onClick={() => setFilter(null)}
            className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-2 py-0.5 rounded-full hover:border-gray-500"
          >
            {filter.toUpperCase()} ✕
          </button>
        </div>
      )}
      <DashboardGrid pods={pods} notes={notes} filter={filter} />
    </div>
  );
}
