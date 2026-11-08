package com.company.chodocu.repository;

import com.company.chodocu.entity.BaiDang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BaiDangRepository extends JpaRepository<BaiDang, Integer>, JpaSpecificationExecutor<BaiDang> {
    Page<BaiDang> findAllByNguoiDang_IdOrderByNgayDangDesc(Integer userId, Pageable pageable);
}
