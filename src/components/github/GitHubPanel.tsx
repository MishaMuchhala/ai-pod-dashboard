import { useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { GitPullRequest, AlertCircle, GitCommit, RefreshCw, Github, ExternalLink } from 'lucide-react';
import type { Pod, GitHubSnapshot } from '../../types';
import { clsx } from 'clsx';

interface Props {
  pod: Pod;
  snapshot: GitHubSnapshot | null;
  isLoading: boolean;
  error: string | null;
  hasPAT: boolean;
  onRefresh: (force?: boolean) => void;
}

const STATE_COLORS: Record<string, string> = {
  open: 'bg-green-900/50 text-green-400 border-green-800',
  closed: 'bg-gray-800 text-gray-500 border-gray-700',
  merged: 'bg-purple-900/50 text-purple-400 border-purple-800',
};

export function GitHubPanel({ pod, snapshot, isLoading, error, hasPAT, onRefresh }: Props) {
  useEffect(() => {
    if (hasPAT) onRefresh();
  }, [pod.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Github size={14} className="text-gray-400" />
          <span className="text-sm font-semibold text-white">GitHub</span>
          <a
            href={pod.githubRepo}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-gray-500 hover:text-indigo-400 flex items-center gap-1"
          >
            {pod.githubOwner}/{pod.githubRepoName}
            <ExternalLink size={10} />
          </a>
        </div>
        <div className="flex items-center gap-2">
          {snapshot && (
            <span className="text-xs text-gray-600">
              {formatDistanceToNow(new Date(snapshot.fetchedAt), { addSuffix: true })}
            </span>
          )}
          <button
            onClick={() => onRefresh(true)}
            disabled={isLoading}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <RefreshCw size={13} className={clsx(isLoading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {!hasPAT && (
        <div className="px-4 py-3 bg-gray-800/50 text-xs text-gray-500 border-b border-gray-800">
          Showing mock data. Add a GitHub PAT in{' '}
          <a href="/settings" className="text-indigo-400 hover:text-indigo-300">Settings</a>{' '}
          to see live data.
        </div>
      )}

      {error && (
        <div className="px-4 py-2 text-xs text-red-400 bg-red-900/20 border-b border-red-900/40">
          {error}
        </div>
      )}

      {!snapshot && !isLoading && (
        <div className="px-4 py-8 text-center text-gray-600 text-sm">No data available</div>
      )}

      {snapshot && (
        <div className="divide-y divide-gray-800/60">
          {/* PRs */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <GitPullRequest size={12} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Pull Requests ({snapshot.openPRCount} open)
              </span>
            </div>
            <div className="space-y-2">
              {snapshot.recentPRs.map(pr => (
                <div key={pr.number} className="flex items-start gap-2">
                  <span className={clsx('text-xs px-1.5 py-0.5 rounded border shrink-0 font-mono', STATE_COLORS[pr.state])}>
                    #{pr.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <a
                      href={pr.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gray-300 hover:text-indigo-400 line-clamp-1 transition-colors"
                    >
                      {pr.title}
                    </a>
                    <p className="text-xs text-gray-600">
                      @{pr.author} · {formatDistanceToNow(new Date(pr.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issues */}
          {snapshot.recentIssues.length > 0 && (
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={12} className="text-gray-500" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Issues ({snapshot.openIssueCount} open)
                </span>
              </div>
              <div className="space-y-2">
                {snapshot.recentIssues.map(issue => (
                  <div key={issue.number} className="flex items-start gap-2">
                    <span className="text-xs px-1.5 py-0.5 rounded border bg-gray-800 text-gray-400 border-gray-700 shrink-0 font-mono">
                      #{issue.number}
                    </span>
                    <div className="min-w-0">
                      <a
                        href={issue.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-300 hover:text-indigo-400 line-clamp-1 transition-colors"
                      >
                        {issue.title}
                      </a>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {issue.labels.slice(0, 3).map(l => (
                          <span key={l} className="text-xs bg-gray-800 text-gray-500 px-1 rounded">{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Commits */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <GitCommit size={12} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Recent Commits</span>
            </div>
            <div className="space-y-2">
              {snapshot.recentCommits.slice(0, 5).map(commit => (
                <div key={commit.sha} className="flex items-start gap-2">
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-mono text-indigo-500 hover:text-indigo-400 shrink-0"
                  >
                    {commit.sha}
                  </a>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-400 line-clamp-1">{commit.message}</p>
                    <p className="text-xs text-gray-600">
                      @{commit.author} · {formatDistanceToNow(new Date(commit.committedAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
