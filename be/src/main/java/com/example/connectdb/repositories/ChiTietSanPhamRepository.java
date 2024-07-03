package com.example.connectdb.repositories;

import com.example.connectdb.dto.request.productDetail.FindShirtDetailRequest;
import com.example.connectdb.dto.response.ShirtDetailResponse;
import com.example.connectdb.entity.ChiTietSanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChiTietSanPhamRepository extends JpaRepository<ChiTietSanPham,Integer> {

    @Query(value = """
SELECT
                spct.id AS id,
                ROW_NUMBER() OVER(ORDER BY sp.ngay_sua DESC) AS indexs,
                CONCAT(sp.ten, ' [', ms.ten, ' - ', kt.ten, ']') AS ten,
                spct.ma AS ma,
                cl.ten AS sole,
                ms.ten AS color,
                kt.ten AS size,
                spct.so_luong AS soLuong,
                spct.gia_ban AS price,
                CASE\s
                    WHEN CURRENT_TIMESTAMP BETWEEN dgg.ngay_bat_dau AND dgg.ngay_ket_thuc\s
                        THEN spctkm.gia_moi
                    ELSE NULL
                END AS giaTriDaGiam,
                GROUP_CONCAT(DISTINCT img.anh) AS anh
            FROM
                chi_tiet_san_pham spct
                LEFT JOIN san_pham sp ON spct.id_san_pham = sp.id
                LEFT JOIN mau_sac ms ON spct.id_mau_sac = ms.id
                LEFT JOIN kich_co kt ON spct.id_kich_co = kt.id
                LEFT JOIN chat_lieu cl ON spct.id_chat_lieu = cl.id
                LEFT JOIN anh img ON img.id = spct.id_anh
                LEFT JOIN spct_khuyen_mai spctkm ON spctkm.id_chi_tiet_san_pham = spct.id
                LEFT JOIN dot_giam_gia dgg ON dgg.id = spctkm.id_dot_giam_gia
            WHERE
                (:#{#req.shoe} IS NULL OR spct.id_san_pham IN (:#{#req.shoes}))
                AND (:#{#req.color} IS NULL OR :#{#req.color} = '' OR spct.id_mau_sac IN (:#{#req.colors}))
                AND (:#{#req.size} IS NULL OR :#{#req.size} = '' OR spct.id_kich_co IN (:#{#req.sizes}))
                AND (:#{#req.sole} IS NULL OR :#{#req.sole} = '' OR spct.id_chat_lieu IN (:#{#req.soles}))
                AND (:#{#req.name} IS NULL OR :#{#req.name} = '' OR CONCAT(s.name, ' ', c.name, ' ', sz.name, ' ') LIKE %:#{#req.name}%)
                GROUP BY
                spct.id, sp.ngay_sua, sp.ten, ms.ten, kt.ten, spct.ma, cl.ten, spct.so_luong, spct.gia_ban,dgg.ngay_bat_dau, dgg.ngay_ket_thuc, spctkm.gia_moi;
            """, nativeQuery = true)
    Page<ShirtDetailResponse> getAll(@Param("req") FindShirtDetailRequest request, Pageable pageable);

}
