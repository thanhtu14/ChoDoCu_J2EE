package com.company.chodocu.repository;
import com.company.chodocu.entity.ChucNang;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ChucNangRepository extends JpaRepository<ChucNang,Integer> { List<ChucNang> findAllByOrderByMaChucNangAsc(); }
