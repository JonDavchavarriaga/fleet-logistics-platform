package com.logistics.fleet.controller;

import com.logistics.fleet.model.dto.LocationPingDto;
import com.logistics.fleet.service.TelemetryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/telemetry")
@RequiredArgsConstructor
public class TelemetryController {

    private final TelemetryService telemetryService;

    @PostMapping("/location")
    public ResponseEntity<Void> reportLocation(
            @RequestBody LocationPingDto ping,
            Authentication authentication
    ) {
        telemetryService.recordLocation(authentication.getName(), ping);
        return ResponseEntity.accepted().build();
    }
}
