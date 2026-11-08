package com.company.chodocu.dto.auth;
import jakarta.validation.constraints.NotBlank;
public record DangNhapGoogleRequest(@NotBlank String idToken) {}
