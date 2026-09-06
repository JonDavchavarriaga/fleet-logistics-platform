package com.logistics.fleet.service;

import com.logistics.fleet.exception.ResourceNotFoundException;
import com.logistics.fleet.model.dto.ShipmentResponseDto;
import com.logistics.fleet.model.entity.Shipment;
import com.logistics.fleet.model.entity.User;
import com.logistics.fleet.model.enums.ShipmentStatus;
import com.logistics.fleet.repository.ShipmentRepository;
import com.logistics.fleet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<ShipmentResponseDto> assignedTo(String email) {
        User driver = findUser(email);
        return shipmentRepository.findByDriverId(driver.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ShipmentResponseDto updateStatus(Long id, String email, ShipmentStatus status) {
        if (status != ShipmentStatus.IN_TRANSIT && status != ShipmentStatus.DELIVERED) {
            throw new IllegalArgumentException("Solo se permiten estados IN_TRANSIT o DELIVERED");
        }
        User driver = findUser(email);
        Shipment shipment = shipmentRepository.findByIdAndDriverId(id, driver.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Envio no encontrado o no asignado"));
        shipment.setStatus(status);
        return toResponse(shipmentRepository.save(shipment));
    }

    private User findUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    private ShipmentResponseDto toResponse(Shipment shipment) {
        return new ShipmentResponseDto(
                shipment.getId(), shipment.getTrackingNumber(), shipment.getDestinationAddress(),
                shipment.getLatitude(), shipment.getLongitude(), shipment.getCargoDetails(), shipment.getStatus());
    }
}
