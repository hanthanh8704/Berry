package com.example.be.repositories.client;

import com.example.be.entities.Bill;
import com.example.be.entities.BillDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillDetailRepositoryClient extends JpaRepository<BillDetail,Integer> {
    @Query("SELECT hdc FROM BillDetail hdc JOIN hdc.bill hd JOIN hdc.productDetail spct WHERE hd.id = :bill_id AND spct.id = :product_detail_id")
    Optional<BillDetail> findByHoaDonIdAndChiTietSanPhamId(@Param("bill_id") Integer idHoaDon, @Param("product_detail_id") Integer idChiTietSanPham);

    List<BillDetail> findByBillAndStatus(Bill bill, Integer status);
    List<BillDetail> findByBill(Bill bill);
}
