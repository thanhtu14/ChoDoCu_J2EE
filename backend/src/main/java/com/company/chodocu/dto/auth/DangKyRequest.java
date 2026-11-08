package com.company.chodocu.dto.auth;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
public record DangKyRequest(@NotBlank @Size(max=150) String hoTen, @NotBlank @Email @Size(max=254) String email,
 @NotBlank @Size(max=20) String soDienThoai, @NotBlank @Size(min=8,max=72) String matKhau,
 @NotNull @Past LocalDate ngaySinh, @NotBlank @Size(max=20) String gioiTinh) {}
