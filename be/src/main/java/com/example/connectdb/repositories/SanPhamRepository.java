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

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham,Integer> {
    boolean existsByMaIgnoreCase(String ma);
    boolean existsByMa(String ma);
    @Query(value = """
    SELECT
        sp.id AS id,
        sp.ten AS ten,
        sp.ma,
        SUM(ctsp.so_luong) AS soLuong,
        ROW_NUMBER() OVER (ORDER BY sp.ngay_tao DESC) AS indexs,
        GROUP_CONCAT(DISTINCT ms.ten) AS mauSac,
        GROUP_CONCAT(DISTINCT kc.ten) AS kichCo,
        dm.ten AS danhMuc,
        MIN(ctsp.gia_ban) AS minPrice,
        MAX(ctsp.gia_ban) AS maxPrice,
        sp.trang_thai AS trangThai
    FROM san_pham sp
    LEFT JOIN chi_tiet_san_pham ctsp ON sp.id = ctsp.id_san_pham
    LEFT JOIN mau_sac ms ON ctsp.id_mau_sac = ms.id
    LEFT JOIN kich_co kc ON ctsp.id_kich_co = kc.id
    LEFT JOIN danh_muc dm ON sp.id_danh_muc = dm.id
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
                                                                sp.id AS id,
                                                                sp.ten AS ten,
                                                                ROW_NUMBER() OVER(ORDER BY sp.ngay_tao DESC) AS indexs,
                                                                dm.ten AS , danhMuc
                                        
                                                                pgg.id AS dotGiamGia
                                                            FROM san_pham sp
                                                            LEFT JOIN chi_tiet_san_pham cts ON sp.id = cts.id_san_pham
                                                            LEFT JOIN danh_muc dm ON sp.id_danh_muc = dm.id
                                                       
                                                            LEFT JOIN spct_khuyen_mai spkm ON cts.id = spkm.id_chi_tiet_san_pham
                                                            LEFT JOIN dot_giam_gia pgg ON spkm.id_dot_giam_gia = pgg.id
                                                            WHERE (:promotion IS NULL OR pgg.id = :promotion);
                                                            
            """, nativeQuery = true)
    List<SanPhamReponse> getAllShoeInPromotion(@Param("promotion") Integer promotion);



}
