import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import type { StatusSnapshot } from '../../types';
import { RISK_META } from '../../types';

interface Props {
  history: StatusSnapshot[];
}

const RISK_COLOR: Record<string, string> = {
  low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444',
};

export function StatusHistoryChart({ history }: Props) {
  const data = history.map(h => ({
    week: format(new Date(h.weekOf), 'MMM d'),
    actual: h.velocityActual,
    target: h.velocityTarget,
    riskColor: RISK_COLOR[h.riskLevel],
    risk: RISK_META[h.riskLevel].label,
  }));

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">4-Week Velocity</h3>
      <ResponsiveContainer width="100%" height={160}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
            formatter={(v: number, name: string) => [`${v} pts`, name === 'actual' ? 'Actual' : 'Target']}
          />
          <Bar dataKey="actual" name="Actual" fill="#6366f1" radius={[4, 4, 0, 0]} opacity={0.85} />
          <Line dataKey="target" name="Target" stroke="#4b5563" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex gap-3 mt-2 flex-wrap">
        {data.map(d => (
          <div key={d.week} className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.riskColor }} />
            <span className="text-gray-500">{d.week}:</span>
            <span className="text-gray-300">{d.risk}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
