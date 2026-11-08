package com.company.chodocu.repository;

import com.company.chodocu.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Integer> {
    List<Banner> findAllByViTriOrderByIdDesc(String viTri);
    List<Banner> findAllByOrderByIdDesc();
}
