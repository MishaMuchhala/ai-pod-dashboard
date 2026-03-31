import { useState } from 'react';
import { Eye, EyeOff, Check, Github, Bell, Users, Calendar } from 'lucide-react';
import type { AppSettings } from '../types';

interface Props {
  settings: AppSettings;
  onUpdate: (patch: Partial<AppSettings>) => void;
  onScheduleFriday: () => Promise<void>;
}

export function SettingsPage({ settings, onUpdate, onScheduleFriday }: Props) {
  const [showPAT, setShowPAT] = useState(false);
  const [saved, setSaved] = useState(false);
  const [scheduling, setScheduling] = useState(false);

  function handleSave(patch: Partial<AppSettings>) {
    onUpdate(patch);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleSchedule() {
    setScheduling(true);
    await onScheduleFriday();
    setScheduling(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure your preferences and integrations.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 bg-green-900/40 border border-green-800 rounded-xl px-4 py-2 text-sm text-green-400">
          <Check size={14} />
          Settings saved
        </div>
      )}

      {/* Profile */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} className="text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Profile</h2>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Your Name</label>
            <input
              value={settings.pmName}
              onChange={e => onUpdate({ pmName: e.target.value })}
              onBlur={() => handleSave({ pmName: settings.pmName })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Leadership Audience (for update header)</label>
            <input
              value={settings.leadershipNames}
              onChange={e => onUpdate({ leadershipNames: e.target.value })}
              onBlur={() => handleSave({ leadershipNames: settings.leadershipNames })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* GitHub */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Github size={14} className="text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">GitHub Integration</h2>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
          <div className="text-xs text-yellow-700 bg-yellow-900/20 border border-yellow-900/40 rounded-lg px-3 py-2">
            Your PAT is stored locally in your browser (localStorage). Never share it or commit it.
            Required scopes: <code className="font-mono">repo</code>, <code className="font-mono">read:org</code>.
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Personal Access Token</label>
            <div className="flex gap-2">
              <input
                type={showPAT ? 'text' : 'password'}
                value={settings.githubPAT}
                onChange={e => onUpdate({ githubPAT: e.target.value })}
                placeholder="ghp_..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPAT(v => !v)}
                className="text-gray-500 hover:text-gray-300 bg-gray-800 border border-gray-700 rounded-lg px-3"
              >
                {showPAT ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={() => handleSave({ githubPAT: settings.githubPAT })}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
            {settings.githubPAT && (
              <p className="text-xs text-green-500 mt-1.5 flex items-center gap-1">
                <Check size={11} />
                PAT configured — GitHub panels will show live data
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Update settings */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Bell size={14} className="text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Weekly Update</h2>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Recipients (one per line)</label>
            <textarea
              value={settings.updateRecipients.join('\n')}
              onChange={e => onUpdate({ updateRecipients: e.target.value.split('\n').filter(Boolean) })}
              onBlur={() => handleSave({ updateRecipients: settings.updateRecipients })}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1.5">Send Channel</label>
            <div className="flex gap-2">
              {(['copy', 'slack'] as const).map(ch => (
                <button
                  key={ch}
                  onClick={() => handleSave({ updateSendChannel: ch })}
                  className={`text-sm px-4 py-2 rounded-lg border capitalize transition-colors ${
                    settings.updateSendChannel === ch
                      ? 'bg-indigo-900/50 border-indigo-700 text-indigo-300'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {ch === 'copy' ? 'Copy to clipboard' : 'Slack webhook'}
                </button>
              ))}
            </div>
          </div>
          {settings.updateSendChannel === 'slack' && (
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Slack Webhook URL</label>
              <input
                value={settings.slackWebhookUrl}
                onChange={e => onUpdate({ slackWebhookUrl: e.target.value })}
                onBlur={() => handleSave({ slackWebhookUrl: settings.slackWebhookUrl })}
                placeholder="https://hooks.slack.com/services/..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-gray-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}
        </div>
      </section>

      {/* Scheduling */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={14} className="text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">Friday Automation</h2>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <p className="text-sm text-gray-400">
            Automatically generate and prepare your weekly update every Friday at 1PM.
            The update will be ready to copy or send from the Update Composer.
          </p>
          {settings.scheduledTaskId ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm text-green-400">
                <Check size={14} />
                Friday 1PM update scheduled
              </span>
              <button
                onClick={() => handleSave({ scheduledTaskId: null })}
                className="text-xs text-gray-500 hover:text-red-400"
              >
                Cancel schedule
              </button>
            </div>
          ) : (
            <button
              onClick={handleSchedule}
              disabled={scheduling}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Calendar size={14} />
              {scheduling ? 'Scheduling...' : 'Activate Friday 1PM Updates'}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
