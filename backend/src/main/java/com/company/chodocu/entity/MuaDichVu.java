package com.company.chodocu.entity;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import com.company.chodocu.enums.TrangThaiMuaDichVu;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "DichVu")
@AttributeOverride(name = "id", column = @Column(name = "idDichVu"))
public class MuaDichVu {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idDichVu", nullable = false)
    private int idDichVu;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idNguoiDung", nullable = false)
    private int idNguoiDung;
    
    @Column(name = "ngayMua", nullable = false)
    private LocalDateTime ngayMua;
    
    @Column(name = "ngayHetHan", nullable = false)
    private LocalDateTime ngayHetHan;
    
    @Column(name = "trangThai", nullable = false)
    private TrangThaiMuaDichVu trangThai = TrangThaiMuaDichVu.HOAT_DONG;
}
