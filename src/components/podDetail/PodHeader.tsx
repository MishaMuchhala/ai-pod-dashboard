import { RiskBadge } from '../shared/RiskBadge';
import { Mail, ExternalLink, GitBranch, Target } from 'lucide-react';
import type { Pod } from '../../types';

interface Props {
  pod: Pod;
}

export function PodHeader({ pod }: Props) {
  return (
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Left: name + description */}
        <div className="flex items-start gap-3">
          <span className="text-3xl mt-0.5">{pod.emoji}</span>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-white">{pod.name}</h1>
              <RiskBadge level={pod.riskLevel} size="md" pulse />
            </div>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">{pod.description}</p>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-indigo-400">
                <Target size={12} />
                {pod.currentSprint}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <GitBranch size={12} />
                {pod.currentMilestone}
              </span>
            </div>
          </div>
        </div>

        {/* Right: contacts */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">TPM</p>
              <p className="text-white font-medium">{pod.tpmName}</p>
            </div>
            <a href={`mailto:${pod.tpmEmail}`} className="text-gray-500 hover:text-indigo-400 transition-colors">
              <Mail size={14} />
            </a>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">Eng Lead</p>
              <p className="text-white font-medium">{pod.engineeringLead}</p>
            </div>
            <a href={`mailto:${pod.engineeringLeadEmail}`} className="text-gray-500 hover:text-indigo-400 transition-colors">
              <Mail size={14} />
            </a>
          </div>
          <a
            href={pod.githubRepo}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors mt-1"
          >
            <ExternalLink size={12} />
            {pod.githubOwner}/{pod.githubRepoName}
          </a>
        </div>
      </div>

      {/* Tech stack */}
      <div className="flex gap-1.5 mt-3 flex-wrap">
        {pod.techStack.map(tech => (
          <span key={tech} className="text-xs bg-gray-800 border border-gray-700 text-gray-400 px-2 py-0.5 rounded">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
