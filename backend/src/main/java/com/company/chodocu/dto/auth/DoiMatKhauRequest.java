package com.company.chodocu.dto.auth;
import jakarta.validation.constraints.*;
public record DoiMatKhauRequest(@NotBlank String matKhauCu,@NotBlank @Size(min=8,max=72) String matKhauMoi) {}
