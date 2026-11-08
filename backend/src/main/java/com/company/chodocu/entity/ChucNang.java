package com.company.chodocu.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "ChucNang")
public class ChucNang {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "idChucNang")
    private Integer id;
    @Column(name = "MaChucNang", nullable = false, unique = true, length = 100)
    private String maChucNang;
    @Column(name = "TenChucNang", nullable = false, length = 150)
    private String tenChucNang;
}
