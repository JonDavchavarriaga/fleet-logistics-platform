package com.logistics.fleet.repository;

import com.logistics.fleet.model.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByDriverId(Long driverId);
    Optional<Shipment> findByIdAndDriverId(Long id, Long driverId);
}
