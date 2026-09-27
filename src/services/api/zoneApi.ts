import { apiClient } from './client';
import type { RiskLevel } from '../../types';

export interface ApiZone {
  id: number;
  zoneId: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  elevation: number;
  risk: RiskLevel;
  riskScore: number;
  advisory: string;
  deviceCount: number;
  createdAt: string;
}

export const zoneApi = {
  getZones: async (): Promise<ApiZone[]> => {
    return apiClient<ApiZone[]>('/zones');
  },

  getZoneById: async (zoneId: string): Promise<ApiZone> => {
    return apiClient<ApiZone>(`/zones/${zoneId}`);
  },
};
