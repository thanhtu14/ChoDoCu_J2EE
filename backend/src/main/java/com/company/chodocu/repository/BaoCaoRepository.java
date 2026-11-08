package com.company.chodocu.repository;

import com.company.chodocu.entity.BaoCao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BaoCaoRepository extends JpaRepository<BaoCao, Integer> {
    Page<BaoCao> findAllByTrangThaiOrderByNgayTaoDesc(String trangThai, Pageable pageable);
    Page<BaoCao> findAllByOrderByNgayTaoDesc(Pageable pageable);
}
