import { apiClient } from './client';
import type { AlertSeverity } from '../../types';

export interface ApiAlert {
  id: string;
  alertId?: string;
  eventId?: string;
  timestamp: string;
  severity: AlertSeverity;
  condition: string;
  reason?: string;
  zoneId: string;
  deviceId: string;
  value: string;
  threshold: string;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  protocol: string;
  triggeringValues?: string;
  createdAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export const alertApi = {
  getAlerts: async (): Promise<ApiAlert[]> => {
    return apiClient<ApiAlert[]>('/alerts');
  },

  getActiveAlerts: async (): Promise<ApiAlert[]> => {
    return apiClient<ApiAlert[]>('/alerts/active');
  },

  getAlertById: async (id: string): Promise<ApiAlert> => {
    return apiClient<ApiAlert>(`/alerts/${id}`);
  },

  acknowledgeAlert: async (alertId: string): Promise<ApiAlert> => {
    return apiClient<ApiAlert>(`/alerts/${alertId}/acknowledge`, {
      method: 'PATCH',
    });
  },

  resolveAlert: async (alertId: string): Promise<ApiAlert> => {
    return apiClient<ApiAlert>(`/alerts/${alertId}/resolve`, {
      method: 'PATCH',
    });
  },
};
