package com.company.chodocu.dto.auth;
import jakarta.validation.constraints.*;
public record DatLaiMatKhauRequest(@NotBlank @Email String email,@NotBlank String token,@NotBlank @Size(min=8,max=72) String matKhauMoi) {}
