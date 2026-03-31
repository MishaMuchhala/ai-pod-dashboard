import { useNavigate } from 'react-router-dom';
import { NoteEntryRow } from '../shared/NoteEntryRow';
import { format } from 'date-fns';
import { FileText, BookOpen, Plus } from 'lucide-react';
import type { MeetingNote, JournalEntry } from '../../types';
import { TAG_META } from '../../types';

interface Props {
  podId: string;
  notes: MeetingNote[];
  journals: JournalEntry[];
}

type TimelineItem =
  | { kind: 'note'; data: MeetingNote; date: Date }
  | { kind: 'journal'; data: JournalEntry; date: Date };

export function NoteTimeline({ podId, notes, journals }: Props) {
  const navigate = useNavigate();

  const items: TimelineItem[] = [
    ...notes.map(n => ({ kind: 'note' as const, data: n, date: new Date(n.meetingDate) })),
    ...journals.map(j => ({ kind: 'journal' as const, data: j, date: new Date(j.createdAt) })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600">
        <FileText size={32} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">No notes yet.</p>
        <button
          onClick={() => navigate(`/pods/${podId}/note/new`)}
          className="mt-3 text-sm text-indigo-400 hover:text-indigo-300"
        >
          Add first meeting note
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
          Notes & Journal ({items.length})
        </h3>
        <button
          onClick={() => navigate(`/pods/${podId}/note/new`)}
          className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
        >
          <Plus size={13} />
          Add Note
        </button>
      </div>

      {items.map(item => (
        <div
          key={item.kind === 'note' ? item.data.id : item.data.id}
          className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
        >
          {/* Header */}
          <div className="flex items-start justify-between px-4 py-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              {item.kind === 'note'
                ? <FileText size={14} className="text-indigo-400 shrink-0" />
                : <BookOpen size={14} className="text-purple-400 shrink-0" />
              }
              <div>
                <p className="text-sm font-medium text-white">
                  {item.kind === 'note' ? item.data.title : 'Journal Entry'}
                </p>
                <p className="text-xs text-gray-500">
                  {format(item.date, 'MMM d, yyyy')}
                  {item.kind === 'note' && item.data.attendees.length > 0 && (
                    <> · {item.data.attendees.join(', ')}</>
                  )}
                  {item.kind === 'journal' && <> · by {item.data.authorName}</>}
                </p>
              </div>
            </div>
            {item.kind === 'note' && (
              <button
                onClick={() => navigate(`/pods/${podId}/note/${item.data.id}`)}
                className="text-xs text-gray-500 hover:text-gray-300 shrink-0"
              >
                Edit
              </button>
            )}
          </div>

          {/* Tag summary pills */}
          <div className="px-4 py-2 flex gap-1 flex-wrap border-b border-gray-800/60">
            {(['highlight', 'risk', 'blocker', 'callout', 'note'] as const).map(tag => {
              const count = item.data.entries.filter(e => e.tag === tag).length;
              if (count === 0) return null;
              const meta = TAG_META[tag];
              return (
                <span key={tag} className={`text-xs px-1.5 py-0.5 rounded border ${meta.color}`}>
                  {meta.emoji} {count}
                </span>
              );
            })}
          </div>

          {/* Entries */}
          <div className="px-4 py-3 space-y-1.5">
            {item.data.entries.slice(0, 3).map(entry => (
              <NoteEntryRow key={entry.id} entry={entry} compact />
            ))}
            {item.data.entries.length > 3 && (
              <p className="text-xs text-gray-600 pl-2">
                +{item.data.entries.length - 3} more entries
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
