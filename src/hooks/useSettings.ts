import { useLocalStorage } from './useLocalStorage';
import { DEFAULT_SETTINGS } from '../data/mockData';
import type { AppSettings } from '../types';

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('mp:settings', DEFAULT_SETTINGS);

  function updateSettings(patch: Partial<AppSettings>) {
    setSettings(prev => ({ ...prev, ...patch }));
  }

  return { settings, updateSettings };
}
