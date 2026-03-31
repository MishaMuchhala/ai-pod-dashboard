import { TAG_META } from '../../types';
import type { NoteTag } from '../../types';
import { clsx } from 'clsx';

interface Props {
  value: NoteTag;
  onChange: (tag: NoteTag) => void;
}

const TAGS: NoteTag[] = ['highlight', 'risk', 'blocker', 'callout', 'note'];

export function TagPicker({ value, onChange }: Props) {
  return (
    <div className="flex gap-1.5">
      {TAGS.map(tag => {
        const meta = TAG_META[tag];
        return (
          <button
            key={tag}
            type="button"
            title={meta.label}
            onClick={() => onChange(tag)}
            className={clsx(
              'flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium transition-all',
              value === tag
                ? meta.color + ' scale-105'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'
            )}
          >
            <span>{meta.emoji}</span>
            <span>{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
