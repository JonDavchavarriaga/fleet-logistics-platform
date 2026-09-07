package com.logistics.fleet.service;

import com.logistics.fleet.model.dto.AuthResponseDto;
import com.logistics.fleet.model.dto.LoginRequestDto;
import com.logistics.fleet.model.entity.User;
import com.logistics.fleet.model.enums.Role;
import com.logistics.fleet.repository.UserRepository;
import com.logistics.fleet.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    private AuthService authService;

    private final JwtTokenProvider tokenProvider = new JwtTokenProvider(
            "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970", 60_000L);

    @org.junit.jupiter.api.BeforeEach
    void setUp() {
        authService = new AuthService(authenticationManager, userRepository, tokenProvider);
    }

    @Test
    void loginReturnsTokenAndUserDetails() {
        User user = User.builder()
                .email("driver@example.com")
                .fullName("Test Driver")
                .role(Role.ROLE_DRIVER)
                .build();
        when(userRepository.findByEmail("driver@example.com")).thenReturn(Optional.of(user));
        AuthResponseDto response = authService.login(new LoginRequestDto("driver@example.com", "password"));

        assertNotNull(response.token());
        assertEquals("driver@example.com", response.email());
        assertEquals("Test Driver", response.fullName());
        assertEquals("ROLE_DRIVER", response.role());
        verify(authenticationManager).authenticate(any());
    }

    @Test
    void loginRejectsMissingCredentials() {
        assertThrows(IllegalArgumentException.class,
                () -> authService.login(new LoginRequestDto(null, "password")));
        verifyNoInteractions(authenticationManager, userRepository);
    }

    @Test
    void loginRejectsNullRequest() {
        assertThrows(IllegalArgumentException.class, () -> authService.login(null));
        verifyNoInteractions(authenticationManager, userRepository);
    }

    @Test
    void loginFailsWhenAuthenticatedUserIsMissing() {
        when(userRepository.findByEmail("driver@example.com")).thenReturn(Optional.empty());

        assertThrows(IllegalStateException.class,
                () -> authService.login(new LoginRequestDto("driver@example.com", "password")));
    }
}
