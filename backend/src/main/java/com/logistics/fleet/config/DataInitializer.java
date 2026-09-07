package com.logistics.fleet.config;

import com.logistics.fleet.model.entity.Shipment;
import com.logistics.fleet.model.entity.User;
import com.logistics.fleet.model.enums.DriverStatus;
import com.logistics.fleet.model.enums.Role;
import com.logistics.fleet.model.enums.ShipmentStatus;
import com.logistics.fleet.repository.ShipmentRepository;
import com.logistics.fleet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Objects;

@Configuration
@Profile("dev")
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final ShipmentRepository shipmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initializeDevelopmentData() {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }
            User dispatcher = userRepository.save(Objects.requireNonNull(User.builder()
                    .email("admin@fleet.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Fleet Administrator")
                    .role(Role.ROLE_DISPATCHER)
                    .status(DriverStatus.ACTIVE)
                    .build()));
            User driver = userRepository.save(Objects.requireNonNull(User.builder()
                    .email("driver@fleet.com")
                    .password(passwordEncoder.encode("driver123"))
                    .fullName("Fleet Driver")
                    .role(Role.ROLE_DRIVER)
                    .status(DriverStatus.ACTIVE)
                    .build()));
            shipmentRepository.save(Objects.requireNonNull(Shipment.builder()
                    .trackingNumber("FLT-0001")
                    .driver(driver)
                    .destinationAddress("Calle 80 # 10-20, Bogota")
                    .latitude(4.710989)
                    .longitude(-74.072092)
                    .cargoDetails("Paquete general")
                    .status(ShipmentStatus.PENDING)
                    .build()));
            shipmentRepository.save(Objects.requireNonNull(Shipment.builder()
                    .trackingNumber("FLT-0002")
                    .driver(driver)
                    .destinationAddress("Carrera 7 # 72-41, Bogota")
                    .latitude(4.667348)
                    .longitude(-74.054555)
                    .cargoDetails("Documentos urgentes")
                    .status(ShipmentStatus.PENDING)
                    .build()));
        };
    }
}
