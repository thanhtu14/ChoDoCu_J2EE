package com.company.chodocu.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "ThongBao")
@AttributeOverride(name = "id", column = @Column(name = "idThongBao"))
public class ThongBao extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdNguoiDung", nullable = false)
    private NguoiDung idNguoiDung;

    @Column(name = "TieuDe", nullable = false, length = 150)
    private String tieuDe;

    @Column(name = "NoiDung", nullable = false, length = 4000)
    private String noiDung;

    @Column(name = "NgayTao", nullable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Column(name = "TrangThai", nullable = false)
    private String trangThai;

}
