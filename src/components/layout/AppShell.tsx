import { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { LayoutDashboard, Send, Settings, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import type { Pod, MeetingNote } from '../../types';

interface Props {
  children: ReactNode;
  pods: Pod[];
  notes: MeetingNote[];
}

export function AppShell({ children, pods, notes }: Props) {
  const navigate = useNavigate();
  const isFriday = new Date().getDay() === 5;
  const isThurs = new Date().getDay() === 4;

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Top nav */}
      <header className="h-12 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-4 shrink-0 z-10">
        <div className="flex items-center gap-2 mr-4">
          <Zap size={18} className="text-indigo-400" />
          <span className="font-semibold text-white text-sm tracking-tight">AI Pod Planner</span>
        </div>

        <NavLink to="/dashboard" className={({ isActive }) => clsx(
          'flex items-center gap-1.5 text-sm px-2.5 py-1 rounded-md transition-colors',
          isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-gray-200'
        )}>
          <LayoutDashboard size={14} />
          Dashboard
        </NavLink>

        <div className="flex-1" />

        {(isFriday || isThurs) && (
          <span className="text-xs bg-indigo-900/60 border border-indigo-700 text-indigo-300 px-2 py-0.5 rounded-full font-medium">
            {isFriday ? '📬 Friday — Send Update' : '📅 Update due tomorrow'}
          </span>
        )}

        <button
          onClick={() => navigate('/update/new')}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-3 py-1.5 rounded-md transition-colors font-medium"
        >
          <Send size={13} />
          Generate Update
        </button>

        <NavLink to="/settings" className={({ isActive }) => clsx(
          'text-gray-400 hover:text-gray-200 p-1.5 rounded-md transition-colors',
          isActive && 'bg-gray-800 text-white'
        )}>
          <Settings size={16} />
        </NavLink>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar pods={pods} notes={notes} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
