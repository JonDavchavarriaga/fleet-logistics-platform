package com.logistics.fleet.model.dto;

public record AuthResponseDto(String token, String email, String fullName, String role) {
}
