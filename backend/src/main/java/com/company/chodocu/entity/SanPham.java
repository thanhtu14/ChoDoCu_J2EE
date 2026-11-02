package com.company.chodocu.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "SanPham")
@AttributeOverride(name = "id", column = @Column(name = "idSanPham"))
public class SanPham extends BaseEntity {
    @Column(name = "idDanhMuc", insertable = false, updatable = false)
    private Integer idDanhMuc;
    @Column(name = "idHang", insertable = false, updatable = false)
    private Integer idHang;
    @Column(name = "idDongSanPham", insertable = false, updatable = false)
    private Integer idDongSanPham;
    @Column(name = "idDongCuThe", insertable = false, updatable = false)
    private Integer idDongCuThe;

    @Column(name = "tenSanPham", nullable = false, length = 200)
    private String tenSanPham = "";
    @Column(name = "giaTien", nullable = false, precision = 18, scale = 2)
    private BigDecimal giaTien = BigDecimal.ZERO;
    @Column(name = "moTa", nullable = false, length = 2000)
    private String moTa = "";

    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "idDanhMuc", nullable = false)
    private DanhMuc danhMuc;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "idHang", nullable = false)
    private Hang hang;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "idDongSanPham", nullable = false)
    private DongSanPham dongSanPham;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "idDongCuThe", nullable = false)
    private DongCuThe dongCuThe;

    @OneToOne(mappedBy = "sanPham", fetch = FetchType.LAZY)
    private BaiDang baiDang;

    @OneToMany(mappedBy = "sanPham")
    private List<SanPhamThuocTinh> thuocTinhs = new ArrayList<>();
}
