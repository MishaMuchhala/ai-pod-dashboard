import type {
  Pod, MeetingNote, JournalEntry, GitHubSnapshot,
  NoteEntry, StatusSnapshot, AppSettings,
} from '../types';

// ─── Date helpers (always fresh relative to today) ────────────────────────────
const now = new Date();
function daysAgo(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}
function hoursAgo(n: number): string {
  const d = new Date(now);
  d.setHours(d.getHours() - n);
  return d.toISOString();
}
function mondayOf(weeksAgo: number): string {
  const d = new Date(now);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff - weeksAgo * 7);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

let _id = 1;
function uid() { return `id-${_id++}`; }

function entry(tag: NoteEntry['tag'], text: string, daysAgoN = 1): NoteEntry {
  return { id: uid(), tag, text, createdAt: daysAgo(daysAgoN), includeInUpdate: true };
}

// ─── Status history helper ────────────────────────────────────────────────────
function history(
  levels: [StatusSnapshot['riskLevel'], StatusSnapshot['riskLevel'], StatusSnapshot['riskLevel'], StatusSnapshot['riskLevel']],
  target: number,
  actuals: [number, number, number, number],
  summaries: [string, string, string, string],
): StatusSnapshot[] {
  return [3, 2, 1, 0].map((w, i) => ({
    weekOf: mondayOf(3 - i),
    riskLevel: levels[i],
    velocityActual: actuals[i],
    velocityTarget: target,
    summary: summaries[i],
  }));
}

// ─── MOCK PODS ────────────────────────────────────────────────────────────────

