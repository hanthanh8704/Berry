package com.example.be.repositories.admin;


import com.example.be.dto.admin.request.billdetail.BillDetailRequest;
import com.example.be.dto.admin.request.billdetail.BillDetailRequestOne;
import com.example.be.dto.admin.response.billdetail.BillDetailResponse;
import com.example.be.entities.Bill;
import com.example.be.entities.BillDetail;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author hanthanh
 */
@Repository
public interface BillDetailRepository extends JpaRepository<BillDetail, Integer> {
//    @Query(value = """
//                SELECT DISTINCT
//                    ROW_NUMBER() OVER (ORDER BY hdc.created_at DESC) AS indexs,
//                    hdc.id AS id,
//                    CONCAT(sp.name, ' [', ms.name, ' - ', kc.name, ']') AS name,
//                    ctsp.detail_code AS detailCode,
//                    ctsp.price AS price,
//                    ms.name AS nameColor,
//                    kc.name AS nameSize,
//                    cl.name AS nameMaterial,
//                    hd.id AS idBill,
//                    hd.invoice_type AS invoiceType,
//                    th.name AS nameBrand,
//                    hdc.price AS newPrice,
//                    CASE
//                        WHEN dgg.status = 'Đang diễn ra' THEN spctkm.new_price
//                        ELSE NULL
//                    END AS newPrice,
//                    CASE
//                        WHEN dgg.status = 'Đang diễn ra' THEN MAX(dgg.discount_percentage)
//                        ELSE NULL
//                    END AS discountPercentage,
//                    GROUP_CONCAT(img.image) AS image,
//                    hdc.quantity AS quantity,
//                    hdc.status AS status,
//                    hdc.created_at AS createdAt,
//                    hdc.updated_at AS updatedAt
//                FROM
//                    bill_detail hdc
//                    JOIN product_detail ctsp ON hdc.product_detail_id = ctsp.id
//                    JOIN product sp ON sp.id = ctsp.product_id
//                    JOIN color ms ON ms.id = ctsp.color_id
//                    JOIN size kc ON kc.id = ctsp.size_id
//                    JOIN material cl ON cl.id = ctsp.material_id
//                    JOIN brand th ON th.id = ctsp.brand_id
//                    LEFT JOIN (
//                        SELECT
//                            product_detail_id,
//                            GROUP_CONCAT(DISTINCT image.url) AS image
//                        FROM image
//                        GROUP BY product_detail_id
//                    ) img ON img.product_detail_id = ctsp.id
//                    LEFT JOIN product_detail_promotion spctkm ON spctkm.product_detail_id = ctsp.id
//                    LEFT JOIN promotion dgg ON dgg.id = spctkm.promotion_id
//                    LEFT JOIN bill hd ON hd.id = hdc.bill_id
//                WHERE
//                    (:#{#req.idBill} IS NULL OR hd.id = :#{#req.idBill})
//                GROUP BY
//                    hdc.id, sp.name, ms.name, kc.name, cl.name, th.name, ctsp.detail_code, hdc.price,
//                    hdc.quantity, hdc.status, hdc.created_at, hdc.updated_at,
//                    dgg.status, spctkm.new_price, hd.invoice_type
//            """, nativeQuery = true)
//    Page<BillDetailResponse> getAllHoaDonChiTiet(@Param("req") BillDetailRequest req, Pageable pageable);


    @Query(value = """
                SELECT DISTINCT
                    ROW_NUMBER() OVER (ORDER BY hdc.created_at DESC) AS indexs,
                    hdc.id AS id,
                    CONCAT(sp.name, ' [', ms.name, ' - ', kc.name, ']') AS name,
                    ctsp.detail_code AS detailCode,
                    ctsp.price AS price,
                    ms.name AS nameColor,
                    kc.name AS nameSize,
                    cl.name AS nameMaterial,
                    hd.id AS idBill,
                    hd.invoice_type AS invoiceType,
                    th.name AS nameBrand,
                    hdc.price AS newPrice,
                    GROUP_CONCAT(img.image) AS image,
                    hdc.quantity AS quantity,
                    hdc.status AS status,
                    hdc.created_at AS createdAt,
                    hdc.updated_at AS updatedAt
                FROM
                    bill_detail hdc
                    JOIN product_detail ctsp ON hdc.product_detail_id = ctsp.id
                    JOIN product sp ON sp.id = ctsp.product_id
                    JOIN color ms ON ms.id = ctsp.color_id
                    JOIN size kc ON kc.id = ctsp.size_id
                    JOIN material cl ON cl.id = ctsp.material_id
                    JOIN brand th ON th.id = ctsp.brand_id
                    LEFT JOIN (
                        SELECT
                            product_detail_id,
                            GROUP_CONCAT(DISTINCT image.url) AS image
                        FROM image
                        GROUP BY product_detail_id
                    ) img ON img.product_detail_id = ctsp.id
                   
                    LEFT JOIN bill hd ON hd.id = hdc.bill_id
                WHERE
                    (:#{#req.idBill} IS NULL OR hd.id = :#{#req.idBill})
                GROUP BY
                    hdc.id, sp.name, ms.name, kc.name, cl.name, th.name, ctsp.detail_code, hdc.price,
                    hdc.quantity, hdc.status, hdc.created_at, hdc.updated_at, hd.invoice_type
            """, nativeQuery = true)
    Page<BillDetailResponse> getAllHoaDonChiTiet(@Param("req") BillDetailRequest req, Pageable pageable);

