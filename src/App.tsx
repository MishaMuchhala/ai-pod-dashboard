import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { PodDetailPage } from './pages/PodDetailPage';
import { UpdatePage } from './pages/UpdatePage';
import { SettingsPage } from './pages/SettingsPage';
import { usePods } from './hooks/usePods';
import { useNotes } from './hooks/useNotes';
import { useSettings } from './hooks/useSettings';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { GitHubSnapshot, MeetingNote, JournalEntry } from './types';

export default function App() {
  const { pods } = usePods();
  const {
    notes, journals,
    addNote, updateNote,
    addJournal,
  } = useNotes();
  const { settings, updateSettings } = useSettings();
  const [githubCache] = useLocalStorage<Record<string, GitHubSnapshot>>('mp:gh-cache', {});

  async function handleScheduleFriday() {
    // This would call the scheduled-tasks MCP in a real Claude session.
    // For now, we store a placeholder task ID.
    const taskId = `friday-update-${Date.now()}`;
    updateSettings({ scheduledTaskId: taskId });
    alert(
      'Friday 1PM updates activated!\n\nIn a Claude Code session, this would register a scheduled task ' +
      '(cron: 0 13 * * 5) to auto-generate and prepare your weekly update every Friday at 1PM.'
    );
  }

  return (
    <BrowserRouter>
      <AppShell pods={pods} notes={notes}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={<DashboardPage pods={pods} notes={notes} />}
          />
          <Route
            path="/pods/:podId"
            element={
              <PodDetailPage
                pods={pods}
                notes={notes}
                journals={journals}
                settings={settings}
                onAddNote={(note: Omit<MeetingNote, 'id' | 'createdAt' | 'updatedAt'>) => addNote(note)}
                onUpdateNote={(id: string, patch: Partial<MeetingNote>) => updateNote(id, patch)}
                onAddJournal={(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => addJournal(entry)}
              />
            }
          />
          <Route
            path="/update/new"
            element={
              <UpdatePage
                pods={pods}
                notes={notes}
                journals={journals}
                settings={settings}
                githubCache={githubCache}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsPage
                settings={settings}
                onUpdate={updateSettings}
                onScheduleFriday={handleScheduleFriday}
              />
            }
          />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
