import { apiClient } from './client';

export type ApiThresholdParam = 'TILT' | 'SOIL_MOISTURE' | 'RAINFALL' | 'VIBRATION';

export interface ApiThreshold {
  id: number;
  zoneId: string;
  parameter: ApiThresholdParam;
  warningValue: number;
  criticalValue: number;
}

export interface UpdateThresholdItem {
  parameter: ApiThresholdParam;
  warningValue: number;
  criticalValue: number;
}

export const thresholdApi = {
  getThresholds: async (zoneId: string): Promise<ApiThreshold[]> => {
    return apiClient<ApiThreshold[]>(`/thresholds/${zoneId}`);
  },

  updateThresholds: async (zoneId: string, thresholds: UpdateThresholdItem[]): Promise<ApiThreshold[]> => {
    return apiClient<ApiThreshold[]>(`/thresholds/${zoneId}`, {
      method: 'PUT',
      body: JSON.stringify({ thresholds }),
    });
  },
};
