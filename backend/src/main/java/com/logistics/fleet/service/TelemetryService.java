package com.logistics.fleet.service;

import com.logistics.fleet.model.dto.LocationPingDto;
import com.logistics.fleet.model.entity.LocationLog;
import com.logistics.fleet.model.entity.User;
import com.logistics.fleet.repository.LocationLogRepository;
import com.logistics.fleet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TelemetryService {

    private final LocationLogRepository locationLogRepository;
    private final UserRepository userRepository;

    @Transactional
    public void recordLocation(String email, LocationPingDto ping) {
        validateCoordinates(ping);
        User driver = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        LocationLog locationLog = Objects.requireNonNull(LocationLog.builder()
                .driver(driver)
                .latitude(ping.latitude())
                .longitude(ping.longitude())
                .build());
        locationLogRepository.save(locationLog);
    }

    private void validateCoordinates(LocationPingDto ping) {
        if (ping == null || ping.latitude() == null || ping.longitude() == null
                || !Double.isFinite(ping.latitude()) || !Double.isFinite(ping.longitude())
                || ping.latitude() < -90 || ping.latitude() > 90
                || ping.longitude() < -180 || ping.longitude() > 180) {
            throw new IllegalArgumentException("Coordenadas invalidas");
        }
    }
}
