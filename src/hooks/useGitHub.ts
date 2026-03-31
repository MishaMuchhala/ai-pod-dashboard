import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { MOCK_GITHUB_SNAPSHOTS } from '../data/mockData';
import type { Pod, GitHubSnapshot, GitHubPR, GitHubIssue, GitHubCommit } from '../types';

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

export function useGitHub(pod: Pod, pat: string) {
  const [cache, setCache] = useLocalStorage<Record<string, GitHubSnapshot>>('mp:gh-cache', {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const snapshot: GitHubSnapshot | null =
    cache[pod.id] ?? MOCK_GITHUB_SNAPSHOTS[pod.id] ?? null;

  const isCacheStale = useCallback(() => {
    const cached = cache[pod.id];
    if (!cached) return true;
    return Date.now() - new Date(cached.fetchedAt).getTime() > CACHE_TTL_MS;
  }, [cache, pod.id]);

  const refresh = useCallback(async (force = false) => {
    if (!pat) return; // no PAT → use mock
    if (!force && !isCacheStale()) return;

    setIsLoading(true);
    setError(null);

    const { githubOwner: owner, githubRepoName: repo } = pod;
    const BASE = 'https://api.github.com';
    const headers: HeadersInit = {
      Authorization: `Bearer ${pat}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    try {
      const [prRes, issueRes, commitRes] = await Promise.all([
        fetch(`${BASE}/repos/${owner}/${repo}/pulls?state=open&per_page=10`, { headers }),
        fetch(`${BASE}/repos/${owner}/${repo}/issues?state=open&per_page=10`, { headers }),
        fetch(`${BASE}/repos/${owner}/${repo}/commits?per_page=10`, { headers }),
      ]);

      if (!prRes.ok) throw new Error(`GitHub API error: ${prRes.status}`);

      const [prsRaw, issuesRaw, commitsRaw] = await Promise.all([
        prRes.json(),
        issueRes.json(),
        commitRes.json(),
      ]);

      const recentPRs: GitHubPR[] = (Array.isArray(prsRaw) ? prsRaw : []).map((pr: Record<string, unknown>) => ({
        number: pr.number as number,
        title: pr.title as string,
        state: (pr.merged_at ? 'merged' : pr.state) as GitHubPR['state'],
        author: (pr.user as { login: string }).login,
        createdAt: pr.created_at as string,
        updatedAt: pr.updated_at as string,
        url: pr.html_url as string,
        labels: ((pr.labels as Array<{ name: string }>) || []).map((l) => l.name),
      }));

      const recentIssues: GitHubIssue[] = (Array.isArray(issuesRaw) ? issuesRaw : [])
        .filter((i: Record<string, unknown>) => !i.pull_request)
        .map((i: Record<string, unknown>) => ({
          number: i.number as number,
          title: i.title as string,
          state: i.state as GitHubIssue['state'],
          author: (i.user as { login: string }).login,
          createdAt: i.created_at as string,
          url: i.html_url as string,
          labels: ((i.labels as Array<{ name: string }>) || []).map((l) => l.name),
        }));

      const recentCommits: GitHubCommit[] = (Array.isArray(commitsRaw) ? commitsRaw : []).map((c: Record<string, unknown>) => {
        const commit = c.commit as Record<string, unknown>;
        const committer = commit.committer as Record<string, unknown>;
        return {
          sha: (c.sha as string).slice(0, 7),
          message: (commit.message as string).split('\n')[0],
          author: (c.author as { login: string } | null)?.login ?? (commit.author as { name: string }).name,
          committedAt: committer.date as string,
          url: c.html_url as string,
        };
      });

      const newSnapshot: GitHubSnapshot = {
        fetchedAt: new Date().toISOString(),
        openPRCount: recentPRs.length,
        recentPRs,
        openIssueCount: recentIssues.length,
        recentIssues,
        lastCommit: recentCommits[0] ?? null,
        recentCommits,
      };

      setCache(prev => ({ ...prev, [pod.id]: newSnapshot }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch GitHub data');
    } finally {
      setIsLoading(false);
    }
  }, [pat, pod, isCacheStale, setCache]);

  return { snapshot, isLoading, error, refresh, isCacheStale };
}
