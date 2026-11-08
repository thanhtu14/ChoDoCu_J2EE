package com.company.chodocu.repository;

import com.company.chodocu.entity.DanhMuc;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DanhMucRepository extends JpaRepository<DanhMuc, Integer> {
    List<DanhMuc> findAllByOrderByTenDanhMucAsc();
    boolean existsByDanhMucCha_Id(Integer parentId);
}
