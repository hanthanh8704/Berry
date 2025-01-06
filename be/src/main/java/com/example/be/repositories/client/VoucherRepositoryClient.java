package com.example.be.repositories.client;

import com.example.be.entities.Voucher;
import com.example.be.utils.constant.VoucherConstant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VoucherRepositoryClient extends JpaRepository<Voucher, Integer> {
    @Query("SELECT sp FROM Voucher sp WHERE sp.type = :type AND :ngayHT BETWEEN sp.startDate AND sp.endDate AND sp.deleted = false")
    List<Voucher> findAllByPublic(@Param("ngayHT") LocalDateTime ngayHienTai, @Param("type") VoucherConstant type);

    @Query("SELECT sp FROM Voucher sp JOIN VoucherCustomer kh ON kh.voucher.id = sp.id " +
            "WHERE kh.customer.id = :idKH AND sp.type = :type AND " +
            ":ngayHT BETWEEN sp.startDate AND sp.endDate AND sp.deleted = false")
    List<Voucher> findAllByCaNhan(@Param("idKH") Integer idKH, @Param("type") VoucherConstant type, @Param("ngayHT") LocalDateTime ngayHienTai);

    @Query("SELECT sp FROM Voucher sp JOIN VoucherCustomer kh ON kh.voucher.id = sp.id " +
            "WHERE kh.customer.id = :idKH AND sp.type = :type AND " +
            ":ngayHT BETWEEN sp.startDate AND sp.endDate AND sp.deleted = false AND " +
            ":price != 0 AND " + // Không cho phép áp dụng voucher nếu price = 0
            "(:price BETWEEN sp.minOrderValue AND sp.maxDiscountValue OR sp.maxDiscountValue = 0)")
    List<Voucher> findAllByCaNhanPhuHop(@Param("idKH") Integer idKH, @Param("type") VoucherConstant type,
                                        @Param("ngayHT") LocalDateTime ngayHienTai, @Param("price") BigDecimal price);
    @Query("SELECT sp FROM Voucher sp WHERE sp.type = :type AND " +
            ":ngayHT BETWEEN sp.startDate AND sp.endDate AND sp.deleted = false AND " +
            ":price != 0 AND " + // Không cho phép áp dụng voucher nếu price = 0
            "(:price BETWEEN sp.minOrderValue AND sp.maxDiscountValue OR sp.maxDiscountValue = 0)")
    List<Voucher> findAllByCongKhaiPhuHop(@Param("ngayHT") LocalDateTime ngayHienTai,
                                          @Param("type") VoucherConstant type, @Param("price") BigDecimal price);


}

