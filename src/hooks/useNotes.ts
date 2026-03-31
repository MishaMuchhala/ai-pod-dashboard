import { useLocalStorage } from './useLocalStorage';
import { MOCK_NOTES, MOCK_JOURNALS } from '../data/mockData';
import type { MeetingNote, JournalEntry, NoteEntry } from '../types';

function generateId() {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<MeetingNote[]>('mp:notes', MOCK_NOTES);
  const [journals, setJournals] = useLocalStorage<JournalEntry[]>('mp:journals', MOCK_JOURNALS);

  function addNote(note: Omit<MeetingNote, 'id' | 'createdAt' | 'updatedAt'>): MeetingNote {
    const now = new Date().toISOString();
    const full: MeetingNote = { ...note, id: generateId(), createdAt: now, updatedAt: now };
    setNotes(prev => [full, ...prev]);
    return full;
  }

  function updateNote(id: string, patch: Partial<MeetingNote>) {
    setNotes(prev => prev.map(n =>
      n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n
    ));
  }

  function deleteNote(id: string) {
    setNotes(prev => prev.filter(n => n.id !== id));
  }

  function addJournal(entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>): JournalEntry {
    const now = new Date().toISOString();
    const full: JournalEntry = { ...entry, id: generateId(), createdAt: now, updatedAt: now };
    setJournals(prev => [full, ...prev]);
    return full;
  }

  function deleteJournal(id: string) {
    setJournals(prev => prev.filter(j => j.id !== id));
  }

  function getNotesForPod(podId: string): MeetingNote[] {
    return notes
      .filter(n => n.podId === podId)
      .sort((a, b) => new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime());
  }

  function getJournalsForPod(podId: string): JournalEntry[] {
    return journals
      .filter(j => j.podId === podId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  function getNotesThisWeek(): MeetingNote[] {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return notes.filter(n => new Date(n.createdAt) >= weekAgo);
  }

  function getJournalsThisWeek(): JournalEntry[] {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return journals.filter(j => new Date(j.createdAt) >= weekAgo);
  }

  function toggleEntryInclude(noteId: string, entryId: string) {
    setNotes(prev => prev.map(n => {
      if (n.id !== noteId) return n;
      return {
        ...n,
        entries: n.entries.map((e: NoteEntry) =>
          e.id === entryId ? { ...e, includeInUpdate: !e.includeInUpdate } : e
        ),
        updatedAt: new Date().toISOString(),
      };
    }));
  }

  return {
    notes, journals,
    addNote, updateNote, deleteNote,
    addJournal, deleteJournal,
    getNotesForPod, getJournalsForPod,
    getNotesThisWeek, getJournalsThisWeek,
    toggleEntryInclude,
  };
}
