package com.example.be.repository;

import com.example.be.entity.PhieuGiamGiaKhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuGiamGiaKhachHangRepository extends JpaRepository<PhieuGiamGiaKhachHang,Integer>{
    PhieuGiamGiaKhachHang findByAccountIdAndVoucherId(Integer idAccount, Long idVoucher);
    List<PhieuGiamGiaKhachHang> findByVoucherId(Integer id);
}
