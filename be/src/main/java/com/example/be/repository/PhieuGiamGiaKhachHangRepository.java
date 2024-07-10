package com.example.be.repository;

import com.example.be.entity.PhieuGiamGiaKhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuGiamGiaKhachHangRepository extends JpaRepository<PhieuGiamGiaKhachHang,Integer>{
    @Query("select khvc from  PhieuGiamGiaKhachHang khvc where" +
            " khvc.idKhachHang =:idkh and khvc.idPhieuGiamGia =:id")
    PhieuGiamGiaKhachHang findByIdKhachHangAndIdPhieuGiamGia(@Param("idkh") Integer idAccount,@Param("id") Integer idVoucher);
    @Query("select khvc from  PhieuGiamGiaKhachHang khvc where khvc.idPhieuGiamGia =:id")
    List<PhieuGiamGiaKhachHang> findByVoucherId(@Param("id") Integer id);
}
