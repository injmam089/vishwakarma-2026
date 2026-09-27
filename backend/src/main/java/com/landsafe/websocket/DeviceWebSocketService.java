package com.landsafe.websocket;

import com.landsafe.websocket.dto.DeviceStatusEvent;
import org.springframework.stereotype.Service;

@Service
public class DeviceWebSocketService {

    private final WebSocketEventPublisher eventPublisher;

    public DeviceWebSocketService(WebSocketEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    public void broadcastDeviceStatus(String deviceId, DeviceStatusEvent event) {
        eventPublisher.publishDeviceStatus(deviceId, event);
    }
}
