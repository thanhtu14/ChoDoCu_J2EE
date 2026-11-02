package com.company.chodocu.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "AnhSanPham")
@AttributeOverride(name = "id", column = @Column(name = "idAnhSanPham"))
public class AnhSanPham {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdBaiDang", nullable = false)
    private BaiDang idBaiDang;

    @Column(name = "duongDan", nullable = false)
    private String duongDan;

}