    @Query(value = """
            SELECT DISTINCT
                hdc.id AS id,
                 ROW_NUMBER() OVER (ORDER BY hdc.created_at DESC) AS indexs,
                CONCAT(sp.name, ' [', ms.name, ' - ', kc.name, ']') AS name,
                sp.name AS nameSPCT,
                ctsp.detail_code AS detailCode,
                ms.name AS nameColor,
                kc.name AS nameSize,
                cl.name AS nameMaterial,
                hd.id AS idBill,
                hd.invoice_type AS invoiceType,
                th.name AS nameBrand,
                ctsp.price AS price,
                hdc.promotion AS promotion,
                GROUP_CONCAT(img.image) AS image,
                hdc.quantity AS quantity,
                hdc.status AS status,
                hdc.price AS priceHDCT,
                hdc.created_at AS createdAt,
                hdc.updated_at AS updatedAt
            FROM
                bill_detail hdc
                JOIN product_detail ctsp ON hdc.product_detail_id = ctsp.id
                JOIN product sp ON sp.id = ctsp.product_id
                JOIN color ms ON ms.id = ctsp.color_id
                JOIN size kc ON kc.id = ctsp.size_id
                JOIN material cl ON cl.id = ctsp.material_id
                JOIN brand th ON th.id = ctsp.brand_id
                LEFT JOIN (
                    SELECT
                        product_detail_id,
                        GROUP_CONCAT(DISTINCT image.url) AS image
                    FROM image
                    GROUP BY product_detail_id
                ) img ON img.product_detail_id = ctsp.id
                LEFT JOIN bill hd ON hd.id = hdc.bill_id
            WHERE
                (:#{#req.idBill} IS NULL OR hd.id = :#{#req.idBill})
            GROUP BY
                hdc.id, sp.name, ms.name, kc.name, cl.name, th.name, ctsp.detail_code,
                hdc.price, hdc.quantity, hdc.status, hdc.created_at, hdc.updated_at, hd.invoice_type
            ORDER BY hdc.created_at DESC
                        """, nativeQuery = true)
    Page<BillDetailResponse> getAllHDCT(@Param("req") BillDetailRequest req, Pageable pageable);


