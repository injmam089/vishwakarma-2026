package com.landsafe.websocket;

import com.landsafe.websocket.dto.AlertCreatedEvent;
import com.landsafe.websocket.dto.RiskUpdateEvent;
import org.springframework.stereotype.Service;

@Service
public class RiskWebSocketService {

    private final WebSocketEventPublisher eventPublisher;

    public RiskWebSocketService(WebSocketEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    public void broadcastRiskUpdate(String zoneId, RiskUpdateEvent event) {
        eventPublisher.publishRiskUpdate(zoneId, event);
    }

    public void broadcastAlertCreated(String zoneId, AlertCreatedEvent event) {
        eventPublisher.publishAlertCreated(zoneId, event);
    }
}
