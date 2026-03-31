import { PodCard } from './PodCard';
import type { Pod, MeetingNote, RiskLevel } from '../../types';

interface Props {
  pods: Pod[];
  notes: MeetingNote[];
  filter: RiskLevel | null;
}

export function DashboardGrid({ pods, notes, filter }: Props) {
  const filtered = filter ? pods.filter(p => p.riskLevel === filter) : pods;

  function latestNoteFor(podId: string): MeetingNote | undefined {
    return notes
      .filter(n => n.podId === podId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {filtered.map(pod => (
        <PodCard
          key={pod.id}
          pod={pod}
          latestNote={latestNoteFor(pod.id)}
        />
      ))}
      {filtered.length === 0 && (
        <div className="col-span-full text-center text-gray-600 py-16">
          No pods match this filter.
        </div>
      )}
    </div>
  );
}
