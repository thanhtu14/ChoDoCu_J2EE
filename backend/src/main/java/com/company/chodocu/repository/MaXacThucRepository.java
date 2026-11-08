package com.company.chodocu.repository;
import com.company.chodocu.entity.MaXacThuc;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface MaXacThucRepository extends JpaRepository<MaXacThuc,Long> {
    Optional<MaXacThuc> findFirstByIdNguoiDungAndLoaiOrderByIdDesc(Integer idNguoiDung,String loai);
    void deleteByIdNguoiDungAndLoai(Integer idNguoiDung,String loai);
}
