package com.company.chodocu.entity;

import com.company.chodocu.enums.TrangThaiBaiDang;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "BaiDang")
@AttributeOverride(name = "id", column = @Column(name = "idBaiDang"))
public class BaiDang extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdNguoiDang", nullable = false)
    private NguoiDung nguoiDang;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdSanPham", nullable = false, unique = true)
    private SanPham sanPham;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdDanhMuc", nullable = false)
    private DanhMuc danhMuc;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdThanhPho", nullable = false)
    private ThanhPho thanhPho;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdPhuongXa", nullable = false)
    private PhuongXa phuongXa;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdDichVu", nullable = false)
    private DichVu dichVu;

    @Column(name = "TieuDe", nullable = false)
    private String tieuDe;

    @Column(name = "NoiDung", nullable = false, length = 4000)
    private String noiDung;

    @Column(name = "DiaChi", nullable = false)
    private String diaChi;

    @Column(name = "DiaChiChiTiet", nullable = false)
    private String diaChiChiTiet;

    @Column(name = "NgayDang", nullable = false)
    private LocalDateTime ngayDang;

    @Enumerated(EnumType.STRING)
    @Column(name = "TrangThai", nullable = false, length = 20)
    private TrangThaiBaiDang trangThai = TrangThaiBaiDang.CHO_DUYET;

    @Column(name = "UuTien", nullable = true)
    private LocalDateTime uuTien;

    @OneToMany(mappedBy = "idBaiDang")
    private java.util.List<YeuThich> yeuThiches = new java.util.ArrayList<>();

    @OneToMany(mappedBy = "idBaiDang")
    private java.util.List<AnhSanPham> anhSanPhams = new java.util.ArrayList<>();
}