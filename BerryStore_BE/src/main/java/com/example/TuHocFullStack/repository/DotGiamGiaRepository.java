package com.example.TuHocFullStack.repository;

import com.example.TuHocFullStack.entity.DotGiamGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DotGiamGiaRepository extends JpaRepository<DotGiamGia, Integer> {
    @Query("SELECT d FROM DotGiamGia d WHERE (d.ngayBatDau BETWEEN :startDate AND :endDate OR d.ngayKetThuc BETWEEN :startDate AND :endDate)")
    List<DotGiamGia> findAllByDateChange(@Param("startDate") LocalDateTime startDate,
                                         @Param("endDate") LocalDateTime endDate);

    @Query("SELECT d FROM DotGiamGia d WHERE " +
            "d.ten LIKE %:keyword% " +
            "OR d.ma LIKE %:keyword% " +
            "OR CAST(d.giaTriGiam AS string) LIKE %:keyword% " +
            "OR d.trangThai LIKE %:keyword%")
    List<DotGiamGia> findByMaTenTrangThaiLike(@Param("keyword") String keyword);

    @Query("SELECT d FROM DotGiamGia d ORDER BY d.ngayTao DESC")
    List<DotGiamGia> findAllOrderedByNgayTaoDesc();
}
