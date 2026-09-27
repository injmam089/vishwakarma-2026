import { apiClient } from './client';
import type { RiskLevel } from '../../types';

export interface ApiRiskCurrent {
  zoneId: string;
  riskLevel: RiskLevel;
  riskIndex: number;
  reason: string;
  timestamp: string;
}

export interface ApiRiskEvent {
  id: number;
  eventId: string;
  zoneId: string;
  timestamp: string;
  riskLevel: RiskLevel;
  reason: string;
}

export const riskApi = {
  getCurrentRisk: async (zoneId: string): Promise<ApiRiskCurrent> => {
    return apiClient<ApiRiskCurrent>(`/risk/current?zoneId=${encodeURIComponent(zoneId)}`);
  },

  getRiskEvents: async (zoneId: string): Promise<ApiRiskEvent[]> => {
    return apiClient<ApiRiskEvent[]>(`/risk/events?zoneId=${encodeURIComponent(zoneId)}`);
  },
};