    @Query(value = """
                SELECT DISTINCT
                    ROW_NUMBER() OVER (ORDER BY hdc.created_at DESC) AS indexs,
                    hdc.id AS id,
                    CONCAT(sp.name, ' [', ms.name, ' - ', kc.name, ']') AS productName,
                    ctsp.detail_code AS codeProduct,
                    ctsp.price AS priceProductDetail,
                    ms.name AS nameColor,
                    kc.name AS nameSize,
                    cl.name AS nameMaterial,
                    hd.id AS idBill,
                    hd.invoice_type AS invoiceType,
                    hd.invoice_status AS invoiceStatus,
                    th.name AS nameBrand,
                    hdc.price AS price,
                    CASE
                        WHEN dgg.status = 'DANG_DIEN_RA' THEN spctkm.new_price
                        ELSE NULL
                    END AS newPrice,
                    CASE
                        WHEN dgg.status = 'DANG_DIEN_RA' THEN MAX(dgg.discount_percentage)
                        ELSE NULL
                    END AS discountPercentage,
                    GROUP_CONCAT(img.image) AS image,
                    hdc.quantity AS quantity,
                    hdc.status AS status,
                    hdc.created_at AS createdAt,
                    hdc.updated_at AS updatedAt
                FROM
                    bill_detail hdc
                    JOIN product_detail ctsp ON hdc.product_detail_id = ctsp.id
                    JOIN product sp ON sp.id = ctsp.product_id
                    JOIN color ms ON ms.id = ctsp.color_id
                    JOIN size kc ON kc.id = ctsp.size_id
                    JOIN material cl ON cl.id = ctsp.material_id
                    JOIN brand th ON th.id = ctsp.brand_id
                    LEFT JOIN (
                        SELECT
                            product_detail_id,
                            GROUP_CONCAT(DISTINCT image.url) AS image
                        FROM image
                        GROUP BY product_detail_id
                    ) img ON img.product_detail_id = ctsp.id
                    LEFT JOIN product_detail_promotion spctkm ON spctkm.product_detail_id = ctsp.id
                    LEFT JOIN promotion dgg ON dgg.id = spctkm.promotion_id
                    LEFT JOIN bill hd ON hd.id = hdc.bill_id
                WHERE
                    (:#{#req.idBill} IS NULL OR hd.id = :#{#req.idBill})
                GROUP BY
                    hdc.id, sp.name, ms.name, kc.name, cl.name, th.name, ctsp.detail_code, hdc.price,
                    hdc.quantity, hdc.status, hdc.created_at, hdc.updated_at,
                    dgg.status, spctkm.new_price, hd.invoice_type
            """, nativeQuery = true)
    List<BillDetailResponse> findByIdBill(@Param("req") BillDetailRequestOne req);

//    @Query(value = "SELECT * FROM bill_detail WHERE bill_id = :id AND status = 6", nativeQuery = true)
//    List<BillDetail> findAllByIdBill(@Param("id") Integer id);
    @Query("SELECT bd from BillDetail bd where bd.bill.id = :id and bd.status = 6")
    List<BillDetail> findAllByIdBill(@Param("id") Integer id);
    // Hàm này dùng để lấy ra hóa đơn chi tiết qua id hóa đơn
//    @Query("SELECT hdct FROM HoaDonChiTiet hdct WHERE hdct.hoaDon.id =: id")
//    BillDetail findHoaDonChiTiet(@Param("id") Integer id);bd


    // Hàm này dùng để lấy ra danh sách hóa đơn chi tiết thông qua hóa đơn và trạng thái
//    List<BillDetail> findByBillAndStatus(Bill hoaDon, String trangThai);
    @Query("SELECT bd FROM BillDetail bd WHERE bd.bill.id = :idBill")
    List<BillDetail> findByHoaDonId(@Param("idBill") Integer idBill);


    //    @Query(value = "SELECT * FROM hoa_don_chi_tiet WHERE id_hoa_don = :idHoaDon", nativeQuery = true)
    List<BillDetail> findByBillId(Integer idHoaDon);

    @Query(value = """
                SELECT h.* 
                FROM bill_detail h 
                LEFT JOIN product_detail s ON s.id = h.product_detail_id
                LEFT JOIN bill hd ON hd.id = h.bill_id
                WHERE s.detail_code =:maSPCT AND h.bill_id =:hoaDon
            """, nativeQuery = true)
    List<BillDetail> findChiTietSanPhamMaAndHoaDonID(@Param("maSPCT") String maSPCT, @Param("hoaDon") Integer hoaDon);
    @Query(value = """
                SELECT h.* 
                FROM bill_detail h 
                LEFT JOIN product_detail s ON s.id = h.product_detail_id
                LEFT JOIN bill hd ON hd.id = h.bill_id
                WHERE s.detail_code =:maSPCT AND h.bill_id =:hoaDon 
            """, nativeQuery = true)
    List<BillDetail> findChiTietSanPhamMaAndHoaDonIDAndGiaSanPham(@Param("maSPCT") String maSPCT,
                                                                  @Param("hoaDon") Integer hoaDon
                                                                 );


    // Hàm này liên quan đến làm app

    @Query(value = """
            select quantity
            from bill_detail
            where bill_id = ? and product_detail_id = ?
            """, nativeQuery = true)
    Integer quantityProductDetail(Integer idBill, Integer idPrDetail);

    @Query(value = """
            select id
            from bill_detail
            where bill_id = ? and product_detail_id = ?
            """, nativeQuery = true)
    Integer idBillDetailProductDetail(Integer idBill, Integer idPrDetail);

    @Query(value = """
                select * from bill_detail bd where bd.product_detail_id = :productDetailId and bd.bill_id = :billId
            """, nativeQuery = true)
    BillDetail findByProductIdAndBillId(Integer productDetailId, Integer billId);

    @Modifying
    @Query(value = """
             DELETE FROM  bill_detail
             WHERE bill_id = :id
            """, nativeQuery = true)
    int deleteAllByBill_Id(Integer id);


    @Query("SELECT bd from BillDetail bd where bd.bill.id = :id ")
    List<BillDetail> findAllByIdBillCreate(@Param("id") Integer id);
}
