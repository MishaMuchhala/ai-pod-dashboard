import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PodHeader } from '../components/podDetail/PodHeader';
import { MetricsGrid } from '../components/podDetail/MetricsGrid';
import { StatusHistoryChart } from '../components/podDetail/StatusHistoryChart';
import { NoteTimeline } from '../components/podDetail/NoteTimeline';
import { GitHubPanel } from '../components/github/GitHubPanel';
import { NoteEditor } from '../components/notes/NoteEditor';
import { useGitHub } from '../hooks/useGitHub';
import { Plus, X, BookOpen } from 'lucide-react';
import type { Pod, MeetingNote, JournalEntry, AppSettings } from '../types';

interface Props {
  pods: Pod[];
  notes: MeetingNote[];
  journals: JournalEntry[];
  settings: AppSettings;
  onAddNote: (note: Omit<MeetingNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateNote: (id: string, patch: Partial<MeetingNote>) => void;
  onAddJournal: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

function JournalModal({ podId, podName, onSave, onClose }: {
  podId: string; podName: string;
  onSave: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');

  function handleSave() {
    if (!text.trim()) return;
    onSave({
      podId,
      authorName: author || 'You',
      entries: [],
      rawContent: text.trim(),
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Journal Entry — {podName}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300"><X size={16} /></button>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Your name</label>
          <input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="e.g. Sarah Chen"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Notes</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Async update, context, or FYI..."
            rows={5}
            autoFocus
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200">Cancel</button>
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-sm rounded-lg font-medium transition-colors"
          >
            Save Journal
          </button>
        </div>
      </div>
    </div>
  );
}

export function PodDetailPage({ pods, notes, journals, settings, onAddNote, onUpdateNote, onAddJournal }: Props) {
  const { podId } = useParams<{ podId: string }>();
  const navigate = useNavigate();
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [editingNote, setEditingNote] = useState<MeetingNote | undefined>();

  const pod = pods.find(p => p.id === podId);
  const podNotes = notes.filter(n => n.podId === podId).sort(
    (a, b) => new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime()
  );
  const podJournals = journals.filter(j => j.podId === podId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const { snapshot, isLoading, error, refresh } = useGitHub(pod!, settings.githubPAT);

  if (!pod) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Pod not found.
      </div>
    );
  }

  if (showNoteEditor) {
    return (
      <div className="min-h-full bg-gray-950">
        <div className="border-b border-gray-800 px-6 py-3 flex items-center gap-3">
          <button
            onClick={() => { setShowNoteEditor(false); setEditingNote(undefined); }}
            className="text-sm text-gray-400 hover:text-gray-200"
          >
            ← Back to {pod.name}
          </button>
        </div>
        <NoteEditor
          podId={pod.id}
          podName={pod.name}
          existing={editingNote}
          onSave={note => {
            if (editingNote) {
              onUpdateNote(editingNote.id, note);
            } else {
              onAddNote(note);
            }
            setShowNoteEditor(false);
            setEditingNote(undefined);
          }}
          onCancel={() => { setShowNoteEditor(false); setEditingNote(undefined); }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <PodHeader pod={pod} />

      <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column: metrics + chart + timeline */}
        <div className="xl:col-span-2 space-y-6">
          <MetricsGrid metrics={pod.metrics} />

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <StatusHistoryChart history={pod.statusHistory} />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowNoteEditor(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-3 py-2 rounded-lg transition-colors font-medium"
            >
              <Plus size={14} />
              Add Meeting Note
            </button>
            <button
              onClick={() => setShowJournalModal(true)}
              className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm px-3 py-2 rounded-lg transition-colors"
            >
              <BookOpen size={14} />
              Journal Entry
            </button>
          </div>

          <NoteTimeline
            podId={pod.id}
            notes={podNotes}
            journals={podJournals}
          />
        </div>

        {/* Right column: GitHub */}
        <div>
          <GitHubPanel
            pod={pod}
            snapshot={snapshot}
            isLoading={isLoading}
            error={error}
            hasPAT={!!settings.githubPAT}
            onRefresh={refresh}
          />
        </div>
      </div>

      {showJournalModal && (
        <JournalModal
          podId={pod.id}
          podName={pod.name}
          onSave={entry => {
            onAddJournal(entry);
            setShowJournalModal(false);
          }}
          onClose={() => setShowJournalModal(false)}
        />
      )}
    </div>
  );
}
