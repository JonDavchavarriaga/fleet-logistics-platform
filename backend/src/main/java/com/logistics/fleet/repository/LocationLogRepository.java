package com.logistics.fleet.repository;

import com.logistics.fleet.model.entity.LocationLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationLogRepository extends JpaRepository<LocationLog, Long> {
}
