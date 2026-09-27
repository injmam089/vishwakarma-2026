import { Client } from '@stomp/stompjs';
import type { IMessage, StompSubscription } from '@stomp/stompjs';
import type { WsStatus } from '../../types';

// Derive WebSocket URL from window location or env var
const getWsUrl = (): string => {
  const envUrl = import.meta.env.VITE_WS_BASE_URL;
  if (envUrl) return envUrl;

  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
  try {
    const parsed = new URL(apiUrl);
    const protocol = parsed.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${parsed.host}/ws`;
  } catch {
    return 'ws://localhost:8080/ws';
  }
};

type StatusListener = (status: WsStatus) => void;
type MessageCallback<T> = (data: T) => void;

interface ActiveSubscription {
  topic: string;
  callback: MessageCallback<any>;
  stompSub?: StompSubscription;
}

class LandsafeWebSocketClient {
  private client: Client | null = null;
  private status: WsStatus = 'OFFLINE';
  private statusListeners: Set<StatusListener> = new Set();
  private subscriptions: Map<string, ActiveSubscription> = new Map();
  private reconnectAttempt = 0;
  private maxReconnectAttempts = 8;
  private reconnectTimer: any = null;
  private explicitlyClosed = false;

  constructor() {
    this.initClient();
  }

  private setStatus(newStatus: WsStatus) {
    if (this.status !== newStatus) {
      console.log(`[WebSocket] Status changed: ${this.status} -> ${newStatus}`);
      this.status = newStatus;
      this.statusListeners.forEach((listener) => {
        try {
          listener(newStatus);
        } catch (e) {
          console.error('[WebSocket] Listener error', e);
        }
      });
    }
  }

  public getStatus(): WsStatus {
    return this.status;
  }

  public onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  private initClient() {
    const brokerURL = getWsUrl();
    console.log(`[WebSocket] Initializing STOMP client to: ${brokerURL}`);

    this.client = new Client({
      brokerURL,
      reconnectDelay: 0, // We control exponential backoff explicitly
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      beforeConnect: () => {
        const token = localStorage.getItem('landsafe_token');
        if (token && this.client) {
          this.client.connectHeaders = {
            Authorization: `Bearer ${token}`,
          };
        }
      },
      onConnect: () => {
        console.log('[WebSocket] Connected and authenticated successfully');
        this.reconnectAttempt = 0;
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
        this.setStatus('LIVE');
        this.resubscribeAll();
      },
      onDisconnect: () => {
        console.log('[WebSocket] Disconnected');
        if (this.explicitlyClosed) {
          this.setStatus('OFFLINE');
        } else {
          this.scheduleReconnect();
        }
      },
      onStompError: (frame) => {
        console.warn('[WebSocket] STOMP Error frame received:', frame.headers['message']);
        this.scheduleReconnect();
      },
      onWebSocketClose: () => {
        console.log('[WebSocket] Underlying connection closed');
        if (!this.explicitlyClosed) {
          this.scheduleReconnect();
        } else {
          this.setStatus('OFFLINE');
        }
      },
      onWebSocketError: (error) => {
        console.warn('[WebSocket] Transport error:', error);
        if (!this.explicitlyClosed) {
          this.scheduleReconnect();
        }
      },
    });
  }

  private scheduleReconnect() {
    if (this.explicitlyClosed) return;

    if (this.reconnectAttempt >= this.maxReconnectAttempts) {
      console.warn('[WebSocket] Max reconnect attempts reached. Switching to OFFLINE.');
      this.setStatus('OFFLINE');
      return;
    }

    this.setStatus('RECONNECTING');
    this.reconnectAttempt += 1;

    // Exponential backoff: 1s, 2s, 4s, 8s, up to 15s max
    const backoffMs = Math.min(15000, 1000 * Math.pow(2, this.reconnectAttempt - 1));
    console.log(`[WebSocket] Scheduling reconnect attempt #${this.reconnectAttempt} in ${backoffMs}ms...`);

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      if (!this.explicitlyClosed) {
        this.reconnect();
      }
    }, backoffMs);
  }

  public connect() {
    this.explicitlyClosed = false;
    if (this.status === 'LIVE' && this.client?.active) {
      return;
    }

    this.setStatus('CONNECTING');
    if (!this.client) {
      this.initClient();
    }
    try {
      this.client?.activate();
    } catch (err) {
      console.warn('[WebSocket] Error activating STOMP client:', err);
      this.scheduleReconnect();
    }
  }

  public reconnect() {
    if (this.explicitlyClosed) return;
    this.setStatus('CONNECTING');
    try {
      if (this.client?.active) {
        this.client.deactivate();
      }
      this.initClient();
      this.client?.activate();
    } catch (err) {
      console.warn('[WebSocket] Reconnect failure:', err);
      this.scheduleReconnect();
    }
  }

  public disconnect() {
    this.explicitlyClosed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Unsubscribe all active STOMP subscriptions
    this.subscriptions.forEach((sub) => {
      try {
        sub.stompSub?.unsubscribe();
      } catch {
        // ignore
      }
    });
    this.subscriptions.clear();

    if (this.client) {
      try {
        this.client.deactivate();
      } catch {
        // ignore
      }
    }
    this.setStatus('OFFLINE');
  }

  private resubscribeAll() {
    if (!this.client?.connected) return;

    this.subscriptions.forEach((sub) => {
      try {
        console.log(`[WebSocket] Re-subscribing to: ${sub.topic}`);
        const stompSub = this.client!.subscribe(sub.topic, (message: IMessage) => {
          this.handleIncomingMessage(sub.topic, sub.callback, message);
        });
        sub.stompSub = stompSub;
      } catch (err) {
        console.warn(`[WebSocket] Failed to subscribe to ${sub.topic}:`, err);
      }
    });
  }

  private handleIncomingMessage<T>(topic: string, callback: MessageCallback<T>, message: IMessage) {
    try {
      const data = JSON.parse(message.body) as T;
      callback(data);
    } catch (err) {
      console.warn(`[WebSocket] Failed to parse message from topic ${topic}:`, err);
    }
  }

  public subscribe<T>(topic: string, callback: MessageCallback<T>): () => void {
    const subKey = `${topic}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const subRecord: ActiveSubscription = {
      topic,
      callback,
    };

    if (this.client?.connected) {
      try {
        console.log(`[WebSocket] Subscribing directly to: ${topic}`);
        const stompSub = this.client.subscribe(topic, (message: IMessage) => {
          this.handleIncomingMessage(topic, callback, message);
        });
        subRecord.stompSub = stompSub;
      } catch (err) {
        console.warn(`[WebSocket] Failed immediate subscribe to ${topic}:`, err);
      }
    }

    this.subscriptions.set(subKey, subRecord);

    return () => {
      const record = this.subscriptions.get(subKey);
      if (record) {
        try {
          record.stompSub?.unsubscribe();
          console.log(`[WebSocket] Unsubscribed from: ${topic}`);
        } catch {
          // ignore
        }
        this.subscriptions.delete(subKey);
      }
    };
  }
}

export const wsClient = new LandsafeWebSocketClient();
