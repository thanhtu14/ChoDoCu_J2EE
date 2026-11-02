package com.company.chodocu.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "DongSanPham")
@AttributeOverride(name = "id", column = @Column(name = "idDongSanPham"))
public class DongSanPham extends BaseEntity {
    @Column(name = "tenDongSanPham", length = 150)
    private String tenDongSanPham;

    @Column(name = "trangThai", nullable = false, length = 30)
    private String trangThai = "HoatDong";

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idHang", nullable = false)
    private Hang idHang;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idDanhMuc", nullable = false)
    private Integer idDanhMuc;

    @OneToMany(mappedBy = "dongSanPham")
    private List<DongCuThe> dongCuThes = new ArrayList<>();

    @OneToMany(mappedBy = "dongSanPham")
    private List<SanPham> sanPhams = new ArrayList<>();
}
