package com.company.chodocu.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import com.company.chodocu.enums.TrangThaiMuaDichVu;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Getter @Setter @NoArgsConstructor
@Entity @Table(name = "MuaDichVu")
@AttributeOverride(name = "id", column = @Column(name = "idMuaDichVu"))
public class MuaDichVu extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idDichVu", nullable = false)
    private DichVu dichVu;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idNguoiDung", nullable = false)
    private NguoiDung nguoiDung;
    
    @Column(name = "ngayMua", nullable = false)
    private LocalDateTime ngayMua;
    
    @Column(name = "ngayHetHan", nullable = false)
    private LocalDateTime ngayHetHan;
    
    @Column(name = "trangThai", nullable = false)
    private TrangThaiMuaDichVu trangThai = TrangThaiMuaDichVu.HOAT_DONG;

}
