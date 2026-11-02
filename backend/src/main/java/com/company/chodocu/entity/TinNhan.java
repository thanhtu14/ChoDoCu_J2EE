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
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "TinNhan")
@AttributeOverride(name = "id", column = @Column(name = "idTinNhan"))
public class TinNhan extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idNguoiGui", nullable = false)
    private NguoiDung idNguoiGui;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idHoiThoai", nullable = false)
    private HoiThoai hoiThoai;

    @Column(name = "noiDung", nullable = false, length = 4000)
    private String noiDung;

    @Column(name = "ngayGui", nullable = false)
    private LocalDateTime ngayGui = LocalDateTime.now();

    @Column(name = "daDoc", nullable = false)
    private boolean daDoc;
}
