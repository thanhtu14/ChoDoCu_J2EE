package com.company.chodocu.dto.account;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record CapNhatHoSoRequest(
        @NotBlank @Size(max = 150) String hoTen,
        @Size(max = 20) String soDienThoai,
        LocalDate ngaySinh,
        @Size(max = 20) String gioiTinh,
        @Size(max = 1000) String anhNguoiDung,
        Integer idThanhPho,
        Integer idPhuongXa) { }