export const MOCK_PODS: Pod[] = [
  {
    id: 'nexus',
    name: 'Nexus',
    description: 'Multi-modal AI assistant combining vision, audio, and text understanding into a unified reasoning engine.',
    techStack: ['Python', 'PyTorch', 'FastAPI', 'React', 'Redis'],
    tpmName: 'Sarah Chen',
    tpmEmail: 'sarah.chen@company.ai',
    engineeringLead: 'Marcus Webb',
    engineeringLeadEmail: 'marcus.webb@company.ai',
    githubRepo: 'https://github.com/company-ai/nexus-agent',
    githubOwner: 'company-ai',
    githubRepoName: 'nexus-agent',
    currentSprint: 'Sprint 14 – Vision + Audio Fusion',
    currentMilestone: 'M3: Multi-modal Integration',
    riskLevel: 'medium',
    color: 'blue',
    emoji: '🌐',
    metrics: { velocity: 34, velocityTarget: 40, openPRs: 7, mergedPRsThisWeek: 5, openIssues: 12, blockerCount: 1, lastDeployedAt: hoursAgo(6), testCoverage: 72 },
    statusHistory: history(
      ['low', 'low', 'medium', 'medium'],
      40,
      [38, 41, 36, 34],
      ['Strong sprint, shipped audio encoder v1', 'Vision pipeline integrated, minor latency spike', 'Modality router PR under infra review', 'Latency above target, team pivoting on architecture'],
    ),
  },
  {
    id: 'orion',
    name: 'Orion',
    description: 'AI-powered code generation agent with AST-aware context, multi-repo awareness, and real-time PR review.',
    techStack: ['Python', 'TypeScript', 'Tree-sitter', 'gRPC', 'PostgreSQL'],
    tpmName: 'James Park',
    tpmEmail: 'james.park@company.ai',
    engineeringLead: 'Priya Nair',
    engineeringLeadEmail: 'priya.nair@company.ai',
    githubRepo: 'https://github.com/company-ai/orion-codegen',
    githubOwner: 'company-ai',
    githubRepoName: 'orion-codegen',
    currentSprint: 'Sprint 11 – Context Window Optimization',
    currentMilestone: 'M4: Enterprise Beta',
    riskLevel: 'low',
    color: 'purple',
    emoji: '✨',
    metrics: { velocity: 45, velocityTarget: 42, openPRs: 4, mergedPRsThisWeek: 9, openIssues: 6, blockerCount: 0, lastDeployedAt: hoursAgo(2), testCoverage: 88 },
    statusHistory: history(
      ['medium', 'low', 'low', 'low'],
      42,
      [38, 43, 44, 45],
      ['Context retrieval P99 too high, debugging', 'Fixed semantic chunking, latency dropped 40%', 'AST-aware diff shipped, velocity above target', 'On track, enterprise demo prep in progress'],
    ),
  },
  {
    id: 'atlas',
    name: 'Atlas',
    description: 'Intelligent data pipeline agent for streaming ETL, anomaly detection, and automated data quality enforcement.',
    techStack: ['Python', 'Apache Kafka', 'Spark', 'dbt', 'Snowflake'],
    tpmName: 'Elena Rodriguez',
    tpmEmail: 'elena.rodriguez@company.ai',
    engineeringLead: 'David Kim',
    engineeringLeadEmail: 'david.kim@company.ai',
    githubRepo: 'https://github.com/company-ai/atlas-pipeline',
    githubOwner: 'company-ai',
    githubRepoName: 'atlas-pipeline',
    currentSprint: 'Sprint 9 – Streaming ETL',
    currentMilestone: 'M2: Production Readiness',
    riskLevel: 'high',
    color: 'red',
    emoji: '⚡',
    metrics: { velocity: 22, velocityTarget: 40, openPRs: 11, mergedPRsThisWeek: 2, openIssues: 21, blockerCount: 3, lastDeployedAt: daysAgo(4), testCoverage: 61 },
    statusHistory: history(
      ['low', 'medium', 'high', 'high'],
      40,
      [39, 31, 25, 22],
      ['Pipeline stable, Kafka connector in progress', 'Connector blocked on infra permissions', 'Data quality regression found in staging', 'Milestone slip likely by 2 weeks, escalating'],
    ),
  },
  {
    id: 'vertex',
    name: 'Vertex',
    description: 'Customer support AI agent with sentiment analysis, auto-escalation, and CRM integration for enterprise clients.',
    techStack: ['Python', 'Node.js', 'Salesforce API', 'Zendesk API', 'Redis'],
    tpmName: 'Michael Torres',
    tpmEmail: 'michael.torres@company.ai',
    engineeringLead: 'Lisa Zhang',
    engineeringLeadEmail: 'lisa.zhang@company.ai',
    githubRepo: 'https://github.com/company-ai/vertex-support',
    githubOwner: 'company-ai',
    githubRepoName: 'vertex-support',
    currentSprint: 'Sprint 16 – Sentiment + Escalation',
    currentMilestone: 'M5: Enterprise Pilot',
    riskLevel: 'low',
    color: 'green',
    emoji: '💬',
    metrics: { velocity: 38, velocityTarget: 38, openPRs: 5, mergedPRsThisWeek: 7, openIssues: 8, blockerCount: 0, lastDeployedAt: hoursAgo(1), testCoverage: 81 },
    statusHistory: history(
      ['low', 'low', 'low', 'low'],
      38,
      [37, 39, 40, 38],
      ['CSAT scores up 8 pts, escalation engine tuned', 'Salesforce integration shipped', 'Three enterprise clients signed for pilot', 'Pilot onboarding underway, all metrics green'],
    ),
  },
  {
    id: 'flux',
    name: 'Flux',
    description: 'Document processing agent specializing in PDF extraction, layout understanding, and intelligent form parsing.',
    techStack: ['Python', 'PyMuPDF', 'LayoutLM', 'FastAPI', 'S3'],
    tpmName: 'Amanda Johnson',
    tpmEmail: 'amanda.johnson@company.ai',
    engineeringLead: 'Kevin O\'Brien',
    engineeringLeadEmail: 'kevin.obrien@company.ai',
    githubRepo: 'https://github.com/company-ai/flux-docs',
    githubOwner: 'company-ai',
    githubRepoName: 'flux-docs',
    currentSprint: 'Sprint 7 – Layout Understanding',
    currentMilestone: 'M2: OCR Accuracy',
    riskLevel: 'medium',
    color: 'orange',
    emoji: '📄',
    metrics: { velocity: 28, velocityTarget: 36, openPRs: 8, mergedPRsThisWeek: 3, openIssues: 14, blockerCount: 2, lastDeployedAt: daysAgo(2), testCoverage: 67 },
    statusHistory: history(
      ['low', 'low', 'medium', 'medium'],
      36,
      [34, 35, 30, 28],
      ['PDF table extraction shipped, accuracy 94%', 'Handwriting model accuracy plateau at 76%', 'Model retraining underway, 2 blockers on data labeling', 'Below velocity target, handwriting gap persists'],
    ),
  },
  {
    id: 'apex',
    name: 'Apex',
    description: 'Hybrid vector search and retrieval agent with semantic re-ranking, HNSW indexing, and sub-50ms query latency.',
    techStack: ['Python', 'Rust', 'Qdrant', 'FastAPI', 'Kafka'],
    tpmName: 'Chris Washington',
    tpmEmail: 'chris.washington@company.ai',
    engineeringLead: 'Yuki Tanaka',
    engineeringLeadEmail: 'yuki.tanaka@company.ai',
    githubRepo: 'https://github.com/company-ai/apex-search',
    githubOwner: 'company-ai',
    githubRepoName: 'apex-search',
    currentSprint: 'Sprint 12 – Hybrid Vector Search',
    currentMilestone: 'M4: Latency SLA',
    riskLevel: 'low',
    color: 'cyan',
    emoji: '🔍',
    metrics: { velocity: 41, velocityTarget: 40, openPRs: 3, mergedPRsThisWeek: 8, openIssues: 5, blockerCount: 0, lastDeployedAt: hoursAgo(3), testCoverage: 85 },
    statusHistory: history(
      ['medium', 'low', 'low', 'low'],
      40,
      [36, 40, 43, 41],
      ['Index rebuild blocking search latency', 'HNSW index shipped, 3x speed improvement', 'Re-ranking A/B positive, precision +12%', 'All SLAs met, hitting stretch targets'],
    ),
  },
  {
    id: 'helix',
    name: 'Helix',
    description: 'Real-time voice AI agent for live transcription, speaker diarization, and streaming text-to-speech synthesis.',
    techStack: ['Python', 'WebRTC', 'Whisper', 'FastAPI', 'Redis Streams'],
    tpmName: 'Rachel Green',
    tpmEmail: 'rachel.green@company.ai',
    engineeringLead: 'Omar Hassan',
    engineeringLeadEmail: 'omar.hassan@company.ai',
    githubRepo: 'https://github.com/company-ai/helix-voice',
    githubOwner: 'company-ai',
    githubRepoName: 'helix-voice',
    currentSprint: 'Sprint 5 – Streaming TTS',
    currentMilestone: 'M1: Latency SLA',
    riskLevel: 'critical',
    color: 'red',
    emoji: '🎙️',
    metrics: { velocity: 15, velocityTarget: 40, openPRs: 14, mergedPRsThisWeek: 1, openIssues: 28, blockerCount: 5, lastDeployedAt: daysAgo(7), testCoverage: 45 },
    statusHistory: history(
      ['medium', 'high', 'critical', 'critical'],
      40,
      [32, 24, 18, 15],
      ['WebRTC integration unstable, debugging', 'Latency P99 at 2.8s vs 1.5s target', 'Exec escalation, team requesting infra help', 'Latency P99 at 4.2s, milestone at serious risk'],
    ),
  },
  {
    id: 'prism',
    name: 'Prism',
    description: 'Analytics copilot agent that translates natural language to SQL, generates charts, and surfaces data insights.',
    techStack: ['Python', 'TypeScript', 'BigQuery', 'dbt', 'Plotly'],
    tpmName: 'Daniel Lee',
    tpmEmail: 'daniel.lee@company.ai',
    engineeringLead: 'Sophie Martin',
    engineeringLeadEmail: 'sophie.martin@company.ai',
    githubRepo: 'https://github.com/company-ai/prism-analytics',
    githubOwner: 'company-ai',
    githubRepoName: 'prism-analytics',
    currentSprint: 'Sprint 10 – Dashboard Copilot',
    currentMilestone: 'M3: NL-to-SQL Accuracy',
    riskLevel: 'medium',
    color: 'violet',
    emoji: '📊',
    metrics: { velocity: 30, velocityTarget: 36, openPRs: 6, mergedPRsThisWeek: 4, openIssues: 11, blockerCount: 1, lastDeployedAt: daysAgo(1), testCoverage: 74 },
    statusHistory: history(
      ['low', 'low', 'medium', 'medium'],
      36,
      [35, 34, 32, 30],
      ['NL-to-SQL accuracy at 89%, scope creep starting', 'Stakeholder requests adding 3 new chart types', 'Velocity slipping due to scope expansion', 'Accessibility pass needed on charting component'],
    ),
  },
  {
    id: 'echo',
    name: 'Echo',
    description: 'Workflow automation agent with a no-code trigger DSL, native integrations, and AI-powered task orchestration.',
    techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'BullMQ', 'Docker'],
    tpmName: 'Nina Patel',
    tpmEmail: 'nina.patel@company.ai',
    engineeringLead: 'Carlos Mendez',
    engineeringLeadEmail: 'carlos.mendez@company.ai',
    githubRepo: 'https://github.com/company-ai/echo-workflows',
    githubOwner: 'company-ai',
    githubRepoName: 'echo-workflows',
    currentSprint: 'Sprint 13 – Trigger Engine',
    currentMilestone: 'M4: Integration Hub',
    riskLevel: 'low',
    color: 'emerald',
    emoji: '⚙️',
    metrics: { velocity: 39, velocityTarget: 38, openPRs: 4, mergedPRsThisWeek: 6, openIssues: 7, blockerCount: 0, lastDeployedAt: hoursAgo(4), testCoverage: 83 },
    statusHistory: history(
      ['low', 'low', 'low', 'low'],
      38,
      [37, 38, 40, 39],
      ['Trigger DSL shipped, 8 integrations live', '12 native integrations live, positive feedback', 'Zapier import tool in beta with 3 customers', 'All targets met, planning M5 scope'],
    ),
  },
  {
    id: 'zenith',
    name: 'Zenith',
    description: 'Security and compliance AI agent for PII detection, GDPR redaction, audit log analysis, and policy enforcement.',
    techStack: ['Python', 'spaCy', 'Presidio', 'Elasticsearch', 'AWS Lambda'],
    tpmName: 'Robert Kim',
    tpmEmail: 'robert.kim@company.ai',
    engineeringLead: 'Hannah Fischer',
    engineeringLeadEmail: 'hannah.fischer@company.ai',
    githubRepo: 'https://github.com/company-ai/zenith-security',
    githubOwner: 'company-ai',
    githubRepoName: 'zenith-security',
    currentSprint: 'Sprint 8 – PII Detection + Redaction',
    currentMilestone: 'M2: SOC2 Readiness',
    riskLevel: 'high',
    color: 'slate',
    emoji: '🛡️',
    metrics: { velocity: 24, velocityTarget: 38, openPRs: 9, mergedPRsThisWeek: 2, openIssues: 18, blockerCount: 3, lastDeployedAt: daysAgo(3), testCoverage: 70 },
    statusHistory: history(
      ['medium', 'medium', 'high', 'high'],
      38,
      [35, 30, 26, 24],
      ['PII detection at 94% precision, scope expanding', 'False positive rate at 8%, target <2%', 'Legal review needed, GDPR gap identified', 'SOC2 audit prep blocked on log redaction module'],
    ),
  },
];

