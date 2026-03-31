import { useState } from 'react';
import { TagPicker } from '../shared/TagPicker';
import { NoteEntryRow } from '../shared/NoteEntryRow';
import { Plus } from 'lucide-react';
import type { MeetingNote, NoteEntry, NoteTag } from '../../types';
import { format } from 'date-fns';

function genId() {
  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

interface Props {
  podId: string;
  podName: string;
  onSave: (note: Omit<MeetingNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  existing?: MeetingNote;
}

export function NoteEditor({ podId, podName, onSave, onCancel, existing }: Props) {
  const today = format(new Date(), 'yyyy-MM-dd');

  const [title, setTitle] = useState(existing?.title ?? '');
  const [meetingDate, setMeetingDate] = useState(existing?.meetingDate?.slice(0, 10) ?? today);
  const [attendees, setAttendeesRaw] = useState(existing?.attendees.join(', ') ?? '');
  const [rawNotes, setRawNotes] = useState(existing?.rawNotes ?? '');
  const [entries, setEntries] = useState<NoteEntry[]>(existing?.entries ?? []);

  // New entry state
  const [newText, setNewText] = useState('');
  const [newTag, setNewTag] = useState<NoteTag>('note');

  function addEntry() {
    if (!newText.trim()) return;
    setEntries(prev => [...prev, {
      id: genId(),
      tag: newTag,
      text: newText.trim(),
      createdAt: new Date().toISOString(),
      includeInUpdate: true,
    }]);
    setNewText('');
  }

  function deleteEntry(id: string) {
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  function toggleEntry(id: string) {
    setEntries(prev => prev.map(e =>
      e.id === id ? { ...e, includeInUpdate: !e.includeInUpdate } : e
    ));
  }

  function handleSave() {
    if (!title.trim()) return;
    onSave({
      podId,
      title: title.trim(),
      meetingDate: new Date(meetingDate).toISOString(),
      attendees: attendees.split(',').map(s => s.trim()).filter(Boolean),
      entries,
      rawNotes,
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">
          {existing ? 'Edit Note' : 'New Meeting Note'} — {podName}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">Capture tagged items and they'll roll up into the Friday update.</p>
      </div>

      {/* Title */}
      <div>
        <label className="text-xs text-gray-500 font-medium uppercase tracking-wide block mb-1.5">
          Meeting Title
        </label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Sprint 14 Kickoff"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Date + Attendees */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 font-medium uppercase tracking-wide block mb-1.5">Date</label>
          <input
            type="date"
            value={meetingDate}
            onChange={e => setMeetingDate(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium uppercase tracking-wide block mb-1.5">
            Attendees <span className="text-gray-600 normal-case font-normal">(comma separated)</span>
          </label>
          <input
            value={attendees}
            onChange={e => setAttendeesRaw(e.target.value)}
            placeholder="Sarah Chen, Marcus Webb"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Tagged entries */}
      <div>
        <label className="text-xs text-gray-500 font-medium uppercase tracking-wide block mb-2">
          Tagged Items
          <span className="ml-1 text-gray-600 normal-case font-normal">— will appear in the weekly update</span>
        </label>

        {/* Entry list */}
        {entries.length > 0 && (
          <div className="space-y-1.5 mb-3">
            {entries.map(entry => (
              <NoteEntryRow
                key={entry.id}
                entry={entry}
                onToggleInclude={toggleEntry}
                onDelete={deleteEntry}
              />
            ))}
          </div>
        )}

        {/* Add entry */}
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 space-y-2">
          <TagPicker value={newTag} onChange={setNewTag} />
          <div className="flex gap-2">
            <input
              value={newText}
              onChange={e => setNewText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addEntry(); } }}
              placeholder="Type a note and press Enter..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={addEntry}
              disabled={!newText.trim()}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Free-form notes */}
      <div>
        <label className="text-xs text-gray-500 font-medium uppercase tracking-wide block mb-1.5">
          Raw Notes <span className="text-gray-600 normal-case font-normal">(optional, won't appear in update)</span>
        </label>
        <textarea
          value={rawNotes}
          onChange={e => setRawNotes(e.target.value)}
          placeholder="Free-form meeting notes, context, decisions..."
          rows={4}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!title.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors"
        >
          Save Note
        </button>
      </div>
    </div>
  );
}
