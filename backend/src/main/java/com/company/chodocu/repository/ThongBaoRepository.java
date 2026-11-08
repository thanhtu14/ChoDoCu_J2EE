package com.company.chodocu.repository;

import com.company.chodocu.entity.ThongBao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ThongBaoRepository extends JpaRepository<ThongBao, Integer> {
    Page<ThongBao> findAllByIdNguoiDung_IdOrderByNgayTaoDesc(Integer userId, Pageable pageable);
    long countByIdNguoiDung_IdAndTrangThai(Integer userId, String status);
    List<ThongBao> findAllByIdNguoiDung_IdAndTrangThai(Integer userId, String status);
}
