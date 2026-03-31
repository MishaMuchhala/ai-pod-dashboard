# AI Pod Dashboard

A meeting management and stakeholder update tool for PMs overseeing multiple AI agent pods. Track sprint health, capture meeting notes, and generate weekly leadership updates — all in one place.

![Dashboard](https://img.shields.io/badge/status-active-brightgreen) ![React](https://img.shields.io/badge/React-18-61dafb?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)

---

## What it does

You're overseeing 10 pods. Each pod has a TPM, an engineering team, and a GitHub repo. Every week you need to:
- Know which pods are at risk before leadership asks
- Capture notes from every sync without losing context
- Send a clear, formatted update to leadership every Friday

This app handles all of that.

---

## Features

### Dashboard
- **10-pod grid** with real-time risk badges (Critical / High / Medium / Low)
- **Velocity sparklines** per pod showing 4-week trend vs target
- **Portfolio risk chart** — stacked bar showing risk distribution across all pods over time
- **Filter by risk level** to instantly surface what needs attention

### Pod Detail
- **Metrics grid** — velocity, open PRs, open issues, blockers, test coverage, last deploy
- **4-week velocity chart** with actual vs target
- **Note & journal timeline** — reverse-chronological view of all meeting notes and async updates
- **GitHub panel** — live PRs, issues, and commits (requires PAT) with 15-min cache

### Meeting Note Capture
- **5 tag types**: ⭐ Highlight · 🚨 Risk · 🚫 Blocker · 📢 Callout · 📝 Note
- All tagged items automatically roll up into the weekly update
- Attendees, date, and free-form raw notes
- Per-item include/exclude toggles before sending

### Weekly Update Composer
- **Auto-generates** a formatted leadership message from this week's tagged notes
- Sorted by risk level — critical pods appear first
- **Review by Pod** tab to check every item before sending
- **Message Preview** tab with editable markdown output
- Copy to clipboard or mark as sent

### GitHub Integration
- Live data via GitHub REST API using a personal access token
- Shows open PRs, issues with labels, and recent commits per pod
- Falls back to mock data when no PAT is configured
- Per-pod 15-minute cache with manual refresh

### Settings
- GitHub PAT configuration
- Update recipients list
- Slack webhook support for direct send
- Friday 1PM scheduled automation

---

## Mock Data

The app ships with realistic mock data for 10 AI agent pods:

| Pod | Building | Risk |
|-----|----------|------|
| 🎙️ Helix | Voice AI agent (real-time TTS) | 🔴 Critical |
| ⚡ Atlas | Data pipeline agent | 🟠 High |
| 🛡️ Zenith | Security & compliance agent | 🟠 High |
| 🌐 Nexus | Multi-modal AI assistant | 🟡 Medium |
| 📄 Flux | Document processing agent | 🟡 Medium |
| 📊 Prism | Analytics copilot | 🟡 Medium |
| ✨ Orion | Code generation agent | 🟢 Low |
| 💬 Vertex | Customer support agent | 🟢 Low |
| 🔍 Apex | Search & retrieval agent | 🟢 Low |
| ⚙️ Echo | Workflow automation agent | 🟢 Low |

Each pod has a TPM, engineering lead, GitHub repo, current sprint, 4-week status history, and pre-populated meeting notes with tagged entries.

---

## Getting Started

### Prerequisites
- Node.js 18+

### Install & run

```bash
git clone https://github.com/MishaMuchhala/ai-pod-dashboard.git
cd ai-pod-dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### GitHub Integration (optional)

1. Go to **Settings** in the app
2. Paste a GitHub Personal Access Token with `repo` scope
3. Pod detail pages will show live PRs, issues, and commits

---

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Charts | Recharts |
| Icons | Lucide React |
| Dates | date-fns |
| Persistence | localStorage |

No backend required. All data lives in the browser.

---

## Project Structure

```
src/
├── components/
│   ├── dashboard/      # PodCard, RiskSummaryBar, WeeklyTrendChart, VelocitySparkline
│   ├── podDetail/      # PodHeader, MetricsGrid, NoteTimeline, StatusHistoryChart
│   ├── github/         # GitHubPanel with PRs, issues, commits
│   ├── notes/          # NoteEditor with TagPicker
│   ├── update/         # UpdateComposer with Review + Preview tabs
│   └── layout/         # AppShell, Sidebar
├── data/
│   └── mockData.ts     # 10 pods, meeting notes, GitHub snapshots
├── hooks/
│   ├── useLocalStorage.ts
│   ├── usePods.ts
│   ├── useNotes.ts
│   ├── useGitHub.ts    # Fetch + cache GitHub data
│   └── useUpdates.ts   # Generate weekly update from tagged notes
├── pages/
│   ├── DashboardPage.tsx
│   ├── PodDetailPage.tsx
│   ├── UpdatePage.tsx
│   └── SettingsPage.tsx
└── types/
    └── index.ts        # All TypeScript interfaces
```

---

## Weekly Update Format

The generated message looks like this:

```
# AI Platform Weekly Update — Week of March 30, 2026

**Prepared by:** Alex Morgan
**Recipients:** CEO, CTO, VP Engineering, VP Product

## Risk Overview
| Pod | Risk | Blockers | Key Issue |
|-----|------|----------|-----------|
| 🔴 Helix | CRITICAL | 5 | P99 voice latency at 4.2s — SLA breach |
| 🟠 Atlas  | HIGH     | 3 | Kafka connector blocked by compliance  |
...

## Pod Updates

### 🎙️ Helix — Voice AI agent
**Risk:** 🔴 CRITICAL

**⭐ Highlights**
- Root cause found: TTS GPU queue saturation at 85% — adding sharding

**🚫 Blockers**
- P99 voice latency at 4.2s — SLA target is 1.5s — exec team aware
...
```

---

## License

MIT
