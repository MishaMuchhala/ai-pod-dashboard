import { TAG_META } from '../../types';
import type { NoteEntry } from '../../types';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  entry: NoteEntry;
  onToggleInclude?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

export function NoteEntryRow({ entry, onToggleInclude, onDelete, compact = false }: Props) {
  const meta = TAG_META[entry.tag];

  return (
    <div className={clsx(
      'flex items-start gap-2 rounded-lg border',
      compact ? 'px-2.5 py-1.5' : 'px-3 py-2',
      entry.includeInUpdate !== false ? meta.color : 'bg-gray-900 border-gray-800 text-gray-500 opacity-60',
    )}>
      {onToggleInclude && (
        <input
          type="checkbox"
          checked={entry.includeInUpdate !== false}
          onChange={() => onToggleInclude(entry.id)}
          className="mt-0.5 rounded border-gray-600 bg-gray-800 accent-indigo-500 cursor-pointer shrink-0"
        />
      )}
      <span className="text-sm shrink-0">{meta.emoji}</span>
      <span className={clsx('text-sm flex-1', compact ? 'line-clamp-1' : '')}>{entry.text}</span>
      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          className="shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
