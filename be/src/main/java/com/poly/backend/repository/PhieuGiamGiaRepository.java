package com.poly.backend.repository;

import com.poly.backend.entity.English.Voucher;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PhieuGiamGiaRepository extends JpaRepository<Voucher,Integer> {
    @Query("select sp from Voucher sp where sp.type = :loai and :ngayHT between sp.startDate and sp.endDate")
    List<Voucher> findAllByPublic(@Param("loai") String loai, @Param("ngayHT") LocalDateTime ngayHienTai);
    @Query("select sp from Voucher sp join Voucher_customer kh on kh.voucher.id = sp.id " +
            "where kh.customer.id =:idKH" +
            " and  sp.type = :loai and" +
            " :ngayHT between sp.startDate and sp.endDate")
    List<Voucher> findAllByCaNhan(@Param("idKH") Integer idKH , @Param("loai") String loai, @Param("ngayHT") LocalDateTime ngayHienTai);

}
