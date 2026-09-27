package com.landsafe.service;

import com.landsafe.entity.AuditLog;
import com.landsafe.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void logAction(String username, String action, String resource, String details) {
        try {
            AuditLog entry = AuditLog.builder()
                    .username(username != null ? username : "SYSTEM")
                    .action(action)
                    .resource(resource)
                    .details(details)
                    .timestamp(Instant.now())
                    .build();
            auditLogRepository.save(entry);
            log.info("[AUDIT] User '{}' performed '{}' on '{}': {}", username, action, resource, details);
        } catch (Exception e) {
            log.warn("Failed to persist audit log entry: {}", e.getMessage());
        }
    }

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }
}
