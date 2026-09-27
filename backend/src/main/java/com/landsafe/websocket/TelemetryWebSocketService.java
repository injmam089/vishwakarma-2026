package com.landsafe.websocket;

import com.landsafe.websocket.dto.TelemetryUpdateEvent;
import org.springframework.stereotype.Service;

@Service
public class TelemetryWebSocketService {

    private final WebSocketEventPublisher eventPublisher;

    public TelemetryWebSocketService(WebSocketEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    public void broadcastTelemetry(String zoneId, TelemetryUpdateEvent event) {
        eventPublisher.publishTelemetry(zoneId, event);
    }
}
