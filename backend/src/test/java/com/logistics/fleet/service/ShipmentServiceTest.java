package com.logistics.fleet.service;

import com.logistics.fleet.exception.ResourceNotFoundException;
import com.logistics.fleet.model.dto.ShipmentResponseDto;
import com.logistics.fleet.model.entity.Shipment;
import com.logistics.fleet.model.entity.User;
import com.logistics.fleet.model.enums.Role;
import com.logistics.fleet.model.enums.ShipmentStatus;
import com.logistics.fleet.repository.ShipmentRepository;
import com.logistics.fleet.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShipmentServiceTest {

    @Mock
    private ShipmentRepository shipmentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ShipmentService shipmentService;

    @Test
    void assignedToMapsDriverShipments() {
        User driver = user(7L, "driver@example.com");
        Shipment shipment = shipment(11L, ShipmentStatus.PENDING);
        when(userRepository.findByEmail(driver.getEmail())).thenReturn(Optional.of(driver));
        when(shipmentRepository.findByDriverId(7L)).thenReturn(List.of(shipment));

        List<ShipmentResponseDto> response = shipmentService.assignedTo(driver.getEmail());

        assertEquals(1, response.size());
        assertEquals(11L, response.get(0).id());
        assertEquals("TRK-11", response.get(0).trackingNumber());
        assertEquals(ShipmentStatus.PENDING, response.get(0).status());
    }

    @Test
    void assignedToRejectsUnknownDriver() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> shipmentService.assignedTo("missing@example.com"));
        verifyNoInteractions(shipmentRepository);
    }

    @Test
    void updateStatusSavesAllowedStatus() {
        User driver = user(7L, "driver@example.com");
        Shipment shipment = shipment(11L, ShipmentStatus.PENDING);
        when(userRepository.findByEmail(driver.getEmail())).thenReturn(Optional.of(driver));
        when(shipmentRepository.findByIdAndDriverId(11L, 7L)).thenReturn(Optional.of(shipment));
        doReturn(shipment).when(shipmentRepository).save(any(Shipment.class));

        ShipmentResponseDto response = shipmentService.updateStatus(11L, driver.getEmail(), ShipmentStatus.DELIVERED);

        assertEquals(ShipmentStatus.DELIVERED, shipment.getStatus());
        assertEquals(ShipmentStatus.DELIVERED, response.status());
        ArgumentCaptor<Shipment> shipmentCaptor = ArgumentCaptor.forClass(Shipment.class);
        verify(shipmentRepository).save(shipmentCaptor.capture());
        assertSame(shipment, shipmentCaptor.getValue());
    }

    @Test
    void updateStatusRejectsUnsupportedStatusBeforeLookup() {
        assertThrows(IllegalArgumentException.class,
                () -> shipmentService.updateStatus(11L, "driver@example.com", ShipmentStatus.PENDING));
        verifyNoInteractions(userRepository, shipmentRepository);
    }

    @Test
    void updateStatusRejectsUnassignedShipment() {
        User driver = user(7L, "driver@example.com");
        when(userRepository.findByEmail(driver.getEmail())).thenReturn(Optional.of(driver));
        when(shipmentRepository.findByIdAndDriverId(11L, 7L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> shipmentService.updateStatus(11L, driver.getEmail(), ShipmentStatus.IN_TRANSIT));
    }

    private static User user(Long id, String email) {
        return User.builder().id(id).email(email).role(Role.ROLE_DRIVER).build();
    }

    private static Shipment shipment(Long id, ShipmentStatus status) {
        return Shipment.builder()
                .id(id)
                .trackingNumber("TRK-" + id)
                .destinationAddress("Destination")
                .latitude(19.4)
                .longitude(-99.1)
                .cargoDetails("Cargo")
                .status(status)
                .build();
    }
}
