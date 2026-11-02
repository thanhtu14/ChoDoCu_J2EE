package com.company.chodocu.entity;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "ThuocTinh")
@AttributeOverride(name = "id", column = @Column(name = "idThuocTinh"))
public class ThuocTinh extends BaseEntity {
    @Column(name = "tenThuocTinh", nullable = false, length = 150)
    private String tenThuocTinh;
    @Column(name = "moTa", length = 500)
    private String moTa;
    @OneToMany(mappedBy = "thuocTinh")
    private List<SanPhamThuocTinh> sanPhamThuocTinhs = new ArrayList<>();
}
