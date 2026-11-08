package com.company.chodocu.repository;

import com.company.chodocu.entity.DichVu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DichVuRepository extends JpaRepository<DichVu, Integer> {
    List<DichVu> findAllByTrangThaiOrderByIdAsc(String trangThai);
}
