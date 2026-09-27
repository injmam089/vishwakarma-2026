package com.landsafe.repository;

import com.landsafe.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserId(Long userId);
    List<Subscription> findByZoneId(String zoneId);
    List<Subscription> findByZoneIdAndNotificationEnabledTrue(String zoneId);
    Optional<Subscription> findByUserIdAndZoneId(Long userId, String zoneId);
    void deleteByUserIdAndZoneId(Long userId, String zoneId);
}
