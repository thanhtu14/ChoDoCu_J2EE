package com.company.chodocu.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.Instant;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "MaXacThuc")
public class MaXacThuc {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "idMaXacThuc")
    private Long id;
    @Column(name = "idNguoiDung", nullable = false)
    private Integer idNguoiDung;
    @Column(name = "Loai", nullable = false, length = 30)
    private String loai;
    @Column(name = "MaHash", nullable = false, length = 64)
    private String maHash;
    @Column(name = "DuLieu", length = 254)
    private String duLieu;
    @Column(name = "SoLanSai", nullable = false)
    private int soLanSai;
    @Column(name = "NgayTao", nullable = false)
    private Instant ngayTao;
    @Column(name = "NgayHetHan", nullable = false)
    private Instant ngayHetHan;
}
