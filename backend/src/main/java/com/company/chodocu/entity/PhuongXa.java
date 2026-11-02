package com.company.chodocu.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "PhuongXa")
@AttributeOverride(name = "id", column = @Column(name = "idPhuongXa"))
public class PhuongXa extends BaseEntity {

    // Thay cho cặp IdThanhPho + ThanhPho trong C#
    // "= null!" trong C# tương ứng với optional = false (bắt buộc)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "IdThanhPho", nullable = false)
    private ThanhPho thanhPho;

    @Column(name = "TenPhuongXa", nullable = false, length = 150)
    private String tenPhuongXa = "";
}