package com.example.connectdb.repositories;

import com.example.connectdb.dto.request.product.SanPhamSearchRequest;
import com.example.connectdb.dto.response.SanPhamReponse;
import com.example.connectdb.dto.response.promotion.SpctKhuyenMaiResponse;
import com.example.connectdb.entity.SanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham,Integer> {

    boolean existsByMa(String ma);
    @Query("""
select sp from SanPham sp where sp.id=:id
""")
    public SanPham findByIdSp(Integer id);

    @Query(value = """
    SELECT
        sp.id AS id,
        sp.ten AS ten,
        sp.ma as ma,
        SUM(ctsp.so_luong) AS soLuong,
        ROW_NUMBER() OVER (ORDER BY sp.ngay_tao DESC) AS indexs,
        GROUP_CONCAT(DISTINCT ms.ten) AS mauSac,
        GROUP_CONCAT(DISTINCT kc.ten) AS kichCo,
        SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT img.anh ORDER BY img.anh), ',', 1) AS images,
        dm.ten AS danhMuc,
        MIN(ctsp.gia_ban) AS minPrice,
        MAX(ctsp.gia_ban) AS maxPrice,
        sp.trang_thai AS trangThai
    FROM san_pham sp
    LEFT JOIN chi_tiet_san_pham ctsp ON sp.id = ctsp.id_san_pham
    LEFT JOIN mau_sac ms ON ctsp.id_mau_sac = ms.id
    LEFT JOIN kich_co kc ON ctsp.id_kich_co = kc.id
    LEFT JOIN danh_muc dm ON sp.id_danh_muc = dm.id
    LEFT JOIN (SELECT id_chi_tiet_san_pham, 
               GROUP_CONCAT(DISTINCT anh) AS anh FROM anh GROUP BY id_chi_tiet_san_pham) img 
    ON ctsp.id = img.id_chi_tiet_san_pham
    WHERE (:#{#req.ten} IS NULL OR sp.ten LIKE CONCAT(%:#{#req.ten}%)\s
                      OR sp.ma LIKE CONCAT(%:#{#req.ten}%))  AND (:#{#req.danhMuc} IS NULL OR sp.id_danh_muc =:#{#req.danhMuc})
                    
    GROUP BY
        sp.id,
        sp.ma,
        sp.ten,
        dm.ten,
        sp.trang_thai
    """, nativeQuery = true)
    Page<SanPhamReponse> getAllSanPham(@Param("req") SanPhamSearchRequest request, Pageable pageable);


    @Query(value = """
             SELECT
                        sp.id AS id,sp.ten AS ten,sp.ma as ma
                        ROW_NUMBER() OVER(ORDER BY sp.ngay_tao DESC) AS indexs,
                        dm.ten AS danhMuc,
                        dgg.gia_moi AS giaMoi
                        FROM san_pham sp
                        LEFT JOIN chi_tiet_san_pham spct ON sp.id = spct.id_san_pham
                        LEFT JOIN danh_muc dm ON dm.id = sp.id_danh_muc
                        LEFT JOIN spct_khuyen_mai spctkm ON spctkm.id_chi_tiet_san_pham = spct.id
                        LEFT JOIN dot_giam_gia dgg ON dgg.id = spctkm.id_dot_giam_gia
                        WHERE (:promotion IS NULL OR dgg.id = :promotion)
            """, nativeQuery = true)
    List<SpctKhuyenMaiResponse> getAllShoeInPromotion(@Param("promotion") Integer promotion);

    @Query(value = """
            SELECT
            s.id AS id,s.ten AS ten,
            ROW_NUMBER() OVER(ORDER BY SUM(bd.quantity) DESC) AS indexs,
            SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT img.name ORDER BY img.name), ',', 1) AS images,
            ct.ten AS danhMuc,
            MAX(sd.gia_ban) AS maxGiaBan,
            MIN(sd.gia_ban) AS minGiaBan,
            SUM(bd.so_luong) AS soLuong,
            s.deleted AS status
            FROM shoe s
            LEFT JOIN shoe_detail sd ON s.id = sd.shoe_id
            LEFT JOIN category ct ON ct.id = s.category_id
            LEFT JOIN (SELECT shoe_detail_id, 
            GROUP_CONCAT(DISTINCT name) AS name FROM images GROUP BY shoe_detail_id
            ) img ON sd.id = img.shoe_detail_id
            LEFT JOIN bill_detail bd ON bd.shoe_detail_id = sd.id
            LEFT JOIN bill b ON b.id = bd.bill_id
            WHERE s.deleted = FALSE AND b.status = 6
            GROUP BY s.id
            ORDER BY SUM(bd.quantity) DESC
            LIMIT :top
            """, nativeQuery = true)
    List<SanPhamReponse> topSell(@Param("top") Integer top);
    Boolean existsByTenIgnoreCase(String ten);
    SanPham findByTen(String ten);


}
