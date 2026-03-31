// ─── Enums ───────────────────────────────────────────────────────────────────

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type NoteTag = 'risk' | 'highlight' | 'callout' | 'blocker' | 'note';

export const TAG_META: Record<NoteTag, { emoji: string; label: string; color: string }> = {
  risk:      { emoji: '🚨', label: 'Risk',      color: 'bg-red-900/50 text-red-300 border-red-700' },
  highlight: { emoji: '⭐', label: 'Highlight', color: 'bg-yellow-900/50 text-yellow-300 border-yellow-700' },
  callout:   { emoji: '📢', label: 'Callout',   color: 'bg-blue-900/50 text-blue-300 border-blue-700' },
  blocker:   { emoji: '🚫', label: 'Blocker',   color: 'bg-orange-900/50 text-orange-300 border-orange-700' },
  note:      { emoji: '📝', label: 'Note',      color: 'bg-gray-800 text-gray-300 border-gray-600' },
};

export const RISK_META: Record<RiskLevel, { label: string; color: string; bg: string; dot: string }> = {
  low:      { label: 'LOW',      color: 'text-green-400',  bg: 'bg-green-900/40 border-green-700',  dot: 'bg-green-400' },
  medium:   { label: 'MEDIUM',   color: 'text-yellow-400', bg: 'bg-yellow-900/40 border-yellow-700', dot: 'bg-yellow-400' },
  high:     { label: 'HIGH',     color: 'text-orange-400', bg: 'bg-orange-900/40 border-orange-700', dot: 'bg-orange-400' },
  critical: { label: 'CRITICAL', color: 'text-red-400',    bg: 'bg-red-900/40 border-red-700',       dot: 'bg-red-400' },
};

// ─── Core Domain: Pod ────────────────────────────────────────────────────────

export interface PodMetrics {
  velocity: number;
  velocityTarget: number;
  openPRs: number;
  mergedPRsThisWeek: number;
  openIssues: number;
  blockerCount: number;
  lastDeployedAt: string;
  testCoverage: number;
}

export interface StatusSnapshot {
  weekOf: string;
  riskLevel: RiskLevel;
  velocityActual: number;
  velocityTarget: number;
  summary: string;
}

export interface Pod {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  tpmName: string;
  tpmEmail: string;
  engineeringLead: string;
  engineeringLeadEmail: string;
  githubRepo: string;
  githubOwner: string;
  githubRepoName: string;
  currentSprint: string;
  currentMilestone: string;
  riskLevel: RiskLevel;
  metrics: PodMetrics;
  statusHistory: StatusSnapshot[];
  color: string;
  emoji: string;
}

// ─── Meeting Notes ────────────────────────────────────────────────────────────

export interface NoteEntry {
  id: string;
  tag: NoteTag;
  text: string;
  createdAt: string;
  includeInUpdate: boolean;
}

export interface MeetingNote {
  id: string;
  podId: string;
  title: string;
  meetingDate: string;
  createdAt: string;
  updatedAt: string;
  attendees: string[];
  entries: NoteEntry[];
  rawNotes: string;
}

export interface JournalEntry {
  id: string;
  podId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  entries: NoteEntry[];
  rawContent: string;
}

// ─── Weekly Update ────────────────────────────────────────────────────────────

export interface PodUpdateSummary {
  podId: string;
  podName: string;
  riskLevel: RiskLevel;
  highlights: string[];
  blockers: string[];
  callouts: string[];
  risks: string[];
  generalNotes: string[];
  githubSnapshot: GitHubSnapshot | null;
}

export interface WeeklyUpdate {
  id: string;
  weekOf: string;
  generatedAt: string;
  sentAt: string | null;
  recipientList: string[];
  subject: string;
  body: string;
  podSummaries: PodUpdateSummary[];
  editedBeforeSend: boolean;
}

// ─── GitHub Integration ───────────────────────────────────────────────────────

export interface GitHubPR {
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  author: string;
  createdAt: string;
  updatedAt: string;
  url: string;
  labels: string[];
}

export interface GitHubIssue {
  number: number;
  title: string;
  state: 'open' | 'closed';
  author: string;
  createdAt: string;
  url: string;
  labels: string[];
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  committedAt: string;
  url: string;
}

export interface GitHubSnapshot {
  fetchedAt: string;
  openPRCount: number;
  recentPRs: GitHubPR[];
  openIssueCount: number;
  recentIssues: GitHubIssue[];
  lastCommit: GitHubCommit | null;
  recentCommits: GitHubCommit[];
}

// ─── App Settings ─────────────────────────────────────────────────────────────

export interface AppSettings {
  pmName: string;
  githubPAT: string;
  updateRecipients: string[];
  updateSendChannel: 'copy' | 'slack';
  slackWebhookUrl: string;
  scheduledTaskId: string | null;
  leadershipNames: string;
}

// ─── App State ────────────────────────────────────────────────────────────────

export interface AppState {
  pods: Pod[];
  meetingNotes: MeetingNote[];
  journalEntries: JournalEntry[];
  weeklyUpdates: WeeklyUpdate[];
  settings: AppSettings;
  githubCache: Record<string, GitHubSnapshot>;
}
