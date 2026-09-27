package com.landsafe.websocket;

import com.landsafe.dto.NotificationEventDto;
import com.landsafe.websocket.dto.AlertCreatedEvent;
import com.landsafe.websocket.dto.DeviceStatusEvent;
import com.landsafe.websocket.dto.RiskUpdateEvent;
import com.landsafe.websocket.dto.TelemetryUpdateEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
public class WebSocketEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(WebSocketEventPublisher.class);

    private final SimpMessagingTemplate messagingTemplate;
    private WebSocketEventListener eventListener;

    public interface WebSocketEventListener {
        default void onTelemetry(String zoneId, TelemetryUpdateEvent event) {}
        default void onRiskUpdate(String zoneId, RiskUpdateEvent event) {}
        default void onAlertCreated(String zoneId, AlertCreatedEvent event) {}
        default void onAlertUpdated(String zoneId, Object alertDto) {}
        default void onDeviceStatus(String deviceId, DeviceStatusEvent event) {}
        default void onUserNotification(Long userId, NotificationEventDto event) {}
        default void onAdminNotification(NotificationEventDto event) {}
    }

    public WebSocketEventPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void setEventListener(WebSocketEventListener eventListener) {
        this.eventListener = eventListener;
    }

    public void publishTelemetry(String zoneId, TelemetryUpdateEvent event) {
        String destination = "/topic/zones/" + zoneId + "/telemetry";
        log.debug("Publishing telemetry to {}: device={}", destination, event.getDeviceId());
        if (eventListener != null) {
            eventListener.onTelemetry(zoneId, event);
        }
        if (messagingTemplate != null) {
            messagingTemplate.convertAndSend(destination, event);
        }
    }

    public void publishRiskUpdate(String zoneId, RiskUpdateEvent event) {
        String destination = "/topic/zones/" + zoneId + "/risk";
        log.info("Publishing risk update to {}: level={}, index={}", destination, event.getRiskLevel(), event.getRiskIndex());
        if (eventListener != null) {
            eventListener.onRiskUpdate(zoneId, event);
        }
        if (messagingTemplate != null) {
            messagingTemplate.convertAndSend(destination, event);
        }
    }

    public void publishAlertCreated(String zoneId, AlertCreatedEvent event) {
        String destination = "/topic/zones/" + zoneId + "/alerts";
        log.warn("Publishing alert created to {}: id={}, severity={}", destination, event.getEventId(), event.getSeverity());
        if (eventListener != null) {
            eventListener.onAlertCreated(zoneId, event);
        }
        if (messagingTemplate != null) {
            messagingTemplate.convertAndSend(destination, event);
        }
    }

    public void publishAlertUpdated(String zoneId, Object alertDto) {
        String destination = "/topic/zones/" + zoneId + "/alerts";
        log.info("Publishing alert updated to {}: alert={}", destination, alertDto);
        if (eventListener != null) {
            eventListener.onAlertUpdated(zoneId, alertDto);
        }
        if (messagingTemplate != null) {
            messagingTemplate.convertAndSend(destination, alertDto);
        }
    }

    public void publishDeviceStatus(String deviceId, DeviceStatusEvent event) {
        String destination = "/topic/devices/" + deviceId + "/status";
        log.info("Publishing device status to {}: status={}", destination, event.getStatus());
        if (eventListener != null) {
            eventListener.onDeviceStatus(deviceId, event);
        }
        if (messagingTemplate != null) {
            messagingTemplate.convertAndSend(destination, event);
        }
    }

    public void publishUserNotification(Long userId, NotificationEventDto event) {
        String destination = "/topic/users/" + userId + "/notifications";
        log.info("Publishing user notification to {}: alertId={}, severity={}", destination, event.getAlertId(), event.getSeverity());
        if (eventListener != null) {
            eventListener.onUserNotification(userId, event);
        }
        if (messagingTemplate != null) {
            messagingTemplate.convertAndSend(destination, event);
        }
    }

    public void publishAdminNotification(NotificationEventDto event) {
        String destination = "/topic/admin/notifications";
        log.info("Publishing admin notification to {}: alertId={}, severity={}", destination, event.getAlertId(), event.getSeverity());
        if (eventListener != null) {
            eventListener.onAdminNotification(event);
        }
        if (messagingTemplate != null) {
            messagingTemplate.convertAndSend(destination, event);
        }
    }
}
