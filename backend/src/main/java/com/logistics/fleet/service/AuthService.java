package com.logistics.fleet.service;

import com.logistics.fleet.model.dto.AuthResponseDto;
import com.logistics.fleet.model.dto.LoginRequestDto;
import com.logistics.fleet.model.entity.User;
import com.logistics.fleet.repository.UserRepository;
import com.logistics.fleet.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;

    public AuthResponseDto login(LoginRequestDto request) {
        if (request == null || request.email() == null || request.password() == null) {
            throw new IllegalArgumentException("Email y password son obligatorios");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalStateException("Usuario autenticado no encontrado"));
        return new AuthResponseDto(
                tokenProvider.generateToken(user),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name());
    }
}
