package com.company.chodocu.entity;

import com.company.chodocu.enums.TrangThaiNguoiDung;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "NguoiDung")
@AttributeOverride(name = "id", column = @Column(name = "idNguoiDung"))
public class NguoiDung extends BaseEntity {

    @Column(name = "AnhNguoiDung")
    private String anhNguoiDung;

    // int? trong C# -> cho phép null
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdThanhPho")
    private ThanhPho thanhPho;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "IdPhuongXa")
    private PhuongXa phuongXa;

    @Column(name = "HoTen", nullable = false, length = 150)
    private String hoTen = "";

    @Column(name = "SoDienThoai", nullable = false, length = 20)
    private String soDienThoai = "";

    @Column(name = "NgaySinh", nullable = false)
    private LocalDate ngaySinh;

    @Column(name = "GioiTinh", nullable = false, length = 20)
    private String gioiTinh = "";

    @Column(name = "LuotDang", nullable = false)
    private int luotDang;

    @Column(name = "LuotDay", nullable = false)
    private int luotDay;

    @Column(name = "NgayTao", nullable = false, updatable = false)
    private LocalDateTime ngayTao;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", nullable = false, length = 20)
    private TrangThaiNguoiDung trangThai = TrangThaiNguoiDung.HOAT_DONG;

    @PrePersist
    void truocKhiLuu() {
        if (ngayTao == null) {
            ngayTao = LocalDateTime.now();
        }
    }
}