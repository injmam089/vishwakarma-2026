import { wsClient } from './websocketClient';
import type { WsDeviceStatusEvent } from '../../types';

export const subscribeDeviceStatus = (
  deviceId: string,
  callback: (event: WsDeviceStatusEvent) => void
): (() => void) => {
  const topic = `/topic/devices/${deviceId}/status`;
  return wsClient.subscribe<WsDeviceStatusEvent>(topic, callback);
};
