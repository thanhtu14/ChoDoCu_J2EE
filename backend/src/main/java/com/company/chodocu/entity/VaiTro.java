package com.company.chodocu.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "VaiTro")
public class VaiTro {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) @Column(name = "idVaiTro")
    private Integer id;
    @Column(name = "MaVaiTro", nullable = false, unique = true, length = 50)
    private String maVaiTro;
    @Column(name = "TenVaiTro", nullable = false, length = 100)
    private String tenVaiTro;
    @ManyToMany
    @JoinTable(name = "VaiTro_ChucNang", joinColumns = @JoinColumn(name = "idVaiTro"), inverseJoinColumns = @JoinColumn(name = "idChucNang"))
    private Set<ChucNang> chucNangs = new LinkedHashSet<>();
}
