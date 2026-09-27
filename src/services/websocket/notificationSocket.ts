import { wsClient } from './websocketClient';
import type { NotificationEvent, AlertRecord } from '../../types';

export const subscribeUserNotifications = (
  userId: number | string,
  callback: (event: NotificationEvent) => void
): (() => void) => {
  const topic = `/topic/users/${userId}/notifications`;
  return wsClient.subscribe<NotificationEvent>(topic, callback);
};

export const subscribeAdminNotifications = (
  callback: (event: NotificationEvent) => void
): (() => void) => {
  const topic = '/topic/admin/notifications';
  return wsClient.subscribe<NotificationEvent>(topic, callback);
};

export const subscribeAlertUpdates = (
  callback: (alert: AlertRecord) => void
): (() => void) => {
  const topic = '/topic/alerts/updates';
  return wsClient.subscribe<AlertRecord>(topic, callback);
};