// ─── MOCK MEETING NOTES ───────────────────────────────────────────────────────

export const MOCK_NOTES: MeetingNote[] = [
  // Nexus
  {
    id: uid(), podId: 'nexus', title: 'Sprint 14 Kickoff', meetingDate: daysAgo(7),
    createdAt: daysAgo(7), updatedAt: daysAgo(7),
    attendees: ['Sarah Chen', 'Marcus Webb', 'Team'],
    rawNotes: 'Kicked off Sprint 14 focused on vision+audio fusion. Main risk is modality router latency.',
    entries: [
      entry('highlight', 'Vision encoder v2 shipped — 15% accuracy improvement on benchmark', 7),
      entry('risk', 'Modality router P99 latency at 850ms, target is 500ms', 7),
      entry('callout', 'LLM inference cost up 20% this sprint — needs arch review before scaling', 7),
      entry('note', 'Team requested 2 additional infra instances for staging environment', 7),
    ],
  },
  {
    id: uid(), podId: 'nexus', title: 'Mid-Sprint Check-in', meetingDate: daysAgo(3),
    createdAt: daysAgo(3), updatedAt: daysAgo(3),
    attendees: ['Sarah Chen', 'Marcus Webb'],
    rawNotes: 'Mid-sprint sync. Infra review PR still pending. Cost spike being investigated.',
    entries: [
      entry('blocker', 'Infra review on routing PR (#234) pending for 5 days — blocking 3 downstream tickets', 3),
      entry('highlight', 'Audio transcription latency reduced to 120ms p50 — ahead of target', 3),
      entry('callout', 'Stakeholder from ML platform team wants alignment meeting on shared model serving', 3),
    ],
  },
  {
    id: uid(), podId: 'nexus', title: 'Weekly TPM Sync', meetingDate: daysAgo(1),
    createdAt: daysAgo(1), updatedAt: daysAgo(1),
    attendees: ['Sarah Chen'],
    rawNotes: 'Quick sync. Team morale good. Blocker escalated to infra team lead.',
    entries: [
      entry('note', 'Escalated infra review to Elena (infra lead), expected resolution by Thursday', 1),
      entry('highlight', 'Demo to CTO scheduled for end of sprint — team is excited', 1),
    ],
  },

  // Orion
  {
    id: uid(), podId: 'orion', title: 'Sprint 11 Review', meetingDate: daysAgo(5),
    createdAt: daysAgo(5), updatedAt: daysAgo(5),
    attendees: ['James Park', 'Priya Nair', 'Team'],
    rawNotes: 'Excellent sprint. 45 points delivered vs 42 target. AST-aware diff is a game changer.',
    entries: [
      entry('highlight', 'AST-aware diff shipped — reduces hallucinations in code edits by 60%', 5),
      entry('highlight', 'Context window optimization cut average latency by 40% (P50: 180ms → 108ms)', 5),
      entry('note', 'Enterprise beta onboarding 3 customers next week', 5),
      entry('callout', 'Request from product to add Python notebook support — evaluate for Sprint 12', 5),
    ],
  },
  {
    id: uid(), podId: 'orion', title: 'Enterprise Beta Prep', meetingDate: daysAgo(2),
    createdAt: daysAgo(2), updatedAt: daysAgo(2),
    attendees: ['James Park', 'Priya Nair', 'Sales'],
    rawNotes: 'Prep meeting for enterprise beta. All systems go.',
    entries: [
      entry('highlight', 'Security audit passed — SOC2 compliant for enterprise rollout', 2),
      entry('note', 'Rate limiting strategy finalized: 100k tokens/day for beta tier', 2),
    ],
  },

  // Atlas
  {
    id: uid(), podId: 'atlas', title: 'Blocker Review — Kafka Connector', meetingDate: daysAgo(4),
    createdAt: daysAgo(4), updatedAt: daysAgo(4),
    attendees: ['Elena Rodriguez', 'David Kim', 'Infra Team'],
    rawNotes: 'Critical blocker on Kafka connector. Infra access denied due to compliance review.',
    entries: [
      entry('blocker', 'Kafka connector permissions denied by compliance — escalated to VP Eng', 4),
      entry('blocker', 'Data quality regression in staging: 12% of pipeline outputs failing validation', 4),
      entry('risk', 'Current trajectory puts milestone 2 weeks behind schedule', 4),
      entry('callout', 'Compliance team reviewing new cloud IAM policy — could affect 3 other pods', 4),
    ],
  },
  {
    id: uid(), podId: 'atlas', title: 'Weekly Sync', meetingDate: daysAgo(1),
    createdAt: daysAgo(1), updatedAt: daysAgo(1),
    attendees: ['Elena Rodriguez', 'David Kim'],
    rawNotes: 'Partial unblock on Kafka — read-only access granted. Write permissions still pending.',
    entries: [
      entry('note', 'Read-only Kafka access granted — unblocks 1 of 3 blockers', 1),
      entry('risk', 'Write access pending VP approval — estimated 3 more business days', 1),
      entry('blocker', 'Data quality fix needs prod data sample — PII review required first', 1),
      entry('highlight', 'Parallel work: schema registry integration shipped while waiting on blockers', 1),
    ],
  },

  // Vertex
  {
    id: uid(), podId: 'vertex', title: 'Enterprise Pilot Review', meetingDate: daysAgo(3),
    createdAt: daysAgo(3), updatedAt: daysAgo(3),
    attendees: ['Michael Torres', 'Lisa Zhang', 'Enterprise Team'],
    rawNotes: 'Pilot going extremely well. CSAT scores up, customers delighted.',
    entries: [
      entry('highlight', 'CSAT scores up 14 points since pilot launch — customer NPS at 72', 3),
      entry('highlight', 'Auto-escalation engine reducing human handoffs by 38%', 3),
      entry('note', 'TechCorp (pilot customer) requesting Slack integration — in backlog', 3),
      entry('callout', 'Three more enterprise clients want to join pilot — capacity planning needed', 3),
    ],
  },

  // Flux
  {
    id: uid(), podId: 'flux', title: 'OCR Accuracy Deep-dive', meetingDate: daysAgo(6),
    createdAt: daysAgo(6), updatedAt: daysAgo(6),
    attendees: ['Amanda Johnson', 'Kevin O\'Brien', 'ML Team'],
    rawNotes: 'Deep dive on OCR accuracy. Printed text is great, handwriting is the gap.',
    entries: [
      entry('highlight', 'PDF table extraction accuracy at 94% — exceeds M2 target of 90%', 6),
      entry('risk', 'Handwriting OCR stuck at 76% — target is 85%, retraining model', 6),
      entry('blocker', 'Training data labeling pipeline down — 2-day delay on retraining', 6),
      entry('callout', 'Legal team using tool in production already — informal pilot generating feedback', 6),
    ],
  },
  {
    id: uid(), podId: 'flux', title: 'Sprint 7 Check-in', meetingDate: daysAgo(2),
    createdAt: daysAgo(2), updatedAt: daysAgo(2),
    attendees: ['Amanda Johnson', 'Kevin O\'Brien'],
    rawNotes: 'Velocity behind target. Focusing on handwriting blocker.',
    entries: [
      entry('blocker', 'Data labeling pipeline restored but 3-day delay — impacting retraining ETA', 2),
      entry('note', 'Exploring synthetic data augmentation as fallback for handwriting', 2),
    ],
  },

  // Apex
  {
    id: uid(), podId: 'apex', title: 'Sprint 12 Highlights', meetingDate: daysAgo(4),
    createdAt: daysAgo(4), updatedAt: daysAgo(4),
    attendees: ['Chris Washington', 'Yuki Tanaka', 'Team'],
    rawNotes: 'Excellent sprint. HNSW 3x faster, re-ranking A/B test positive.',
    entries: [
      entry('highlight', 'HNSW index rebuild 3x faster than previous — now under 2min for 100M vectors', 4),
      entry('highlight', 'Re-ranking A/B test: +12% precision at rank 5, shipping to prod', 4),
      entry('callout', 'Search team at partner company interested in licensing Apex — leadership FYI', 4),
    ],
  },

  // Helix
  {
    id: uid(), podId: 'helix', title: 'CRITICAL: Latency Escalation', meetingDate: daysAgo(2),
    createdAt: daysAgo(2), updatedAt: daysAgo(2),
    attendees: ['Rachel Green', 'Omar Hassan', 'VP Eng', 'CTO'],
    rawNotes: 'Emergency escalation. P99 latency at 4.2s, 3x over SLA target of 1.5s.',
    entries: [
      entry('blocker', 'P99 voice latency at 4.2s — SLA target is 1.5s — exec team aware', 2),
      entry('blocker', 'WebRTC session dropout rate at 8% — target <0.5%', 2),
      entry('risk', 'M1 milestone at serious risk — need 2 dedicated infra engineers for 2 weeks', 2),
      entry('callout', 'CTO requested daily standups with pod until resolved', 2),
      entry('callout', 'Partnership with streaming infrastructure vendor being evaluated as fix', 2),
    ],
  },
  {
    id: uid(), podId: 'helix', title: 'Infra War Room Day 1', meetingDate: daysAgo(1),
    createdAt: daysAgo(1), updatedAt: daysAgo(1),
    attendees: ['Rachel Green', 'Omar Hassan', 'Infra Team (2 engineers)'],
    rawNotes: 'Infra engineers joined today. Root cause identified: TTS model GPU queue depth.',
    entries: [
      entry('highlight', 'Root cause found: TTS GPU queue saturation at 85% — adding sharding', 1),
      entry('risk', 'Fix deployment planned for tomorrow — 48h until we can validate improvement', 1),
      entry('note', 'Team morale fragile — ensure recognition for overtime work this week', 1),
    ],
  },

  // Prism
  {
    id: uid(), podId: 'prism', title: 'NL-to-SQL Accuracy Review', meetingDate: daysAgo(5),
    createdAt: daysAgo(5), updatedAt: daysAgo(5),
    attendees: ['Daniel Lee', 'Sophie Martin', 'Data Team'],
    rawNotes: 'NL-to-SQL at 89% accuracy. Stakeholder requests adding scope.',
    entries: [
      entry('highlight', 'NL-to-SQL accuracy 89% on benchmark — best in class for our domain', 5),
      entry('callout', 'Stakeholders requesting 3 new chart types mid-sprint — scope creep risk', 5),
      entry('risk', 'Velocity will slip if new scope is accepted without trade-offs', 5),
    ],
  },
  {
    id: uid(), podId: 'prism', title: 'Accessibility Review', meetingDate: daysAgo(1),
    createdAt: daysAgo(1), updatedAt: daysAgo(1),
    attendees: ['Daniel Lee', 'Sophie Martin'],
    rawNotes: 'Charting component needs accessibility work before GA.',
    entries: [
      entry('blocker', 'Charting component fails WCAG 2.1 AA — needs work before GA release', 1),
      entry('note', 'Accessibility audit scheduled for next sprint', 1),
    ],
  },

  // Echo
  {
    id: uid(), podId: 'echo', title: 'Integration Hub Update', meetingDate: daysAgo(3),
    createdAt: daysAgo(3), updatedAt: daysAgo(3),
    attendees: ['Nina Patel', 'Carlos Mendez', 'Partner Team'],
    rawNotes: 'Everything on track. 12 integrations live, Zapier import in beta.',
    entries: [
      entry('highlight', 'Zapier import tool in beta with 3 enterprise customers — feedback positive', 3),
      entry('highlight', '12 native integrations live: Slack, Jira, GitHub, Salesforce, and 8 more', 3),
      entry('callout', 'Customer requests prioritizing Notion and Linear integrations next', 3),
      entry('note', 'Reviewing M5 scope — planning to expand trigger DSL with conditional logic', 3),
    ],
  },

  // Zenith
  {
    id: uid(), podId: 'zenith', title: 'SOC2 Audit Prep Review', meetingDate: daysAgo(4),
    createdAt: daysAgo(4), updatedAt: daysAgo(4),
    attendees: ['Robert Kim', 'Hannah Fischer', 'Legal', 'Security'],
    rawNotes: 'SOC2 prep stalled. Log redaction module not ready. Legal flagged GDPR gap.',
    entries: [
      entry('blocker', 'Log redaction module not ready — SOC2 audit cannot proceed', 4),
      entry('blocker', 'GDPR gap: audit logs retain EU user IDs beyond 30-day policy — legal flagged', 4),
      entry('risk', 'PII false positive rate at 12% — target <2% — needs model retraining', 4),
      entry('callout', 'Legal team needs written risk acknowledgement from VP if audit slips', 4),
    ],
  },
  {
    id: uid(), podId: 'zenith', title: 'PII Model Retraining Plan', meetingDate: daysAgo(1),
    createdAt: daysAgo(1), updatedAt: daysAgo(1),
    attendees: ['Robert Kim', 'Hannah Fischer'],
    rawNotes: 'Retraining plan agreed. Will use synthetic PII data to reduce false positives.',
    entries: [
      entry('note', 'Retraining on synthetic PII dataset starts tomorrow — 5-day training run', 1),
      entry('highlight', 'Log redaction module 70% complete — on track for Thursday deploy', 1),
      entry('risk', 'GDPR fix requires data migration in prod — need change management approval', 1),
    ],
  },
];

