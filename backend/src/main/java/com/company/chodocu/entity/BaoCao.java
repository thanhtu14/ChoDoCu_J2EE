package com.company.chodocu.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "baoCao")
@AttributeOverride(name = "id", column = @Column(name = "idBaoCao"))
public class BaoCao extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdNguoiDung", nullable = false)
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdBaiDang", nullable = false)
    private BaiDang baiDang;

    @Column(name = "NoiDung", length = 1000)
    private String noiDung;

    @Column(name = "NgayTao", nullable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Column(name = "TrangThai", nullable = false, length = 50)
    private String trangThai = "ChoXuLy";
}
