package com.landsafe.websocket;

import com.landsafe.entity.User;
import com.landsafe.repository.SubscriptionRepository;
import com.landsafe.repository.UserRepository;
import com.landsafe.repository.ZoneRepository;
import com.landsafe.security.JwtUtil;
import com.landsafe.security.UserDetailsServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Principal;
import java.util.Optional;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private static final Logger log = LoggerFactory.getLogger(WebSocketAuthInterceptor.class);

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;
    private final UserRepository userRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final ZoneRepository zoneRepository;

    public WebSocketAuthInterceptor(
            JwtUtil jwtUtil,
            UserDetailsServiceImpl userDetailsService,
            UserRepository userRepository,
            SubscriptionRepository subscriptionRepository,
            ZoneRepository zoneRepository) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
        this.userRepository = userRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.zoneRepository = zoneRepository;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null) {
            return message;
        }

        if (!accessor.isMutable()) {
            StompHeaderAccessor mutable = StompHeaderAccessor.create(accessor.getCommand());
            mutable.copyHeaders(accessor.getMessageHeaders());
            mutable.setLeaveMutable(true);
            accessor = mutable;
            message = MessageBuilder.createMessage(message.getPayload(), accessor.getMessageHeaders());
        }

        // 1. Authenticate on STOMP CONNECT frame
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            if (authHeader == null) {
                authHeader = accessor.getFirstNativeHeader("token");
            }

            if (authHeader != null && !authHeader.isBlank()) {
                String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
                if (jwtUtil.validateToken(token)) {
                    String email = jwtUtil.extractEmail(token);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    accessor.setUser(authentication);
                    log.info("WebSocket STOMP connected user: {} with authorities: {}", email, userDetails.getAuthorities());
                } else {
                    log.warn("Invalid JWT token provided in STOMP CONNECT frame");
                    throw new BadCredentialsException("Invalid JWT token for WebSocket connection");
                }
            } else {
                log.debug("STOMP CONNECT without Authorization header");
            }
        }

        // 2. Authorize subscriptions on STOMP SUBSCRIBE frame
        if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            String destination = accessor.getDestination();
            Principal principal = accessor.getUser();

            if (destination != null) {
                if (principal == null) {
                    log.warn("Unauthenticated subscription attempt to: {}", destination);
                    throw new AccessDeniedException("Authentication required to subscribe to " + destination);
                }

                if (destination.startsWith("/topic/zones/")) {
                    String subPath = destination.substring("/topic/zones/".length());
                    int slashIdx = subPath.indexOf('/');
                    String zoneId = slashIdx > 0 ? subPath.substring(0, slashIdx) : subPath;

                    if (principal instanceof Authentication auth) {
                        boolean isAdmin = auth.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

                        if (!isAdmin) {
                            String email = auth.getName();
                            Optional<User> userOpt = userRepository.findByEmail(email);
                            if (userOpt.isPresent()) {
                                Long userId = userOpt.get().getId();
                                boolean hasSub = subscriptionRepository.findByUserIdAndZoneId(userId, zoneId).isPresent();
                                if (!hasSub) {
                                    log.warn("User {} denied subscription to non-subscribed zone: {}", email, zoneId);
                                    throw new AccessDeniedException("User not authorized for zone: " + zoneId);
                                }
                            } else {
                                throw new AccessDeniedException("User not found");
                            }
                        }
                    }
                } else if (destination.startsWith("/topic/users/")) {
                    String subPath = destination.substring("/topic/users/".length());
                    int slashIdx = subPath.indexOf('/');
                    String targetUserIdStr = slashIdx > 0 ? subPath.substring(0, slashIdx) : subPath;

                    if (principal instanceof Authentication auth) {
                        boolean isAdmin = auth.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

                        if (!isAdmin) {
                            String email = auth.getName();
                            Optional<User> userOpt = userRepository.findByEmail(email);
                            if (userOpt.isPresent()) {
                                String userDbId = String.valueOf(userOpt.get().getId());
                                if (!userDbId.equals(targetUserIdStr)) {
                                    log.warn("User {} attempted to subscribe to private notifications of user ID: {}", email, targetUserIdStr);
                                    throw new AccessDeniedException("Cannot subscribe to other users' private notifications");
                                }
                            } else {
                                throw new AccessDeniedException("User not found");
                            }
                        }
                    }
                } else if (destination.startsWith("/topic/admin/")) {
                    if (principal instanceof Authentication auth) {
                        boolean isAdmin = auth.getAuthorities().stream()
                                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                        if (!isAdmin) {
                            log.warn("Non-admin user {} denied subscription to admin topic: {}", auth.getName(), destination);
                            throw new AccessDeniedException("Admin authority required for topic: " + destination);
                        }
                    }
                }
            }
        }

        return message;
    }
}
