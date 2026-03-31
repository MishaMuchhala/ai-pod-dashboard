import { useLocalStorage } from './useLocalStorage';
import { MOCK_PODS } from '../data/mockData';
import type { Pod, RiskLevel, PodMetrics } from '../types';

export function usePods() {
  const [pods, setPods] = useLocalStorage<Pod[]>('mp:pods', MOCK_PODS);

  function getPod(id: string): Pod | undefined {
    return pods.find(p => p.id === id);
  }

  function updatePodRisk(podId: string, level: RiskLevel) {
    setPods(prev => prev.map(p => p.id === podId ? { ...p, riskLevel: level } : p));
  }

  function updatePodMetrics(podId: string, metrics: Partial<PodMetrics>) {
    setPods(prev => prev.map(p =>
      p.id === podId ? { ...p, metrics: { ...p.metrics, ...metrics } } : p
    ));
  }

  return { pods, getPod, updatePodRisk, updatePodMetrics };
}
