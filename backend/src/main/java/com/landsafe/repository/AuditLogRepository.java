package com.landsafe.repository;

import com.landsafe.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByTimestampDesc();

    List<AuditLog> findByActionOrderByTimestampDesc(String action);

    List<AuditLog> findByUsernameOrderByTimestampDesc(String username);
}
