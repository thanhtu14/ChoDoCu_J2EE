package com.company.chodocu.repository;

import com.company.chodocu.entity.HoiThoai;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface HoiThoaiRepository extends JpaRepository<HoiThoai, Integer> {
    List<HoiThoai> findAllByIdNguoiDung1_IdOrIdNguoiDung2_IdOrderByTinNhanCuoiDesc(Integer user1, Integer user2);
    Optional<HoiThoai> findByIdNguoiDung1_IdAndIdNguoiDung2_Id(Integer user1, Integer user2);
}
