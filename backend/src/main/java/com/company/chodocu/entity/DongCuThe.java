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
@Entity @Table(name = "DongCuThe")
@AttributeOverride(name = "id", column = @Column(name = "idDongCuThe"))
public class DongCuThe extends BaseEntity {

    @Column(name = "tenDongCuThe", length = 150)
    private String tenDongCuThe;

    @Column(name = "trangThai", nullable = false, length = 30)
    private String trangThai = "HoatDong";

    // nhiều dòng cụ thể thuộc về một dòng sản phẩm
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idDongSanPham", nullable = false)
    private Integer idDongSanPham;

    @OneToMany(mappedBy = "dongCuThe")
    private List<SanPham> sanPhams = new ArrayList<>();
}
