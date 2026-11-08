package com.company.chodocu.repository;

import com.company.chodocu.entity.PhuongXa;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PhuongXaRepository extends JpaRepository<PhuongXa, Integer> {
    List<PhuongXa> findAllByThanhPho_IdOrderByTenPhuongXaAsc(Integer thanhPhoId);
}
