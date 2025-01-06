package com.example.be.repositories.admin;

import com.example.be.dto.admin.request.bill.BillSearchRequest;
import com.example.be.dto.admin.request.bill.StatusRequest;
import com.example.be.dto.admin.request.statistical.*;
import com.example.be.dto.admin.response.CountBillStatus;
import com.example.be.dto.admin.response.bill.*;

import com.example.be.dto.admin.response.statistical.*;
import com.example.be.entities.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * @author hanthanh
 */
@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {
    @Query(value = """
            SELECT DISTINCT
                hd.id AS id,
                hd.code AS code,
                pgg.name AS voucher,
                nv.name AS employee,
                kh.full_name AS nameCustomer,
                hd.payment_status AS paymentMethod,
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
            LEFT JOIN voucher pgg ON hd.voucher_id = pgg.id
            LEFT JOIN bill_detail bd ON bd.bill_id = hd.id
            WHERE (:#{#req.code} IS NULL OR hd.code LIKE CONCAT('%', :#{#req.code}, '%') OR hd.recipient_phone LIKE CONCAT('%', :#{#req.code}, '%'))
              AND (:#{#req.invoiceStatus} IS NULL OR hd.invoice_status = :#{#req.invoiceStatus})
              AND (:#{#req.fromDate} IS NULL OR :#{#req.toDate} IS NULL OR (hd.updated_at BETWEEN :#{#req.fromDate} AND :#{#req.toDate}))
            ORDER BY hd.created_at DESC;
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
    @Query(value = """
            select * from bill where code = :code
            """, nativeQuery = true)
    Optional<Bill> findByCode1(String code);


    Bill findByCode(String code);


    @Query(value = """
            SELECT *, ROW_NUMBER() OVER(ORDER BY b.created_at DESC) AS indexs 
            FROM bill b WHERE (:#{#req.code} IS NULL OR b.code LIKE %:#{#req.code}%)
            AND (:#{#req.idEmployee} IS NULL OR b.employee_id = :#{#req.idEmployee})
            AND (:#{#req.invoiceStatus} IS NULL OR b.invoice_status = :#{#req.invoiceStatus}) 
            AND b.invoice_status = 0 ORDER BY b.created_at DESC
            """, nativeQuery = true)
    List<Bill> getNewBill(@Param("req") BillSearchRequest request);


    // Thống kê


    // Thống kê hóa đơn hàng năm:
    // Tính t��ng số hóa đơn (totalBillYear), t��ng tiền hóa đơn (totalBillAmountYear) và t��ng số lượng sản phẩm bán ra (totalProduct)
    // trong năm với trạng thái hóa đơn là "THANH_CONG" (thành công) hoặc "TRA_HANG" (trả hàng).
    // Thống kê


    // Thống kê hóa đơn hàng năm:
    // Tính t��ng số hóa đơn (totalBillYear), t��ng tiền hóa đơn (totalBillAmountYear) và t��ng số lượng sản phẩm bán ra (totalProduct)
    // trong năm với trạng thái hóa đơn là "THANH_CONG" (thành công) hoặc "TRA_HANG" (trả hàng).
    @Query(value = """
            SELECT
              COUNT(DISTINCT b.id) AS totalBillYear,
              SUM(b.total_money) AS totalBillAmountYear,
              COALESCE(SUM(bd.quantity), 0) AS totalProductYear
            FROM
              bill b
            LEFT JOIN (
              SELECT bill_id, SUM(quantity) AS quantity
              FROM bill_detail
              GROUP BY bill_id
            ) bd ON b.id = bd.bill_id
            WHERE
              EXTRACT(YEAR FROM b.received_date) = :year            
            """, nativeQuery = true)
    List<StatisticaYearResponse> getAllStatisticalYear(@Param("year") Integer year);


    // Thống kê hóa đơn hàng tháng:
// Tính tổng số hóa đơn (totalBill), tổng tiền hóa đơn (totalBillAmount) và tổng số lượng sản phẩm bán ra (totalProduct)
// trong tháng với trạng thái hóa đơn là "THANH_CONG" (thành công) hoặc "TRA_HANG" (trả hàng).
    @Query(value = """
              SELECT
                COUNT(DISTINCT b.id) AS totalBillMonth,
                SUM(b.total_money) AS totalBillAmountMonth,
                COALESCE(SUM(bd.quantity), 0) AS totalProductMonth
              FROM
                bill b
              LEFT JOIN (
                SELECT bill_id, SUM(quantity) AS quantity
                FROM bill_detail
                GROUP BY bill_id
              ) bd ON b.id = bd.bill_id
              WHERE DATE(b.received_date) >= :startOfMonth AND DATE(b.received_date) <= :endOfMonth
            """, nativeQuery = true)
    List<StatisticalMonthlyResponse> getAllStatisticalMonthly(@Param("startOfMonth") Date startOfMonth,
                                                              @Param("endOfMonth") Date endOfMonth);


    // Thống kê hóa đơn hàng tuần:
// Tính tổng số hóa đơn (totalBillWeek), tính tổng số sản phẩm và tổng tiền hóa đơn (totalBillAmountWeek) trong ngày,
// với trạng thái hóa đơn là "THANH_CONG" (thành công) hoặc "TRA_HANG" (trả hàng).
    @Query(value = """
              SELECT
                COUNT(DISTINCT b.id) AS totalBillWeek,
                COALESCE(SUM(bd.quantity), 0) AS totalProductWeek,
                SUM(b.total_money) AS totalBillAmountWeek
              FROM
                bill b
              LEFT JOIN (
                SELECT bill_id, SUM(quantity) AS quantity
                FROM bill_detail
                GROUP BY bill_id
              ) bd ON b.id = bd.bill_id
              WHERE DATE(b.received_date) >= :startOfWeek AND DATE(b.received_date) <= :endOfWeek
            """, nativeQuery = true)
    List<StatisticalWeekResponse> getAllStatisticalWeek(@Param("startOfWeek") Date startOfWeek,
                                                        @Param("endOfWeek") Date endOfWeek);


    // Thống kê hóa đơn hàng ngày:
// Tính tổng số hóa đơn (totalBillToday) và tổng tiền hóa đơn (totalBillAmountToday) trong ngày,
// với trạng thái hóa đơn là "THANH_CONG" (thành công) hoặc "TRA_HANG" (trả hàng).
    @Query(value = """
              SELECT
                  COUNT(DISTINCT b.id) AS totalBillToday,
                  SUM(b.total_money) AS totalBillAmountToday,
                  COALESCE(SUM(bd.quantity), 0) AS totalProductDay
              FROM bill b 
              LEFT JOIN (
                     SELECT bill_id, SUM(quantity) AS quantity
                     FROM bill_detail
                     GROUP BY bill_id
                   ) bd ON b.id = bd.bill_id
              WHERE DATE(b.received_date) >= :startOfDay AND DATE(b.received_date) <= :endOfDay                   
            """, nativeQuery = true)
    List<StatisticalDayResponse> getAllStatisticalDay(@Param("startOfDay") Date startOfDay,
                                                      @Param("endOfDay") Date endOfDay);

    // Thống kê số lượng hóa đơn theo trạng thái:
// Đếm số lượng hóa đơn theo từng trạng thái (totalStatusBill) trong một khoảng thời gian nhất định
// dựa trên dữ liệu từ yêu cầu `req`.
    // WHERE DATE(b.received_date) >= :#{#req.startDate} AND DATE(b.received_date) <= :#{#req.endDate}
    @Query(value = """
            SELECT
                invoice_status AS statusBill,
                COUNT(*) AS totalStatusBill
            FROM
                bill
                     
            GROUP BY
                statusBill;
                            """, nativeQuery = true)
    List<StatisticalStatusBillResponse> getAllStatisticalStatusBill(@Param("req") FindBillDateRequest req);

    // Thống kê sản phẩm bán chạy:
// Lấy thông tin các sản phẩm bán chạy nhất (top 9 sản phẩm) gồm ảnh, tên, giá, số lượng bán ra (sold),
// và tổng doanh thu từ sản phẩm (sales) trong một khoảng thời gian nhất định với trạng thái hóa đơn là "THANH_CONG" hoặc "TRA_HANG".
    // WHERE DATE(b.created_at) >= :#{#req.startDate} AND DATE(b.created_at) <= :#{#req.endDate}
    @Query(value = """
                SELECT
                    ROW_NUMBER() OVER(ORDER BY total_sales DESC) AS indexs,
                    i.url AS image,
                    p.name AS name,
                     p.id AS idProduct,
                    pd.id AS idProductDetail,
                    pd.price AS price,
                    total_sold AS sold,
                    total_sales AS sales
                FROM (
                    SELECT
                        bd.product_detail_id,
                        SUM(bd.quantity) AS total_sold,
                        SUM(bd.price) AS total_sales
                    FROM bill_detail bd
                    JOIN bill b ON bd.bill_id = b.id
                    
                    GROUP BY bd.product_detail_id
                ) AS sales_data
                JOIN product_detail pd ON sales_data.product_detail_id = pd.id
                JOIN product p ON pd.product_id = p.id
                LEFT JOIN (
                    SELECT product_detail_id, MAX(id) AS max_image_id
                    FROM image
                    GROUP BY product_detail_id
                ) max_images ON pd.id = max_images.product_detail_id
                LEFT JOIN image i ON max_images.max_image_id = i.id
                ORDER BY total_sold DESC
                LIMIT 9
            """, nativeQuery = true)
    List<StatisticalBestSellingProductResponse> getAllStatisticalBestSellingProduct(@Param("req") FindBillDateRequest req);




    @Query(value = """
        SELECT
            ROW_NUMBER() OVER(ORDER BY total_sales DESC) AS indexs,
            i.url AS image,
            p.name AS name,
            p.id AS idProduct,
            pd.id AS idProductDetail,
            pd.price AS price,
            total_sold AS sold,
            total_sales AS sales
        FROM (
            SELECT
                bd.product_detail_id,
                SUM(bd.quantity) AS total_sold,
                SUM(bd.price) AS total_sales
            FROM bill_detail bd
            JOIN bill b ON bd.bill_id = b.id
            GROUP BY bd.product_detail_id
        ) AS sales_data
        JOIN product_detail pd ON sales_data.product_detail_id = pd.id
        JOIN product p ON pd.product_id = p.id
        LEFT JOIN (
            SELECT product_detail_id, MAX(id) AS max_image_id
            FROM image
            GROUP BY product_detail_id
        ) max_images ON pd.id = max_images.product_detail_id
        LEFT JOIN image i ON max_images.max_image_id = i.id
        WHERE (:brandId IS NULL OR pd.brand_id = :brandId)
          AND (:colorId IS NULL OR pd.color_id = :colorId)
          AND (:sizeId IS NULL OR pd.size_id = :sizeId)
          AND (:priceRange IS NULL OR (
              :priceRange = 'under300' AND pd.price < 300000) OR
              (:priceRange = '300to700' AND pd.price BETWEEN 300000 AND 700000) OR
              (:priceRange = 'above700' AND pd.price > 700000))
        ORDER BY total_sold DESC
        LIMIT 9
        """, nativeQuery = true)
    List<StatisticalBestSellingProductResponse> getAllStatisticalBestSellingProductFindFiltered(
            @Param("brandId") Integer brandId,
            @Param("colorId") Integer colorId,
            @Param("sizeId") Integer sizeId,
            @Param("priceRange") String priceRange
    );


    @Query(value = """
                SELECT
                    ROW_NUMBER() OVER(ORDER BY total_sales DESC) AS indexs,
                    i.url AS image,
                    p.name AS name,
                    p.id AS idProduct,
                    pd.price AS price,
                    total_sold AS sold,
                    total_sales AS sales       
                FROM (
                    SELECT
                        bd.product_detail_id,
                        SUM(bd.quantity) AS total_sold,
                        SUM(bd.price) AS total_sales
                    FROM bill_detail bd
                    JOIN bill b ON bd.bill_id = b.id
                    
                    GROUP BY bd.product_detail_id
                ) AS sales_data
                JOIN product_detail pd ON sales_data.product_detail_id = pd.id
                JOIN product p ON pd.product_id = p.id
                LEFT JOIN (
                    SELECT product_detail_id, MAX(id) AS max_image_id
                    FROM image
                    GROUP BY product_detail_id
                ) max_images ON pd.id = max_images.product_detail_id
                LEFT JOIN image i ON max_images.max_image_id = i.id
                ORDER BY total_sold DESC
                LIMIT 9
            """, nativeQuery = true)
    List<StatisticalBestSellingProductResponse> getAllStatisticalBestSellingProductClient(@Param("req") FindBillDateRequest req);

    // Thống kê số lượng hóa đơn theo ngày hoàn thành:
// Đếm số lượng hóa đơn (totalBillDate) theo ngày (billDate) trong một khoảng thời gian với trạng thái hóa đơn là "THANH_CONG" hoặc "TRA_HANG".
// Thống kê số lượng hóa đơn theo ngày hoàn thành:
    // WHERE DATE(b.received_date) >= :#{#req.startDate} AND DATE(b.received_date) <= :#{#req.endDate}
    @Query(value = """
                SELECT
                    received_date AS billDate,
                    COUNT(*) AS totalBillDate
                FROM
                    bill
            WHERE (:#{#req.startDate} IS NULL OR DATE(received_date) >= :#{#req.startDate})
              AND (:#{#req.endDate} IS NULL OR DATE(received_date) <= :#{#req.endDate})
                GROUP BY billDate
                ORDER BY received_date ASC;
                                  """, nativeQuery = true)
    List<StatisticalBillDateResponse> getAllStatisticalBillDate(@Param("req") FindBillDateRequest req);

    // Thống kê tổng số sản phẩm bán ra theo ngày:
    @Query(value = """
                SELECT
                       b.received_date AS billDate,
                       SUM(bd.quantity) AS totalProductDate
                  FROM
                       bill_detail bd
                  JOIN bill b ON bd.bill_id = b.id
                    WHERE (:#{#req.startDate} IS NULL OR DATE(b.received_date) >= :#{#req.startDate})
                      AND (:#{#req.endDate} IS NULL OR DATE(b.received_date) <= :#{#req.endDate})
                  GROUP BY billDate
                  ORDER BY b.received_date ASC
            """, nativeQuery = true)
    List<StatisticalProductDateResponse> getAllStatisticalProductDate(@Param("req") FindBillDateRequest req);

    // Thống kê hàng tồn kho ít hơn 10 sản phẩm:
// Lấy thông tin các sản phẩm còn lại ít hơn 10 sản phẩm trong kho, bao gồm ảnh, tên sản phẩm, giá và số lượng tồn kho (sold).
    @Query(value = """
              SELECT
                ROW_NUMBER() OVER(ORDER BY pd.updated_at DESC) AS indexs,
                i.url AS image,
                p.name  AS name,
                pd.price AS price,
                pd.quantity AS sold,
                pd.quantity AS sales
            FROM product_detail pd
                     JOIN product p on pd.product_id = p.id
                     JOIN (SELECT product_detail_id, MAX(id) AS max_image_id
                           FROM image
                           GROUP BY product_detail_id) max_images ON pd.id = max_images.product_detail_id
                     LEFT JOIN image i ON max_images.max_image_id = i.id
            WHERE pd.quantity < 9
            ORDER BY sold asc
                                   """, nativeQuery = true)
    List<StatisticalBestSellingProductResponse> getAllStatisticalProductStock();

    ///ham tra hang
    @Query(value = """
            SELECT
                bi.id AS idBill,
                bi.code AS codeBill,
                bi.recipient_name AS nameCustomer,
                bi.recipient_phone AS phoneNumber,
                bi.invoice_status AS statusBill,
                bi.invoice_type AS typeBill,
                bi.address AS address,
                bi.total_money AS totalMoney,
                bi.discount_amount AS discountAmount,
                bi.note AS note,
                bi.customer_id AS idCustomer,
                bi.confirmation_date AS confirmationDate,
                bi.received_date AS receivedDate,
                bi.delivery_date AS deliveryDate,
                v.id AS idVoucher,
                v.discount_value AS voucherValue,
                v.minimum_order_value AS minOrderValue,
                v.maximum_discount_value AS maxDiscountValue,
                v.discount_method AS discountMethod,
                bi.shipping_fee AS moneyShip  
            FROM bill bi
            LEFT JOIN employee em ON em.id = bi.employee_id
            LEFT JOIN voucher v ON v.id = bi.voucher_id
            WHERE bi.code = :codeBill
                """, nativeQuery = true)
    BillGiveBackInformation getBillGiveBackInformation(@Param("codeBill") String codeBill);

    @Query(value = """
                        
             SELECT
                            ROW_NUMBER() OVER (ORDER BY detail.updated_at DESC) AS stt,
                            bd.id AS idBillDetail,
                            detail.id AS idProductDetail,
                            i.url AS image,
                            CONCAT(p.name ,'[ ',s2.name,' - ',c2.name,' ]') AS nameProduct,
                            bd.quantity AS quantity,           
                            bd.promotion AS promotion,
                            bd.price AS price,
                            c2.hex_code AS codeColor,
                            detail.id AS idProductDetail,
                            bd.status AS statusBillDetail,
                            bi.shipping_fee AS moneyShip
                        FROM bill bi
                        JOIN bill_detail bd ON bi.id = bd.bill_id
                        JOIN product_detail detail ON bd.product_detail_id = detail.id
                        JOIN product p ON detail.product_id = p.id
                        JOIN (
                            SELECT product_detail_id, MAX(id) AS max_image_id
                            FROM image
                            GROUP BY product_detail_id
                        ) max_images ON detail.id = max_images.product_detail_id
                        LEFT JOIN image i ON max_images.max_image_id = i.id
                        JOIN size s2 on detail.size_id = s2.id
                        JOIN color c2 on detail.color_id = c2.id
                        WHERE bi.id = :idBill AND bd.quantity > 0
            """, nativeQuery = true)
    List<BillGiveBack> getBillGiveBack(@Param("idBill") Integer idBill);

    @Query(value = """
            select * from bill where voucher_id = :code and customer_id = :customer
            """, nativeQuery = true)
    Bill findByVoucher(@Param("code")Integer code, @Param("customer") Integer customer);


    // DĐức

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
               LEFT JOIN bill_detail bd ON bd.bill_id = hd.id
               WHERE
            hd.invoice_status = :loaiHD
            AND (:#{#req.code} IS NULL OR hd.code LIKE %:#{#req.code}% OR hd.recipient_phone LIKE %:#{#req.code}%)
            AND (:#{#req.invoiceStatus} IS NULL OR hd.invoice_status = :#{#req.invoiceStatus})
            AND (:#{#req.fromDate} IS NULL OR :#{#req.toDate} IS NULL OR (hd.updated_at BETWEEN :#{#req.fromDate} AND :#{#req.toDate}))
               GROUP BY hd.id, hd.code, pgg.name, nv.name, kh.full_name, tt.method, hd.invoice_type, hd.confirmation_date,\s
                 hd.discount_amount, hd.recipient_name, hd.total_money, hd.shipping_fee, hd.recipient_email,\s
                 hd.recipient_phone, hd.invoice_status, hd.delivery_status, hd.delivery_date, hd.received_date,\s
                 tt.transaction_no, hd.shipping_time, hd.address, hd.note, hd.created_at, hd.updated_at,\s
                 hd.created_by, hd.updated_by
               """, nativeQuery = true)
    Page<BillResponse> getAllHoaDonDonYeuCauHuy(@Param("req") BillSearchRequest req, Pageable pageable, @Param("loaiHD") Integer loaiHD);

}
