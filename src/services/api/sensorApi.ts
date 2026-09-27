import { apiClient } from './client';

export interface ApiSensorReading {
  id: number;
  timestamp: string;
  deviceId: string;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  compositeTilt: number;
  soilMoisture: number;
  rainfall: number;
  vibration: number;
  battery: number;
}

export interface IngestSensorPayload {
  deviceId: string;
  zoneId: string;
  timestamp: string;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  soilMoisture: number;
  rainfall: number;
  vibration: number;
  battery: number;
}

export const sensorApi = {
  ingest: async (payload: IngestSensorPayload): Promise<ApiSensorReading> => {
    return apiClient<ApiSensorReading>('/sensor-data', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getLatest: async (zoneId: string): Promise<ApiSensorReading> => {
    return apiClient<ApiSensorReading>(`/sensors/latest?zoneId=${encodeURIComponent(zoneId)}`);
  },

  getHistory: async (zoneId: string, from?: string, to?: string): Promise<ApiSensorReading[]> => {
    const params = new URLSearchParams({ zoneId });
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    return apiClient<ApiSensorReading[]>(`/sensors/history?${params.toString()}`);
  },

  exportCsvUrl: (zoneId: string, from?: string, to?: string): string => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    const params = new URLSearchParams({ zoneId });
    if (from) params.set('from', from);
    if (to) params.set('to', to);
    return `${base}/sensors/export?${params.toString()}`;
  },
};
