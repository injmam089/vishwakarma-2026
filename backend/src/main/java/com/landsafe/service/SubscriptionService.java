package com.landsafe.service;

import com.landsafe.dto.CreateSubscriptionRequest;
import com.landsafe.dto.SubscriptionDto;
import com.landsafe.dto.UpdatePreferencesRequest;
import com.landsafe.entity.Subscription;
import com.landsafe.exception.DuplicateResourceException;
import com.landsafe.exception.ResourceNotFoundException;
import com.landsafe.repository.SubscriptionRepository;
import com.landsafe.repository.ZoneRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final ZoneRepository zoneRepository;
    private final AuditService auditService;

    public SubscriptionService(
            SubscriptionRepository subscriptionRepository,
            ZoneRepository zoneRepository,
            AuditService auditService) {
        this.subscriptionRepository = subscriptionRepository;
        this.zoneRepository = zoneRepository;
        this.auditService = auditService;
    }

    public List<SubscriptionDto> getUserSubscriptions(Long userId) {
        return subscriptionRepository.findByUserId(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubscriptionDto createSubscription(Long userId, CreateSubscriptionRequest request) {
        if (!zoneRepository.existsByZoneId(request.getZoneId())) {
            throw new ResourceNotFoundException("Zone not found: " + request.getZoneId());
        }

        if (subscriptionRepository.findByUserIdAndZoneId(userId, request.getZoneId()).isPresent()) {
            throw new DuplicateResourceException("Subscription already exists for zone: " + request.getZoneId());
        }

        Subscription sub = Subscription.builder()
                .userId(userId)
                .zoneId(request.getZoneId())
                .notificationEnabled(request.getNotificationEnabled() != null ? request.getNotificationEnabled() : true)
                .warningEnabled(true)
                .criticalEnabled(true)
                .deviceEnabled(true)
                .build();

        Subscription saved = subscriptionRepository.save(sub);
        auditService.logAction("USER:" + userId, "SUBSCRIPTION_CREATED", "ZONE:" + request.getZoneId(), "Subscribed to zone alerts");
        return mapToDto(saved);
    }

    @Transactional
    public SubscriptionDto updatePreferences(Long userId, String zoneId, UpdatePreferencesRequest request) {
        Subscription sub = subscriptionRepository.findByUserIdAndZoneId(userId, zoneId)
                .orElseGet(() -> Subscription.builder()
                        .userId(userId)
                        .zoneId(zoneId)
                        .notificationEnabled(true)
                        .warningEnabled(true)
                        .criticalEnabled(true)
                        .deviceEnabled(true)
                        .build());

        if (request.getNotificationEnabled() != null) sub.setNotificationEnabled(request.getNotificationEnabled());
        if (request.getWarningEnabled() != null) sub.setWarningEnabled(request.getWarningEnabled());
        if (request.getCriticalEnabled() != null) sub.setCriticalEnabled(request.getCriticalEnabled());
        if (request.getDeviceEnabled() != null) sub.setDeviceEnabled(request.getDeviceEnabled());

        Subscription saved = subscriptionRepository.save(sub);
        auditService.logAction("USER:" + userId, "SUBSCRIPTION_UPDATED", "ZONE:" + zoneId, "Updated notification preferences");
        return mapToDto(saved);
    }

    @Transactional
    public void deleteSubscription(Long userId, String zoneId) {
        Subscription sub = subscriptionRepository.findByUserIdAndZoneId(userId, zoneId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found for zone: " + zoneId));

        subscriptionRepository.delete(sub);
        auditService.logAction("USER:" + userId, "SUBSCRIPTION_DELETED", "ZONE:" + zoneId, "Unsubscribed from zone alerts");
    }

    private SubscriptionDto mapToDto(Subscription sub) {
        return SubscriptionDto.builder()
                .id(sub.getId())
                .userId(sub.getUserId())
                .zoneId(sub.getZoneId())
                .notificationEnabled(sub.getNotificationEnabled())
                .warningEnabled(sub.getWarningEnabled())
                .criticalEnabled(sub.getCriticalEnabled())
                .deviceEnabled(sub.getDeviceEnabled())
                .build();
    }
}
