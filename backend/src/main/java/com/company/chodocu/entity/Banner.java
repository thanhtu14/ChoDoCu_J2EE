package com.company.chodocu.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "Banner")
@AttributeOverride(name = "id", column = @Column(name = "idBanner"))
public class Banner extends BaseEntity {
    @Column(name = "HinhAnh", nullable = false)
    private String hinhAnh;

    @Column(name = "Vitri")
    private String viTri;

    @Column(name = "TrangThai" , nullable = false)
    private String trangThai;

    @Column(name = "NgaySua")
    private LocalDateTime ngaySua;
}