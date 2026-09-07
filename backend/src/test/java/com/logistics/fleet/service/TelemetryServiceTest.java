package com.logistics.fleet.service;

import com.logistics.fleet.model.dto.LocationPingDto;
import com.logistics.fleet.model.entity.LocationLog;
import com.logistics.fleet.model.entity.User;
import com.logistics.fleet.model.enums.Role;
import com.logistics.fleet.repository.LocationLogRepository;
import com.logistics.fleet.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TelemetryServiceTest {

    @Mock
    private LocationLogRepository locationLogRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TelemetryService telemetryService;

    @Test
    void recordLocationSavesValidCoordinatesForDriver() {
        User driver = User.builder().email("driver@example.com").role(Role.ROLE_DRIVER).build();
        when(userRepository.findByEmail(driver.getEmail())).thenReturn(Optional.of(driver));

        telemetryService.recordLocation(driver.getEmail(), new LocationPingDto(90.0, -180.0));

        ArgumentCaptor<LocationLog> locationCaptor = ArgumentCaptor.forClass(LocationLog.class);
        verify(locationLogRepository).save(locationCaptor.capture());
        LocationLog savedLocation = locationCaptor.getValue();
        assertSame(driver, savedLocation.getDriver());
        assertEquals(90.0, savedLocation.getLatitude());
        assertEquals(-180.0, savedLocation.getLongitude());
    }

    @Test
    void recordLocationRejectsNullPing() {
        assertThrows(IllegalArgumentException.class,
                () -> telemetryService.recordLocation("driver@example.com", null));
        verifyNoInteractions(userRepository, locationLogRepository);
    }

    @Test
    void recordLocationRejectsOutOfRangeCoordinates() {
        assertThrows(IllegalArgumentException.class,
                () -> telemetryService.recordLocation("driver@example.com", new LocationPingDto(90.1, 0.0)));
        assertThrows(IllegalArgumentException.class,
                () -> telemetryService.recordLocation("driver@example.com", new LocationPingDto(0.0, -180.1)));
        verifyNoInteractions(userRepository, locationLogRepository);
    }

    @Test
    void recordLocationRejectsNonFiniteCoordinates() {
        assertThrows(IllegalArgumentException.class,
                () -> telemetryService.recordLocation("driver@example.com", new LocationPingDto(Double.NaN, 0.0)));
        assertThrows(IllegalArgumentException.class,
                () -> telemetryService.recordLocation("driver@example.com", new LocationPingDto(0.0, Double.POSITIVE_INFINITY)));
        verifyNoInteractions(userRepository, locationLogRepository);
    }

    @Test
    void recordLocationRejectsUnknownDriver() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class,
                () -> telemetryService.recordLocation("missing@example.com", new LocationPingDto(1.0, 2.0)));
        verifyNoInteractions(locationLogRepository);
    }
}