// ─── MOCK JOURNAL ENTRIES ─────────────────────────────────────────────────────

export const MOCK_JOURNALS: JournalEntry[] = [
  {
    id: uid(), podId: 'helix', authorName: 'Rachel Green',
    createdAt: daysAgo(3), updatedAt: daysAgo(3),
    rawContent: 'Team update via async journal — situation is serious but team is rallying.',
    entries: [
      entry('risk', 'Daily standups with CTO starting tomorrow — team needs preparation', 3),
      entry('note', 'Omar (Eng Lead) working nights to root-cause the latency issue', 3),
      entry('callout', 'Consider bringing in external vendor for WebRTC expertise', 3),
    ],
  },
  {
    id: uid(), podId: 'atlas', authorName: 'Elena Rodriguez',
    createdAt: daysAgo(5), updatedAt: daysAgo(5),
    rawContent: 'Async update while blockers are being resolved.',
    entries: [
      entry('callout', 'Compliance review affecting 3 pods — coordinate with Zenith and Flux teams', 5),
      entry('note', 'David (Eng Lead) proposed workaround using mock Kafka for sprint continuity', 5),
    ],
  },
  {
    id: uid(), podId: 'nexus', authorName: 'Sarah Chen',
    createdAt: daysAgo(2), updatedAt: daysAgo(2),
    rawContent: 'Journal note on cross-team dependencies.',
    entries: [
      entry('callout', 'Nexus and Apex teams should sync on shared embedding model — potential reuse', 2),
      entry('highlight', 'CTO mentioned Nexus as featured demo at all-hands — high visibility sprint', 2),
    ],
  },
];

