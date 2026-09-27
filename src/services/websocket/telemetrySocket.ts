import { wsClient } from './websocketClient';
import type { WsTelemetryEvent } from '../../types';

export const subscribeZoneTelemetry = (
  zoneId: string,
  callback: (event: WsTelemetryEvent) => void
): (() => void) => {
  const topic = `/topic/zones/${zoneId}/telemetry`;
  return wsClient.subscribe<WsTelemetryEvent>(topic, callback);
};
