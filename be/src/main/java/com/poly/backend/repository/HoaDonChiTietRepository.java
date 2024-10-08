package com.poly.backend.repository;

import com.poly.backend.entity.English.Bill;
import com.poly.backend.entity.English.Bill_detail;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoaDonChiTietRepository extends JpaRepository<Bill_detail,Integer> {
    //Lam cho tra hang
//    @Query("SELECT hdc FROM Bill_detail hdc " +
//            "JOIN hdc.bill hd " +
//            "JOIN hdc.productDetail spct " +
//            "WHERE hd.id = :bill_id AND spct.id = :product_detail_id")
//    Optional<Bill_detail> findByHoaDonIdAndChiTietSanPhamId(@Param("idHoaDon") Integer bill_id,
//                                                              @Param("idSpct") Integer product_detail_id);
    @Query("SELECT hdc FROM Bill_detail hdc JOIN hdc.bill hd JOIN hdc.productDetail spct WHERE hd.id = :bill_id AND spct.id = :product_detail_id")
    Optional<Bill_detail> findByHoaDonIdAndChiTietSanPhamId(@Param("bill_id") Integer idHoaDon, @Param("product_detail_id") Integer idChiTietSanPham);

    List<Bill_detail> findByBillAndStatus(Bill bill, Integer status);
    List<Bill_detail> findByBill(Bill bill);
}
