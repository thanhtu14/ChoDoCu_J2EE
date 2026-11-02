package com.company.chodocu.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "ThanhPho")
@AttributeOverride(name = "id", column = @Column(name = "idThanhPho"))
public class ThanhPho extends BaseEntity {

    @Column(name = "TenThanhPho", nullable = false, length = 150)
    private String tenThanhPho = "";

    // Phía ngược lại của PhuongXa.thanhPho (không sở hữu khóa ngoại)
    @OneToMany(mappedBy = "thanhPho")
    private List<PhuongXa> phuongXa = new ArrayList<>();
}