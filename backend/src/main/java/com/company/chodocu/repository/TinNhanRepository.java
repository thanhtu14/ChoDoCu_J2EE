package com.company.chodocu.repository;

import com.company.chodocu.entity.TinNhan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TinNhanRepository extends JpaRepository<TinNhan, Integer> {
    Page<TinNhan> findAllByHoiThoai_IdOrderByNgayGuiDesc(Integer conversationId, Pageable pageable);
    @Modifying
    @Query("update TinNhan m set m.daDoc = true where m.hoiThoai.id = :conversationId and m.idNguoiGui.id <> :userId")
    int markReadByOtherParticipant(@Param("conversationId") Integer conversationId, @Param("userId") Integer userId);
}
