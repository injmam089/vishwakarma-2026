package com.landsafe.repository;

import com.landsafe.entity.DeliveryStatus;
import com.landsafe.entity.NotificationDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationDeliveryRepository extends JpaRepository<NotificationDelivery, Long> {

    List<NotificationDelivery> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<NotificationDelivery> findByAlertId(String alertId);

    List<NotificationDelivery> findByStatus(DeliveryStatus status);
}
