package com.poly.backend.repository;

import com.poly.backend.entity.English.Bill;
import com.poly.backend.entity.English.Bill_history;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichSuHoaDonRepository extends JpaRepository<Bill_history,Integer> {
    @Query("SELECT hdc FROM Bill_history hdc join hdc.bill b where b.id = :idHD")
    List<Bill_history> findAllByIdHD(@Param("idHD") Integer idHD);
}
