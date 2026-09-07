package com.logistics.fleet.security;

import com.logistics.fleet.model.entity.User;
import com.logistics.fleet.model.enums.Role;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private static final String SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    private final JwtTokenProvider tokenProvider = new JwtTokenProvider(SECRET, 60_000L);

    @Test
    void generatedTokenContainsEmailAndRoleClaims() {
        User user = User.builder().email("driver@example.com").role(Role.ROLE_DRIVER).build();

        String token = tokenProvider.generateToken(user);

        assertTrue(tokenProvider.isValid(token));
        assertEquals("driver@example.com", tokenProvider.getEmail(token));
        assertEquals("ROLE_DRIVER", tokenProvider.getRole(token));
    }

    @Test
    void tamperedTokenIsRejected() {
        User user = User.builder().email("driver@example.com").role(Role.ROLE_DRIVER).build();
        String token = tokenProvider.generateToken(user);
        String[] tokenParts = token.split("\\.");
        char replacement = tokenParts[1].charAt(0) == 'A' ? 'B' : 'A';
        tokenParts[1] = replacement + tokenParts[1].substring(1);
        String tamperedToken = String.join(".", tokenParts);

        assertThrows(JwtException.class, () -> tokenProvider.isValid(tamperedToken));
    }

    @Test
    void malformedTokenIsRejected() {
        assertThrows(JwtException.class, () -> tokenProvider.isValid("not-a-jwt"));
    }
}
