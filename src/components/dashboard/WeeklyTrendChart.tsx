import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { format } from 'date-fns';
import type { Pod } from '../../types';

interface Props {
  pods: Pod[];
}

export function WeeklyTrendChart({ pods }: Props) {
  // Build 4-week data
  const weeks = pods[0]?.statusHistory.map(s => s.weekOf) ?? [];

  const data = weeks.map((weekOf, wi) => {
    const counts = { low: 0, medium: 0, high: 0, critical: 0 };
    pods.forEach(pod => {
      const snap = pod.statusHistory[wi];
      if (snap) counts[snap.riskLevel]++;
    });
    return {
      week: format(new Date(weekOf), 'MMM d'),
      ...counts,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={120}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, fontSize: 12 }}
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
        />
        <Legend wrapperStyle={{ fontSize: 11, color: '#9ca3af', paddingTop: 4 }} />
        <Bar dataKey="critical" name="Critical" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
        <Bar dataKey="high" name="High" stackId="a" fill="#f97316" />
        <Bar dataKey="medium" name="Medium" stackId="a" fill="#f59e0b" />
        <Bar dataKey="low" name="Low" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
