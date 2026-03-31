import { useState } from 'react';
import { RiskBadge } from '../shared/RiskBadge';
import { NoteEntryRow } from '../shared/NoteEntryRow';
import { Copy, Check, Send, ChevronDown, ChevronRight } from 'lucide-react';
import type { WeeklyUpdate, PodUpdateSummary, NoteTag } from '../../types';
import { TAG_META } from '../../types';
import { format } from 'date-fns';
import { clsx } from 'clsx';

interface Props {
  update: WeeklyUpdate;
  onBodyChange: (body: string) => void;
  onMarkSent: () => void;
}

const TAG_ORDER: NoteTag[] = ['highlight', 'blocker', 'risk', 'callout', 'note'];

function PodSummaryBlock({ summary }: { summary: PodUpdateSummary }) {
  const [open, setOpen] = useState(summary.riskLevel === 'critical' || summary.riskLevel === 'high');

  const entryCount =
    summary.highlights.length + summary.blockers.length +
    summary.risks.length + summary.callouts.length + summary.generalNotes.length;

  const grouped: Record<NoteTag, string[]> = {
    highlight: summary.highlights,
    blocker: summary.blockers,
    risk: summary.risks,
    callout: summary.callouts,
    note: summary.generalNotes,
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors"
      >
        {open ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
        <span className="font-medium text-white text-sm flex-1 text-left">{summary.podName}</span>
        <RiskBadge level={summary.riskLevel} size="sm" />
        {entryCount > 0 && (
          <span className="text-xs text-gray-600">{entryCount} items</span>
        )}
      </button>

      {open && (
        <div className="border-t border-gray-800 px-4 py-3 space-y-3">
          {entryCount === 0 && (
            <p className="text-xs text-gray-600 italic">No tagged entries this week for this pod.</p>
          )}
          {TAG_ORDER.map(tag => {
            const items = grouped[tag];
            if (!items.length) return null;
            const meta = TAG_META[tag];
            return (
              <div key={tag}>
                <p className="text-xs font-semibold text-gray-500 mb-1.5">{meta.emoji} {meta.label}</p>
                <div className="space-y-1">
                  {items.map((text, i) => (
                    <NoteEntryRow
                      key={i}
                      entry={{ id: `${tag}-${i}`, tag, text, createdAt: '', includeInUpdate: true }}
                      compact
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function UpdateComposer({ update, onBodyChange, onMarkSent }: Props) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'review' | 'preview'>('review');

  function handleCopy() {
    navigator.clipboard.writeText(update.body).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-white">{update.subject}</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Generated {format(new Date(update.generatedAt), 'PPp')}
            {update.sentAt && <> · Sent {format(new Date(update.sentAt), 'PPp')}</>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
          >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          {!update.sentAt && (
            <button
              onClick={onMarkSent}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              <Send size={13} />
              Mark Sent
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 px-6">
        {(['review', 'preview'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors capitalize',
              tab === t
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-gray-500 hover:text-gray-300'
            )}
          >
            {t === 'review' ? 'Review by Pod' : 'Message Preview'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'review' ? (
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs text-gray-600 mb-4">
              These are this week's tagged items by pod. Toggle items in the notes to include/exclude from the update.
            </p>
            {update.podSummaries.map(summary => (
              <PodSummaryBlock key={summary.podId} summary={summary} />
            ))}
          </div>
        ) : (
          <div className="max-w-2xl">
            <p className="text-xs text-gray-600 mb-3">Edit the message directly before copying or sending.</p>
            <textarea
              value={update.body}
              onChange={e => onBodyChange(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-300 font-mono focus:outline-none focus:border-indigo-500 resize-none"
              rows={40}
            />
          </div>
        )}
      </div>
    </div>
  );
}
