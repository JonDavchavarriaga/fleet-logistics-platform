package com.logistics.fleet.model.dto;

import com.logistics.fleet.model.enums.ShipmentStatus;

public record ShipmentResponseDto(
        Long id,
        String trackingNumber,
        String destinationAddress,
        Double latitude,
        Double longitude,
        String cargoDetails,
        ShipmentStatus status
) {
}
