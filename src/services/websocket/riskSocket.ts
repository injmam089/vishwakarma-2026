import { wsClient } from './websocketClient';
import type { WsRiskEvent } from '../../types';

export const subscribeZoneRisk = (
  zoneId: string,
  callback: (event: WsRiskEvent) => void
): (() => void) => {
  const topic = `/topic/zones/${zoneId}/risk`;
  return wsClient.subscribe<WsRiskEvent>(topic, callback);
};
