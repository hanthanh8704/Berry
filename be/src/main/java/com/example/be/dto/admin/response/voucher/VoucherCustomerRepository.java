package com.example.be.dto.admin.response.voucher;


import com.example.be.entities.Voucher;
import com.example.be.entities.VoucherCustomer;
import com.example.be.utils.constant.StatusVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoucherCustomerRepository extends JpaRepository<VoucherCustomer, Integer> {
    //CuaD Đức
    @Query("select khvc from VoucherCustomer khvc join khvc.voucher vc join Bill b on b.voucher.id = vc.id where b.id =:idHD")
    List<VoucherCustomer> findAllByBill(@Param("idHD") Integer id);


    @Modifying
    @Query(value = """
             DELETE FROM  voucher_customer
                   WHERE bill_id = :id
            """, nativeQuery = true)
    int deleteAllByIdBill(@Param("id") Integer idBill);

    @Query(value = """
            select * from  voucher_customer khvc where khvc.customer_id =:idkh and khvc.voucher_id = :id
                        """, nativeQuery = true)
    VoucherCustomer findByIdKhachHangAndIdPhieuGiamGia(@Param("idkh") Integer idAccount, @Param("id") Integer idVoucher);

    @Query("select khvc from  VoucherCustomer khvc where khvc.voucher =:id")
    List<VoucherCustomer> findByVoucherId(@Param("id") Integer id);

    @Query("select khvc from VoucherCustomer khvc where khvc.voucher =:id and khvc.status=:trangThai")
    List<VoucherCustomer> findByIdPhieuGiamGiaAndTrangThai(@Param("id") Integer voucherId, @Param("trangThai") StatusVoucher trangThai);

    List<VoucherCustomer> findByVoucher(Voucher id);

//    List<VoucherCustomer> findByStatus(@Param("trangThai") String trangThai);


}

