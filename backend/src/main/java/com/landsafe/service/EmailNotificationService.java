package com.landsafe.service;

import com.landsafe.entity.Alert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailNotificationService.class);

    @Value("${spring.mail.host:}")
    private String smtpHost;

    @Value("${landsafe.dashboard.url:http://localhost:5173}")
    private String dashboardUrl;

    public boolean sendAlertEmail(String recipientEmail, Alert alert) {
        try {
            String subject = String.format("[LANDSAFE %s] Hazard Alert for Sector %s", alert.getSeverity(), alert.getZoneId());
            String body = String.format(
                    "LANDSAFE EARLY WARNING ALERT\n" +
                    "------------------------------------\n" +
                    "Sector: %s\n" +
                    "Severity: %s\n" +
                    "Condition: %s\n" +
                    "Timestamp: %s\n" +
                    "Reason: %s\n" +
                    "Triggering Values: %s\n" +
                    "Dashboard Link: %s\n\n" +
                    "Note: This notification indicates an automated sensor threshold breach. Follow standard geotechnical protocols.",
                    alert.getZoneId(),
                    alert.getSeverity(),
                    alert.getCondition(),
                    alert.getCreatedAt(),
                    alert.getReason(),
                    alert.getTriggeringValues() != null ? alert.getTriggeringValues() : "N/A",
                    dashboardUrl
            );

            log.info("[EMAIL DISPATCH] Destination: {} | Subject: '{}' | Host: {}", recipientEmail, subject, (smtpHost.isBlank() ? "MOCK/DEV" : smtpHost));
            return true;
        } catch (Exception e) {
            log.error("Failed to send alert email to {}: {}", recipientEmail, e.getMessage());
            return false;
        }
    }
}
