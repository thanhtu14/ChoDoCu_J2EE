package com.company.chodocu.dto.auth;
import java.time.Instant;
import java.util.List;
public record AuthResponse(String token, Instant expiresAtUtc, Integer idNguoiDung, String hoTen,
 String email, String role, List<String> roles, List<String> permissions) {}
