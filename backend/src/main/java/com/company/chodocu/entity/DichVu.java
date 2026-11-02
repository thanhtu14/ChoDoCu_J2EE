package com.company.chodocu.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "DichVu")
@AttributeOverride(name = "id", column = @Column(name = "idDichVu"))
public class DichVu extends BaseEntity {

    @Column(name = "TenDichVu", nullable = false, length = 150)
    private String tenDichVu = "";

    @Column(name = "Gia", nullable = false, precision = 18, scale = 2)
    private BigDecimal gia = BigDecimal.ZERO;

    // Số ngày hiệu lực
    @Column(name = "ThoiGianDichVu", nullable = false)
    private int thoiGianDichVu;

    @Column(name = "LuotDay", nullable = false)
    private int luotDay;

    @Column(name = "LuotDang", nullable = false)
    private int luotDang;

    @Column(name = "NgayTao", nullable = false, updatable = false)
    private LocalDateTime ngayTao;

    // Giữ kiểu String như model C# (mặc định "HoatDong")
    @Column(name = "TrangThai", nullable = false, length = 20)
    private String trangThai = "HoatDong";

    @PrePersist
    void truocKhiLuu() {
        if (ngayTao == null) {
            ngayTao = LocalDateTime.now();
        }
    }
}