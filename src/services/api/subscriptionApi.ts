import { apiClient } from './client';
import type { NotificationPreferences } from '../../types';


export interface ApiSubscription {
  id: number;
  userId: number;
  zoneId: string;
  notificationEnabled: boolean;
  warningEnabled?: boolean;
  criticalEnabled?: boolean;
  deviceEnabled?: boolean;
}

export const subscriptionApi = {
  getMySubscriptions: async (): Promise<ApiSubscription[]> => {
    return apiClient<ApiSubscription[]>('/subscriptions');
  },

  createSubscription: async (zoneId: string, notificationEnabled = true): Promise<ApiSubscription> => {
    return apiClient<ApiSubscription>('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ zoneId, notificationEnabled }),
    });
  },

  updatePreferences: async (zoneId: string, prefs: Partial<NotificationPreferences>): Promise<ApiSubscription> => {
    return apiClient<ApiSubscription>(`/subscriptions/${zoneId}/preferences`, {
      method: 'PUT',
      body: JSON.stringify(prefs),
    });
  },

  deleteSubscription: async (zoneId: string): Promise<void> => {
    return apiClient<void>(`/subscriptions/${zoneId}`, {
      method: 'DELETE',
    });
  },
};

