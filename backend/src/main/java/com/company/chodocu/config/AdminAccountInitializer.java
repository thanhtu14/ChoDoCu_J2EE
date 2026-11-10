package com.company.chodocu.config;

import com.company.chodocu.entity.NguoiDung;
import com.company.chodocu.enums.TrangThaiNguoiDung;
import com.company.chodocu.repository.NguoiDungRepository;
import com.company.chodocu.repository.VaiTroRepository;
import com.company.chodocu.security.AppRoles;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Locale;

@Configuration
public class AdminAccountInitializer {
    @Bean ApplicationRunner seedAdmin(NguoiDungRepository users, VaiTroRepository roles, PasswordEncoder encoder,
            @Value("${app.seed.admin-email:}") String configuredEmail,
            @Value("${app.seed.admin-password:}") String configuredPassword) {
        return args -> {
            if (configuredEmail.isBlank() && configuredPassword.isBlank()) return;
            if (configuredEmail.isBlank() || configuredPassword.length() < 12)
                throw new IllegalStateException("Cần cấu hình cả SEED_ADMIN_EMAIL và SEED_ADMIN_PASSWORD (ít nhất 12 ký tự).");
            String email=configuredEmail.trim().toLowerCase(Locale.ROOT);
            if (users.existsByEmailIgnoreCase(email)) return;
            var adminRole=roles.findByMaVaiTro(AppRoles.ADMIN).orElseThrow(() -> new IllegalStateException("Chưa áp dụng migration phân quyền."));
            NguoiDung admin=new NguoiDung(); admin.setEmail(email); admin.setMatKhauHash(encoder.encode(configuredPassword));
            admin.setHoTen("Quản trị viên"); admin.setSoDienThoai("0900000000"); admin.setNgaySinh(LocalDate.of(1990,1,1));
            admin.setGioiTinh("Khác"); admin.setTrangThai(TrangThaiNguoiDung.HOAT_DONG); admin.setNgayTao(LocalDateTime.now()); admin.getVaiTros().add(adminRole);
            users.save(admin);
        };
    }
}