// ─── MOCK GITHUB SNAPSHOTS (fallback when no PAT configured) ─────────────────

export const MOCK_GITHUB_SNAPSHOTS: Record<string, GitHubSnapshot> = {
  nexus: {
    fetchedAt: hoursAgo(0),
    openPRCount: 7,
    recentPRs: [
      { number: 234, title: 'feat: modality router with adaptive latency budget', state: 'open', author: 'marcus-webb', createdAt: daysAgo(5), updatedAt: hoursAgo(4), url: 'https://github.com/company-ai/nexus-agent/pull/234', labels: ['infra-review', 'blocking'] },
      { number: 233, title: 'feat: audio transcription streaming endpoint', state: 'open', author: 'jkim', createdAt: daysAgo(3), updatedAt: hoursAgo(2), url: 'https://github.com/company-ai/nexus-agent/pull/233', labels: ['feature'] },
      { number: 231, title: 'fix: vision encoder memory leak on long contexts', state: 'merged', author: 'priya-dev', createdAt: daysAgo(7), updatedAt: daysAgo(6), url: 'https://github.com/company-ai/nexus-agent/pull/231', labels: ['bug', 'memory'] },
    ],
    openIssueCount: 12,
    recentIssues: [
      { number: 198, title: 'Modality router latency exceeds 500ms SLA', state: 'open', author: 'sarah-tpm', createdAt: daysAgo(6), url: 'https://github.com/company-ai/nexus-agent/issues/198', labels: ['performance', 'priority-high'] },
      { number: 195, title: 'LLM inference cost spike in vision mode', state: 'open', author: 'marcus-webb', createdAt: daysAgo(8), url: 'https://github.com/company-ai/nexus-agent/issues/195', labels: ['cost', 'investigation'] },
    ],
    lastCommit: { sha: 'a3f9d12', message: 'chore: bump torch to 2.4.1 for CUDA 12.4 support', author: 'jkim', committedAt: hoursAgo(2), url: 'https://github.com/company-ai/nexus-agent/commit/a3f9d12' },
    recentCommits: [
      { sha: 'a3f9d12', message: 'chore: bump torch to 2.4.1 for CUDA 12.4 support', author: 'jkim', committedAt: hoursAgo(2), url: 'https://github.com/company-ai/nexus-agent/commit/a3f9d12' },
      { sha: 'b8e21c4', message: 'feat: audio encoder streaming mode v2', author: 'marcus-webb', committedAt: hoursAgo(8), url: 'https://github.com/company-ai/nexus-agent/commit/b8e21c4' },
      { sha: 'c12f559', message: 'test: add latency regression suite for modality router', author: 'priya-dev', committedAt: daysAgo(1), url: 'https://github.com/company-ai/nexus-agent/commit/c12f559' },
    ],
  },
  helix: {
    fetchedAt: hoursAgo(0),
    openPRCount: 14,
    recentPRs: [
      { number: 89, title: 'fix: TTS GPU queue sharding for reduced saturation', state: 'open', author: 'omar-h', createdAt: hoursAgo(18), updatedAt: hoursAgo(1), url: 'https://github.com/company-ai/helix-voice/pull/89', labels: ['critical', 'performance'] },
      { number: 87, title: 'fix: WebRTC session dropout reconnect logic', state: 'open', author: 'infra-team', createdAt: daysAgo(2), updatedAt: hoursAgo(6), url: 'https://github.com/company-ai/helix-voice/pull/87', labels: ['critical', 'webrtc'] },
      { number: 85, title: 'feat: streaming TTS chunk size optimization', state: 'open', author: 'omar-h', createdAt: daysAgo(4), updatedAt: daysAgo(3), url: 'https://github.com/company-ai/helix-voice/pull/85', labels: ['performance'] },
    ],
    openIssueCount: 28,
    recentIssues: [
      { number: 71, title: '[CRITICAL] P99 voice latency at 4.2s — SLA breach', state: 'open', author: 'rachel-green', createdAt: daysAgo(3), url: 'https://github.com/company-ai/helix-voice/issues/71', labels: ['critical', 'sla-breach', 'escalated'] },
      { number: 68, title: 'WebRTC dropout rate 8% — target <0.5%', state: 'open', author: 'omar-h', createdAt: daysAgo(5), url: 'https://github.com/company-ai/helix-voice/issues/68', labels: ['critical', 'reliability'] },
    ],
    lastCommit: { sha: 'f7a3b99', message: 'wip: GPU shard config for multi-instance TTS', author: 'omar-h', committedAt: hoursAgo(3), url: 'https://github.com/company-ai/helix-voice/commit/f7a3b99' },
    recentCommits: [
      { sha: 'f7a3b99', message: 'wip: GPU shard config for multi-instance TTS', author: 'omar-h', committedAt: hoursAgo(3), url: 'https://github.com/company-ai/helix-voice/commit/f7a3b99' },
      { sha: 'e2c48d1', message: 'debug: add latency tracing spans to TTS pipeline', author: 'infra-team', committedAt: hoursAgo(12), url: 'https://github.com/company-ai/helix-voice/commit/e2c48d1' },
    ],
  },
  atlas: {
    fetchedAt: hoursAgo(0),
    openPRCount: 11,
    recentPRs: [
      { number: 156, title: 'feat: schema registry integration for Kafka topics', state: 'merged', author: 'david-kim', createdAt: daysAgo(3), updatedAt: daysAgo(1), url: 'https://github.com/company-ai/atlas-pipeline/pull/156', labels: ['feature'] },
      { number: 154, title: 'feat: Kafka connector with write permissions', state: 'open', author: 'david-kim', createdAt: daysAgo(8), updatedAt: daysAgo(4), url: 'https://github.com/company-ai/atlas-pipeline/pull/154', labels: ['blocked', 'infra'] },
    ],
    openIssueCount: 21,
    recentIssues: [
      { number: 203, title: 'Data quality regression: 12% validation failures in staging', state: 'open', author: 'elena-r', createdAt: daysAgo(5), url: 'https://github.com/company-ai/atlas-pipeline/issues/203', labels: ['bug', 'data-quality', 'high-priority'] },
      { number: 200, title: 'Kafka connector write access blocked by compliance', state: 'open', author: 'david-kim', createdAt: daysAgo(8), url: 'https://github.com/company-ai/atlas-pipeline/issues/200', labels: ['blocked', 'compliance'] },
    ],
    lastCommit: { sha: 'd4e87f2', message: 'feat: schema registry avro serialization support', author: 'david-kim', committedAt: hoursAgo(5), url: 'https://github.com/company-ai/atlas-pipeline/commit/d4e87f2' },
    recentCommits: [
      { sha: 'd4e87f2', message: 'feat: schema registry avro serialization support', author: 'david-kim', committedAt: hoursAgo(5), url: 'https://github.com/company-ai/atlas-pipeline/commit/d4e87f2' },
    ],
  },
};

