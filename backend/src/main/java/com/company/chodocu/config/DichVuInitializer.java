package com.company.chodocu.config;

import com.company.chodocu.entity.DichVu;
import com.company.chodocu.repository.DichVuRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DichVuInitializer {
    @Bean
    ApplicationRunner seedDichVu(DichVuRepository repository) {
        return args -> {
            if (!repository.findAllByTrangThaiOrderByIdAsc("HoatDong").isEmpty()) return;

            repository.saveAll(List.of(
                    taoGoi("Gói Tuần", "50000", 7, 15, 45),
                    taoGoi("Gói Tháng", "120000", 30, 45, 100),
                    taoGoi("Gói Dài Hạn", "299000", 90, 100, 300)
            ));
        };
    }

    private DichVu taoGoi(String ten, String gia, int soNgay, int luotDay, int luotDang) {
        DichVu dichVu = new DichVu();
        dichVu.setTenDichVu(ten);
        dichVu.setGia(new BigDecimal(gia));
        dichVu.setThoiGianDichVu(soNgay);
        dichVu.setLuotDay(luotDay);
        dichVu.setLuotDang(luotDang);
        dichVu.setTrangThai("HoatDong");
        return dichVu;
    }
}
