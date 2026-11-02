package com.company.chodocu.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "SanPhamThuocTinh")
@AttributeOverride(name = "id", column = @Column(name = "idSanPhamThuocTinh"))
public class SanPhamThuocTinh extends BaseEntity {
    @Column(name = "idSanPham", insertable = false, updatable = false)
    private Integer idSanPham;
    @Column(name = "idThuocTinh", insertable = false, updatable = false)
    private Integer idThuocTinh;
    @Column(name = "giaTri", length = 500)
    private String giaTri;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "idSanPham", nullable = false)
    private SanPham sanPham;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "idThuocTinh", nullable = false)
    private ThuocTinh thuocTinh;
}
