package com.landsafe;

import com.landsafe.exception.ResourceNotFoundException;
import com.landsafe.service.AlertService;
import com.landsafe.websocket.WebSocketAuthInterceptor;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

@SpringBootTest
@ActiveProfiles("test")
public class AlertSecurityTest {

    @Autowired
    private AlertService alertService;

    @Autowired
    private WebSocketAuthInterceptor authInterceptor;

    @Test
    @DisplayName("Should throw ResourceNotFoundException when acknowledging non-existent alert")
    void testAcknowledgeNonExistentAlert() {
        assertThrows(ResourceNotFoundException.class, () -> {
            alertService.acknowledgeAlert("ALT-DOESNOTEXIST", "user@geomonitor.org");
        });
    }

    @Test
    @DisplayName("Should reject user subscription to another user's private notification topic")
    void testPrivateNotificationIsolation() {
        MessageChannel channel = mock(MessageChannel.class);

        // Authenticated user with email user@geomonitor.org (User ID = 2)
        User springUser = new User("user@geomonitor.org", "pass", List.of(new SimpleGrantedAuthority("ROLE_USER")));
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(springUser, null, springUser.getAuthorities());

        // Attempting to subscribe to User ID 999 (another user's topic)
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.SUBSCRIBE);
        accessor.setDestination("/topic/users/999/notifications");
        accessor.setUser(auth);
        accessor.setLeaveMutable(true);
        Message<byte[]> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());

        assertThrows(AccessDeniedException.class, () -> {
            authInterceptor.preSend(message, channel);
        }, "Should deny subscription to another user's private notifications");
    }

    @Test
    @DisplayName("Should reject non-admin user subscription to /topic/admin/notifications")
    void testAdminNotificationProtection() {
        MessageChannel channel = mock(MessageChannel.class);

        User springUser = new User("user@geomonitor.org", "pass", List.of(new SimpleGrantedAuthority("ROLE_USER")));
        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(springUser, null, springUser.getAuthorities());

        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.SUBSCRIBE);
        accessor.setDestination("/topic/admin/notifications");
        accessor.setUser(auth);
        accessor.setLeaveMutable(true);
        Message<byte[]> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());

        assertThrows(AccessDeniedException.class, () -> {
            authInterceptor.preSend(message, channel);
        }, "Should deny non-admin subscription to admin notifications");
    }
}