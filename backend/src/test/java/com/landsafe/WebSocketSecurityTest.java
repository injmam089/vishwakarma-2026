package com.landsafe;

import com.landsafe.repository.SubscriptionRepository;
import com.landsafe.repository.UserRepository;
import com.landsafe.security.JwtUtil;
import com.landsafe.websocket.WebSocketAuthInterceptor;
import org.junit.jupiter.api.BeforeEach;
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
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

@SpringBootTest
@ActiveProfiles("test")
public class WebSocketSecurityTest {

    @Autowired
    private WebSocketAuthInterceptor authInterceptor;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    private String adminToken;
    private String userToken;
    private MessageChannel dummyChannel;

    @BeforeEach
    void setUp() {
        dummyChannel = mock(MessageChannel.class);
        adminToken = jwtUtil.generateToken("admin@geomonitor.org", "ROLE_ADMIN");
        userToken = jwtUtil.generateToken("user@geomonitor.org", "ROLE_USER");
    }

    @Test
    @DisplayName("Should authenticate valid JWT on STOMP CONNECT frame")
    void testConnectValidJwt() {
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.CONNECT);
        accessor.setLeaveMutable(true);
        accessor.addNativeHeader("Authorization", "Bearer " + adminToken);
        Message<?> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());

        Message<?> result = authInterceptor.preSend(message, dummyChannel);
        assertNotNull(result);

        StompHeaderAccessor resultAccessor = StompHeaderAccessor.wrap(result);
        assertNotNull(resultAccessor.getUser());
        assertEquals("admin@geomonitor.org", resultAccessor.getUser().getName());
    }

    @Test
    @DisplayName("Should reject invalid JWT on STOMP CONNECT frame with BadCredentialsException")
    void testConnectInvalidJwt() {
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.CONNECT);
        accessor.setLeaveMutable(true);
        accessor.addNativeHeader("Authorization", "Bearer invalid.jwt.token");
        Message<?> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());

        assertThrows(BadCredentialsException.class, () -> authInterceptor.preSend(message, dummyChannel));
    }

    @Test
    @DisplayName("Should reject unauthenticated subscription with AccessDeniedException")
    void testSubscribeUnauthenticated() {
        StompHeaderAccessor accessor = StompHeaderAccessor.create(StompCommand.SUBSCRIBE);
        accessor.setLeaveMutable(true);
        accessor.setDestination("/topic/zones/ZONE-01/telemetry");
        Message<?> message = MessageBuilder.createMessage(new byte[0], accessor.getMessageHeaders());

        assertThrows(AccessDeniedException.class, () -> authInterceptor.preSend(message, dummyChannel));
    }

    @Test
    @DisplayName("Should allow ADMIN to subscribe to any zone")
    void testSubscribeAdminAnyZone() {
        // 1. Connect as ADMIN
        StompHeaderAccessor connectAccessor = StompHeaderAccessor.create(StompCommand.CONNECT);
        connectAccessor.setLeaveMutable(true);
        connectAccessor.addNativeHeader("Authorization", "Bearer " + adminToken);
        Message<?> connectMsg = authInterceptor.preSend(
                MessageBuilder.createMessage(new byte[0], connectAccessor.getMessageHeaders()), dummyChannel);
        StompHeaderAccessor authenticatedAccessor = StompHeaderAccessor.wrap(connectMsg);

        // 2. Subscribe to ZONE-03
        StompHeaderAccessor subAccessor = StompHeaderAccessor.create(StompCommand.SUBSCRIBE);
        subAccessor.setLeaveMutable(true);
        subAccessor.setUser(authenticatedAccessor.getUser());
        subAccessor.setDestination("/topic/zones/ZONE-03/telemetry");
        Message<?> subMsg = MessageBuilder.createMessage(new byte[0], subAccessor.getMessageHeaders());

        assertDoesNotThrow(() -> authInterceptor.preSend(subMsg, dummyChannel));
    }

    @Test
    @DisplayName("Should allow USER to subscribe to authorized/subscribed zone")
    void testSubscribeUserAuthorizedZone() {
        // Connect as USER
        StompHeaderAccessor connectAccessor = StompHeaderAccessor.create(StompCommand.CONNECT);
        connectAccessor.setLeaveMutable(true);
        connectAccessor.addNativeHeader("Authorization", "Bearer " + userToken);
        Message<?> connectMsg = authInterceptor.preSend(
                MessageBuilder.createMessage(new byte[0], connectAccessor.getMessageHeaders()), dummyChannel);
        StompHeaderAccessor authenticatedAccessor = StompHeaderAccessor.wrap(connectMsg);

        // Subscribe to ZONE-01 (seeded for user)
        StompHeaderAccessor subAccessor = StompHeaderAccessor.create(StompCommand.SUBSCRIBE);
        subAccessor.setLeaveMutable(true);
        subAccessor.setUser(authenticatedAccessor.getUser());
        subAccessor.setDestination("/topic/zones/ZONE-01/telemetry");
        Message<?> subMsg = MessageBuilder.createMessage(new byte[0], subAccessor.getMessageHeaders());

        assertDoesNotThrow(() -> authInterceptor.preSend(subMsg, dummyChannel));
    }

    @Test
    @DisplayName("Should reject USER subscription to non-subscribed zone with AccessDeniedException")
    void testSubscribeUserUnauthorizedZone() {
        // Connect as USER
        StompHeaderAccessor connectAccessor = StompHeaderAccessor.create(StompCommand.CONNECT);
        connectAccessor.setLeaveMutable(true);
        connectAccessor.addNativeHeader("Authorization", "Bearer " + userToken);
        Message<?> connectMsg = authInterceptor.preSend(
                MessageBuilder.createMessage(new byte[0], connectAccessor.getMessageHeaders()), dummyChannel);
        StompHeaderAccessor authenticatedAccessor = StompHeaderAccessor.wrap(connectMsg);

        // Subscribe to ZONE-03 (not subscribed by user)
        StompHeaderAccessor subAccessor = StompHeaderAccessor.create(StompCommand.SUBSCRIBE);
        subAccessor.setLeaveMutable(true);
        subAccessor.setUser(authenticatedAccessor.getUser());
        subAccessor.setDestination("/topic/zones/ZONE-03/telemetry");
        Message<?> subMsg = MessageBuilder.createMessage(new byte[0], subAccessor.getMessageHeaders());

        assertThrows(AccessDeniedException.class, () -> authInterceptor.preSend(subMsg, dummyChannel));
    }
}
