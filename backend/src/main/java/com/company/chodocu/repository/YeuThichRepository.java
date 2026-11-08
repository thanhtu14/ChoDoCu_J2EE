package com.company.chodocu.repository;

import com.company.chodocu.entity.YeuThich;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface YeuThichRepository extends JpaRepository<YeuThich, Integer> {
    Optional<YeuThich> findByIdNguoiDung_IdAndIdBaiDang_Id(Integer userId, Integer postId);
    Page<YeuThich> findAllByIdNguoiDung_IdOrderByNgayTaoDesc(Integer userId, Pageable pageable);
}
