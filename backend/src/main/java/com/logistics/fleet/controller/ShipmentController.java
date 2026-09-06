package com.logistics.fleet.controller;

import com.logistics.fleet.model.dto.ShipmentResponseDto;
import com.logistics.fleet.model.dto.ShipmentStatusRequestDto;
import com.logistics.fleet.service.ShipmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/driver/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    @GetMapping("/assigned")
    public ResponseEntity<List<ShipmentResponseDto>> assigned(Authentication authentication) {
        return ResponseEntity.ok(shipmentService.assignedTo(authentication.getName()));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ShipmentResponseDto> updateStatus(
            @PathVariable Long id,
            @RequestBody ShipmentStatusRequestDto request,
            Authentication authentication
    ) {
        if (request == null) {
            throw new IllegalArgumentException("El estado es obligatorio");
        }
        return ResponseEntity.ok(shipmentService.updateStatus(
                id, authentication.getName(), request.status()));
    }
}
