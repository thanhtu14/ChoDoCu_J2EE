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
import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.OneToOne;
import com.company.chodocu.enums.TrangThaiThanhToan;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "ThanhToan")
@AttributeOverride(name = "id", column = @Column(name = "idThanhToan"))
public class ThanhToan extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdMuaDichVu", nullable = false)
    private MuaDichVu idMuaDichVu;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdPhuongThucThanhToan", nullable = false)
    private PhuongThucThanhToan idPhuongThucThanhToan;

    @Column(name = "MaGiaoDichNgoai")
    private String maGiaoDichNgoai;

    @Column(name = "MaPhanHoiCongTT")
    private String maGiaoDichCongTT;

    @Column(name = "TongTien", nullable = false)
    private BigDecimal tongTien;

    @Column(name = "TrangThaiThanhToan", nullable = false)
    private TrangThaiThanhToan trangThaiThanhToan = TrangThaiThanhToan.CHO_XU_LY;

    @Column(name = "NgayTao", nullable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();

    @Column(name = "NgayThanhToan")
    private LocalDateTime ngayThanhToan;

}
