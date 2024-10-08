package com.poly.backend.repository;

import com.poly.backend.entity.English.Bill;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoaDonRepository extends JpaRepository<Bill,Integer> {
    Boolean existsByCode(String code);

    @Query("SELECT hdc FROM Bill hdc " +
            "WHERE hdc.code like %:code%")
    Bill findByCode(@Param("code") String code);
    @Query("SELECT hdc FROM Bill hdc WHERE hdc.code like %:ma% and hdc.recipientPhone like %:sdt%")
    Bill findByMaAndPhone(@Param("ma") String ma, @Param("sdt") String sdt);
    @Query("SELECT hdc FROM Bill hdc " +
            "WHERE hdc.customer.id = :idKH")
    List<Bill> getAllDonMuaByIdKH(@Param("idKH") Integer idKH);
}
