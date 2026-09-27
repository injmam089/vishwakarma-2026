import { wsClient } from './websocketClient';
import type { WsAlertEvent } from '../../types';

export const subscribeZoneAlerts = (
  zoneId: string,
  callback: (event: WsAlertEvent) => void
): (() => void) => {
  const topic = `/topic/zones/${zoneId}/alerts`;
  return wsClient.subscribe<WsAlertEvent>(topic, callback);
};
