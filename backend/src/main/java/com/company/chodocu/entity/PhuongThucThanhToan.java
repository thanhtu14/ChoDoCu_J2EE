package com.company.chodocu.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "PhuongThucThanhToan")
@AttributeOverride(name = "id", column = @Column(name = "idPhuongThucThanhToan"))
public class PhuongThucThanhToan extends BaseEntity {
    
    @Column(name = "TenPhuongThuc", nullable = false, length = 100)
    private String tenPhuongThuc;
    
    @Column(name = "MoTa", length = 500)
    private String moTa;
    
    @Column(name = "TrangThai", nullable = false, length = 30)
    private String trangThai = "HoatDong";

    @Column(name = "NgayTao", nullable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();

    @OneToMany(mappedBy = "idPhuongThucThanhToan")
    private List<ThanhToan> thanhToans = new ArrayList<>();
}