// Fill remaining pods with generic snapshots
(['orion', 'vertex', 'flux', 'apex', 'prism', 'echo', 'zenith'] as const).forEach((id) => {
  const pod = MOCK_PODS.find(p => p.id === id)!;
  MOCK_GITHUB_SNAPSHOTS[id] = {
    fetchedAt: hoursAgo(0),
    openPRCount: pod.metrics.openPRs,
    recentPRs: [
      { number: 100, title: `feat: ${pod.currentSprint.split('–')[1]?.trim() ?? 'core feature'} implementation`, state: 'open', author: pod.engineeringLead.toLowerCase().replace(' ', '-'), createdAt: daysAgo(3), updatedAt: hoursAgo(5), url: pod.githubRepo + '/pull/100', labels: ['feature'] },
      { number: 99, title: 'chore: update dependencies and CI pipeline', state: 'merged', author: pod.engineeringLead.toLowerCase().replace(' ', '-'), createdAt: daysAgo(5), updatedAt: daysAgo(4), url: pod.githubRepo + '/pull/99', labels: ['chore'] },
    ],
    openIssueCount: pod.metrics.openIssues,
    recentIssues: pod.metrics.blockerCount > 0 ? [
      { number: 50, title: `Blocker: ${pod.currentMilestone} deliverable at risk`, state: 'open', author: pod.tpmName.toLowerCase().replace(' ', '-'), createdAt: daysAgo(4), url: pod.githubRepo + '/issues/50', labels: ['blocker'] },
    ] : [],
    lastCommit: { sha: 'abc1234', message: `feat: sprint progress on ${pod.currentSprint}`, author: pod.engineeringLead.toLowerCase().replace(' ', '-'), committedAt: hoursAgo(4), url: pod.githubRepo + '/commit/abc1234' },
    recentCommits: [
      { sha: 'abc1234', message: `feat: sprint progress on ${pod.currentSprint}`, author: pod.engineeringLead.toLowerCase().replace(' ', '-'), committedAt: hoursAgo(4), url: pod.githubRepo + '/commit/abc1234' },
      { sha: 'def5678', message: 'fix: code review feedback', author: pod.engineeringLead.toLowerCase().replace(' ', '-'), committedAt: hoursAgo(12), url: pod.githubRepo + '/commit/def5678' },
    ],
  };
});

// ─── DEFAULT SETTINGS ─────────────────────────────────────────────────────────

export const DEFAULT_SETTINGS: AppSettings = {
  pmName: 'Alex Morgan',
  githubPAT: '',
  updateRecipients: ['leadership@company.ai', 'vp-eng@company.ai', 'cto@company.ai'],
  updateSendChannel: 'copy',
  slackWebhookUrl: '',
  scheduledTaskId: null,
  leadershipNames: 'CEO, CTO, VP Engineering, VP Product',
};
