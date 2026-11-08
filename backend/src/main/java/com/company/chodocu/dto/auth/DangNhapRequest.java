package com.company.chodocu.dto.auth;
import jakarta.validation.constraints.*;
public record DangNhapRequest(@NotBlank @Email String email, @NotBlank String matKhau) {}
