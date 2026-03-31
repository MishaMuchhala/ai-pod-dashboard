import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import type { StatusSnapshot } from '../../types';

interface Props {
  history: StatusSnapshot[];
}

export function VelocitySparkline({ history }: Props) {
  const data = history.map(h => ({
    actual: h.velocityActual,
    target: h.velocityTarget,
  }));

  const isOnTrack = data.every(d => d.actual >= d.target * 0.85);

  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Tooltip
          contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 6, fontSize: 11 }}
          formatter={(v: number) => [`${v} pts`]}
          labelFormatter={() => ''}
        />
        <Line
          type="monotone"
          dataKey="actual"
          stroke={isOnTrack ? '#22c55e' : '#f97316'}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#4b5563"
          strokeWidth={1}
          strokeDasharray="3 3"
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
