package com.example.be.repositories.admin;

import com.example.be.dto.admin.request.bill.BillSearchRequest;
import com.example.be.dto.admin.response.CountBillStatus;
import com.example.be.dto.admin.response.bill.*;

import com.example.be.entities.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @author hanthanh
 */
@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {
    @Query(value = """
            SELECT
                                        hd.id AS id,
                                        ROW_NUMBER() OVER(ORDER BY hd.updated_at DESC) AS indexs,
                                        hd.code AS code,
                                        pgg.name AS voucher,
                                        nv.name AS employee,
                                        kh.full_name AS nameCustomer,
                                        tt.method AS paymentMethod,
                                        hd.invoice_type AS invoiceType,
                                        hd.confirmation_date AS confirmationDate,
                                        hd.discount_amount AS discountAmount,
                                        hd.recipient_name AS recipientName,
                                        hd.total_money AS totalMoney,
                                        hd.shipping_fee AS shippingFee,
                                        hd.recipient_email AS recipientEmail,
                                        hd.recipient_phone AS recipientPhone,
                                        hd.invoice_status AS invoiceStatus,
                                        hd.delivery_status AS deliveryStatus,
                                        hd.delivery_date AS deliveryDate, 
                                        hd.received_date AS receivedDate,
                                        tt.transaction_no AS transactionNo,
                                        hd.shipping_time AS shippingTime,
                                        hd.address AS address,
                                        hd.note AS note,
                                        hd.created_at AS createdAt,
                                        hd.updated_at AS updatedAt,
                                        hd.created_by AS createdBy,
                                        hd.updated_by AS updatedBy
                                    FROM bill hd
                                    LEFT JOIN employee nv ON hd.employee_id = nv.id
                                    LEFT JOIN customer kh ON hd.customer_id = kh.id
                                    LEFT JOIN payment tt ON hd.id = tt.bill_id
                                    LEFT JOIN voucher pgg ON hd.voucher_id = pgg.id
                        WHERE (:#{#req.code} IS NULL OR hd.code LIKE %:#{#req.code}% OR hd.recipient_phone LIKE %:#{#req.code}%)
                                      AND (:#{#req.invoiceStatus} IS NULL OR hd.invoice_status = :#{#req.invoiceStatus})
                                      AND (:#{#req.fromDate} IS NULL OR :#{#req.toDate} IS NULL OR (hd.updated_at BETWEEN :#{#req.fromDate} AND :#{#req.toDate}))
                                    """, nativeQuery = true)
    Page<BillResponse> getAllHoaDon(@Param("req") BillSearchRequest req, Pageable pageable);

    // Hàm này dùng để thống kê hóa đơn theo trạng thái
    @Query(value = """
            SELECT
                          CASE
                              WHEN invoice_status = 0 THEN 'Tạo hóa đơn'
                              WHEN invoice_status = 1 THEN 'Chờ xác nhận'
                              WHEN invoice_status = 2 THEN 'Đang vận chuyển'
                              WHEN invoice_status = 3 THEN 'Chờ giao hàng'
                              WHEN invoice_status = 4 THEN 'Đang giao hàng'
                              WHEN invoice_status = 5 THEN 'Đã thanh toán'
                              WHEN invoice_status = 6 THEN 'Hoàn thành'
            			   WHEN invoice_status = 7 THEN 'Đã hủy'
            			   WHEN invoice_status = 10 THEN 'Trả hàng'
                              ELSE 'Chờ thanh toán'
                          END AS statusName,
                          invoice_status as invoiceStatus,
                          COUNT(*) AS totalCount
                       FROM bill b
                       WHERE b.invoice_status NOT IN ('Tạo đơn hàng')
                       GROUP BY invoice_status
                       ORDER BY invoice_status
                              """, nativeQuery = true)
    List<CountBillStatus> getHoaDonByTrangThai();

    // Hàm này dùng để lấy danh sách các hóa đơn của một tài khoản nhân viên dựa trên idNhanVien và trạng thái
//    Page<Bill> findByEmployeeAndInvoiceStatus(Integer employeeId, String invoiceStatus, Pageable pageable);

    // Kiểm tra xem hóa đơn đó có tồn tại hay không
    Boolean existsByCode(String code);

    Optional<Bill> findByCode(String code);
    @Query(value = """
select * from bill
""", nativeQuery = true)
    Bill findByCode1(String code);

    @Query(value = """
            SELECT *, ROW_NUMBER() OVER(ORDER BY b.created_at DESC) AS indexs 
            FROM bill b WHERE (:#{#req.code} IS NULL OR b.code LIKE %:#{#req.code}%)
            AND (:#{#req.idEmployee} IS NULL OR b.employee_id = :#{#req.idEmployee})
            AND (:#{#req.invoiceStatus} IS NULL OR b.invoice_status = :#{#req.invoiceStatus}) 
            AND b.invoice_status = 0 ORDER BY b.created_at DESC
            """, nativeQuery = true)
    List<Bill> getNewBill(@Param("req") BillSearchRequest request);
}
