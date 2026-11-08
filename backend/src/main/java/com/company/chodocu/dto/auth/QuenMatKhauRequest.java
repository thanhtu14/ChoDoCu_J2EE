package com.company.chodocu.dto.auth;
import jakarta.validation.constraints.*;
public record QuenMatKhauRequest(@NotBlank @Email String email) {}
