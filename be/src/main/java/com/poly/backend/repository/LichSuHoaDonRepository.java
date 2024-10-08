package com.poly.backend.repository;

import com.poly.backend.entity.English.Bill_history;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LichSuHoaDonRepository extends JpaRepository<Bill_history,Integer> {

}
