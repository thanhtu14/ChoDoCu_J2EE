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
import com.company.chodocu.enums.TrangThaiHang;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "Hang")
@AttributeOverride(name = "id", column = @Column(name = "idHang"))
public class Hang extends BaseEntity {
    @Column(name = "tenHang", nullable = false, length = 150)
    private String tenHang;

    @Column(name = "moTa", length = 1000)
    private String moTa;

    @Column(name = "trangThai", nullable = false, length = 30)
    private TrangThaiHang trangThai = TrangThaiHang.HOAT_DONG;

    @OneToMany(mappedBy = "idHang")
    private List<DongSanPham> dongSanPhams = new ArrayList<>();

    @OneToMany(mappedBy = "hang")
    private List<SanPham> sanPhams = new ArrayList<>();
}
