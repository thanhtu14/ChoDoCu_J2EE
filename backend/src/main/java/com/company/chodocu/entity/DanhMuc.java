
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

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "DanhMuc")
@AttributeOverride(
    name = "id",
    column = @Column(name = "idDanhMuc")
)
public class DanhMuc extends BaseEntity {

    // Danh mục cha có thể có nhiều danh mục con
    @OneToMany(mappedBy = "danhMucCha", fetch = FetchType.LAZY)
    private List<DanhMuc> danhMucCon = new ArrayList<>();

    // Mỗi danh mục con có tối đa một danh mục cha
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idDanhMucCha")
    private DanhMuc danhMucCha;

    @Column(name = "tenDanhMuc", length = 150)
    private String tenDanhMuc;

    @Column(name = "moTa", length = 1000)
    private String moTa;

    @Column(name = "AnhDanhMuc", length = 1000)
    private String anhDanhMuc;

    @Column(name = "trangThai", nullable = false, length = 30)
    private String trangThai = "HoatDong";

    // Một danh mục có nhiều dòng sản phẩm
    @OneToMany(mappedBy = "danhMuc", fetch = FetchType.LAZY)
    private List<DongSanPham> dongSanPhams = new ArrayList<>();

    // Một danh mục có nhiều sản phẩm
    @OneToMany(mappedBy = "danhMuc", fetch = FetchType.LAZY)
    private List<SanPham> sanPhams = new ArrayList<>();
}
