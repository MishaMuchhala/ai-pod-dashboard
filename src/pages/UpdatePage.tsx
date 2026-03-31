import { useEffect, useState } from 'react';
import { UpdateComposer } from '../components/update/UpdateComposer';
import { Loader2, RefreshCw } from 'lucide-react';
import type { Pod, MeetingNote, JournalEntry, AppSettings, GitHubSnapshot, WeeklyUpdate } from '../types';
import { useUpdates } from '../hooks/useUpdates';

interface Props {
  pods: Pod[];
  notes: MeetingNote[];
  journals: JournalEntry[];
  settings: AppSettings;
  githubCache: Record<string, GitHubSnapshot>;
}

export function UpdatePage({ pods, notes, journals, settings, githubCache }: Props) {
  const { updates, currentDraft, generateUpdate, saveUpdate, markSent } = useUpdates(
    pods, notes, journals, settings, githubCache
  );
  const [update, setUpdate] = useState<WeeklyUpdate | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (currentDraft) {
      setUpdate(currentDraft);
    } else {
      handleGenerate();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      const newUpdate = generateUpdate();
      setUpdate(newUpdate);
      setGenerating(false);
    }, 600);
  }

  function handleBodyChange(body: string) {
    if (!update) return;
    const updated = { ...update, body, editedBeforeSend: true };
    setUpdate(updated);
    saveUpdate(updated);
  }

  function handleMarkSent() {
    if (!update) return;
    markSent(update.id);
    setUpdate(prev => prev ? { ...prev, sentAt: new Date().toISOString() } : prev);
  }

  if (generating || !update) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 size={24} className="text-indigo-400 animate-spin" />
        <p className="text-sm text-gray-500">Generating weekly update...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-3 border-b border-gray-800 flex items-center justify-between">
        <h1 className="font-semibold text-white">Weekly Update Composer</h1>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200"
        >
          <RefreshCw size={13} />
          Regenerate
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        <UpdateComposer
          update={update}
          onBodyChange={handleBodyChange}
          onMarkSent={handleMarkSent}
        />
      </div>

      {/* Past updates */}
      {updates.filter(u => u.sentAt !== null).length > 0 && (
        <div className="border-t border-gray-800 px-6 py-3">
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Past Updates</p>
          <div className="flex gap-2 flex-wrap">
            {updates.filter(u => u.sentAt !== null).map(u => (
              <button
                key={u.id}
                onClick={() => setUpdate(u)}
                className="text-xs bg-gray-900 border border-gray-800 text-gray-400 hover:border-gray-600 px-3 py-1 rounded-full"
              >
                {u.subject}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
