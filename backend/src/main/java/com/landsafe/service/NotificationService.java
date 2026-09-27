package com.landsafe.service;

import com.landsafe.dto.NotificationEventDto;
import com.landsafe.entity.*;
import com.landsafe.repository.NotificationDeliveryRepository;
import com.landsafe.repository.SubscriptionRepository;
import com.landsafe.repository.UserRepository;
import com.landsafe.websocket.WebSocketEventPublisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final NotificationDeliveryRepository notificationDeliveryRepository;
    private final WebSocketEventPublisher webSocketEventPublisher;
    private final EmailNotificationService emailNotificationService;
    private final AuditService auditService;

    public NotificationService(
            SubscriptionRepository subscriptionRepository,
            UserRepository userRepository,
            NotificationDeliveryRepository notificationDeliveryRepository,
            WebSocketEventPublisher webSocketEventPublisher,
            EmailNotificationService emailNotificationService,
            AuditService auditService) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.notificationDeliveryRepository = notificationDeliveryRepository;
        this.webSocketEventPublisher = webSocketEventPublisher;
        this.emailNotificationService = emailNotificationService;
        this.auditService = auditService;
    }

    public void dispatchAlertNotifications(Alert alert) {
        List<Subscription> subscriptions = subscriptionRepository.findByZoneIdAndNotificationEnabledTrue(alert.getZoneId());

        for (Subscription sub : subscriptions) {
            if (alert.getSeverity() == AlertSeverity.WARNING && !Boolean.TRUE.equals(sub.getWarningEnabled())) {
                continue;
            }
            if (alert.getSeverity() == AlertSeverity.CRITICAL && !Boolean.TRUE.equals(sub.getCriticalEnabled())) {
                continue;
            }
            if ((alert.getSeverity() == AlertSeverity.DEVICE_OFFLINE || alert.getSeverity() == AlertSeverity.DEVICE_RECOVERED)
                    && !Boolean.TRUE.equals(sub.getDeviceEnabled())) {
                continue;
            }

            deliverToUser(sub.getUserId(), alert);
        }

        // Broadcast device alerts to admin topic
        if (alert.getSeverity() == AlertSeverity.DEVICE_OFFLINE || alert.getSeverity() == AlertSeverity.DEVICE_RECOVERED) {
            NotificationEventDto adminNotice = NotificationEventDto.builder()
                    .alertId(alert.getAlertId())
                    .eventId(alert.getEventId())
                    .zoneId(alert.getZoneId())
                    .deviceId(alert.getDeviceId())
                    .severity(alert.getSeverity().name())
                    .condition(alert.getCondition())
                    .reason(alert.getReason())
                    .triggeringValues(alert.getTriggeringValues())
                    .timestamp(alert.getCreatedAt())
                    .channel("IN_APP")
                    .build();
            webSocketEventPublisher.publishAdminNotification(adminNotice);
        }
    }

    private void deliverToUser(Long userId, Alert alert) {
        NotificationEventDto event = NotificationEventDto.builder()
                .alertId(alert.getAlertId())
                .eventId(alert.getEventId())
                .zoneId(alert.getZoneId())
                .deviceId(alert.getDeviceId())
                .severity(alert.getSeverity().name())
                .condition(alert.getCondition())
                .reason(alert.getReason())
                .triggeringValues(alert.getTriggeringValues())
                .timestamp(alert.getCreatedAt())
                .channel("IN_APP")
                .build();

        // 1. In-App delivery via WebSocket
        webSocketEventPublisher.publishUserNotification(userId, event);

        NotificationDelivery inAppDelivery = NotificationDelivery.builder()
                .alertId(alert.getAlertId())
                .userId(userId)
                .channel(NotificationChannel.IN_APP)
                .status(DeliveryStatus.SENT)
                .sentAt(Instant.now())
                .build();
        notificationDeliveryRepository.save(inAppDelivery);
        auditService.logAction("SYSTEM", "NOTIFICATION_SENT", "USER:" + userId, "In-app delivery for alert " + alert.getAlertId());

        // 2. Email delivery attempt
        userRepository.findById(userId).ifPresent(user -> {
            boolean sent = emailNotificationService.sendAlertEmail(user.getEmail(), alert);
            NotificationDelivery emailDelivery = NotificationDelivery.builder()
                    .alertId(alert.getAlertId())
                    .userId(userId)
                    .channel(NotificationChannel.EMAIL)
                    .status(sent ? DeliveryStatus.SENT : DeliveryStatus.FAILED)
                    .sentAt(sent ? Instant.now() : null)
                    .failureReason(sent ? null : "SMTP transmission failed")
                    .build();
            notificationDeliveryRepository.save(emailDelivery);
            auditService.logAction("SYSTEM", sent ? "NOTIFICATION_SENT" : "NOTIFICATION_FAILED", "USER:" + userId,
                    "Email delivery to " + user.getEmail() + " status: " + (sent ? "SENT" : "FAILED"));
        });
    }

    public List<NotificationDelivery> getUserNotifications(Long userId) {
        return notificationDeliveryRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
