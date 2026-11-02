package com.company.chodocu.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "YeuThich")
@AttributeOverride(name = "id", column = @Column(name = "idYeuThich"))
public class YeuThich extends BaseEntity {
    // 1 NguoiDung có nhiều YeuThich
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdNguoiDung", nullable = false)
    private NguoiDung idNguoiDung;

    // 1 BaiDang có nhiều YeuThich
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdBaiDang", nullable = false)
    private BaiDang idBaiDang;

    @Column(name = "NgayTao", nullable = false)
    private LocalDateTime ngayTao;

}
