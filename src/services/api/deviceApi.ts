import { apiClient } from './client';

export interface ApiDevice {
  id: number;
  deviceId: string;
  zoneId: string;
  status: 'ONLINE' | 'OFFLINE';
  lastSeen: string;
  batteryLevel: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiDeviceStatus {
  deviceId: string;
  zoneId: string;
  status: 'ONLINE' | 'OFFLINE';
  lastSeen: string;
  batteryLevel: number | null;
  online: boolean;
}

export const deviceApi = {
  getDevices: async (): Promise<ApiDevice[]> => {
    return apiClient<ApiDevice[]>('/devices');
  },

  getDeviceById: async (deviceId: string): Promise<ApiDevice> => {
    return apiClient<ApiDevice>(`/devices/${deviceId}`);
  },

  getDeviceStatus: async (deviceId: string): Promise<ApiDeviceStatus> => {
    return apiClient<ApiDeviceStatus>(`/devices/${deviceId}/status`);
  },

  sendHeartbeat: async (deviceId: string): Promise<ApiDeviceStatus> => {
    return apiClient<ApiDeviceStatus>(`/devices/${deviceId}/heartbeat`, {
      method: 'POST',
    });
  },
};
