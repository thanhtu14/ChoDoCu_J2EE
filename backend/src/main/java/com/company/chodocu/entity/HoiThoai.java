package com.company.chodocu.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "HoiThoai")
@AttributeOverride(name = "id", column = @Column(name = "idHoiThoai"))
public class HoiThoai extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idNguoiDung1", nullable = false)
    private NguoiDung idNguoiDung1;
    
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idNguoiDung2", nullable = false)
    private NguoiDung idNguoiDung2;

    @Column(name = "ngayTao", nullable = false)
    private LocalDateTime ngayTao = LocalDateTime.now();

    // 1 HoiThoai có nhiều TinNhan
    @OneToMany(mappedBy = "hoiThoai")
    private List<TinNhan> tinNhans = new ArrayList<>();
}
