package com.landsafe.controller;

import com.landsafe.dto.CreateSubscriptionRequest;
import com.landsafe.dto.SubscriptionDto;
import com.landsafe.dto.UpdatePreferencesRequest;
import com.landsafe.entity.User;
import com.landsafe.exception.ResourceNotFoundException;
import com.landsafe.repository.UserRepository;
import com.landsafe.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@Tag(name = "Subscriptions", description = "User zone hazard alert notifications and subscriptions")
@SecurityRequirement(name = "Bearer Authentication")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    public SubscriptionController(SubscriptionService subscriptionService, UserRepository userRepository) {
        this.subscriptionService = subscriptionService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @Operation(summary = "List current user's hazard zone alert subscriptions")
    public ResponseEntity<List<SubscriptionDto>> getMySubscriptions(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(subscriptionService.getUserSubscriptions(user.getId()));
    }

    @PostMapping
    @Operation(summary = "Subscribe current user to emergency hazard alerts for a specific zone")
    public ResponseEntity<SubscriptionDto> createSubscription(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateSubscriptionRequest request) {
        User user = getUser(userDetails);
        return ResponseEntity.status(HttpStatus.CREATED).body(subscriptionService.createSubscription(user.getId(), request));
    }

    @PutMapping("/{zoneId}/preferences")
    @Operation(summary = "Update user notification preferences for a specific hazard zone")
    public ResponseEntity<SubscriptionDto> updatePreferences(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String zoneId,
            @RequestBody UpdatePreferencesRequest request) {
        User user = getUser(userDetails);
        return ResponseEntity.ok(subscriptionService.updatePreferences(user.getId(), zoneId, request));
    }

    @DeleteMapping("/{zoneId}")
    @Operation(summary = "Unsubscribe current user from a specific zone's hazard alerts")
    public ResponseEntity<Void> deleteSubscription(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String zoneId) {
        User user = getUser(userDetails);
        subscriptionService.deleteSubscription(user.getId(), zoneId);
        return ResponseEntity.noContent().build();
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found: " + userDetails.getUsername()));
    }
}
