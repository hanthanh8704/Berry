package com.example.connectdb.repositories;

import com.example.connectdb.dto.request.productDetail.FindShirtDetailRequest;
import com.example.connectdb.dto.response.ShirtDetailResponse;
import com.example.connectdb.entity.ChiTietSanPham;
import com.example.connectdb.entity.SanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Repository
public interface ChiTietSanPhamRepository extends JpaRepository<ChiTietSanPham, Integer> {
    Boolean existsByMaAndMaNot(String code, String exceptCode);

    ChiTietSanPham findByMa(String code);

    boolean existsByMa(String ma);

    List<ChiTietSanPham> findBySanPham(SanPham shoe);

    @Query(value = """
            SELECT
                spct.id AS id,
                ROW_NUMBER() OVER (ORDER BY sp.ngay_tao DESC) AS indexs,
                CONCAT(sp.ten, ' [', ms.ten, ' - ', kt.ten, ']') AS ten,
                spct.maCTSP AS ma,
                cl.ten AS chatLieu,
                ms.ten AS mauSac,
                kt.ten AS kichCo,
                th.ten AS thuongHieu,
                spct.so_luong AS soLuong,
                spct.gia_ban AS giaBan,
                ta.ten AS tayAo,
                ca.ten AS coAo,
                spct.trang_thai AS trangThai,
                CASE
                    WHEN CURRENT_TIMESTAMP BETWEEN dgg.ngay_bat_dau AND dgg.ngay_ket_thuc THEN spctkm.gia_moi
                    ELSE NULL
                END AS giaTriDaGiam,
                GROUP_CONCAT(DISTINCT img.anh) AS images,
                spct.deleted AS deleted
            FROM
                chi_tiet_san_pham spct
                LEFT JOIN san_pham sp ON spct.id_san_pham = sp.id
                LEFT JOIN mau_sac ms ON spct.id_mau_sac = ms.id
                LEFT JOIN kich_co kt ON spct.id_kich_co = kt.id
                LEFT JOIN chat_lieu cl ON spct.id_chat_lieu = cl.id
                LEFT JOIN tay_ao ta ON spct.id_tay_ao = ta.id
                LEFT JOIN co_ao ca ON spct.id_co_ao = ca.id
                LEFT JOIN thuong_hieu th ON spct.id_thuong_hieu = th.id
                LEFT JOIN anh img ON img.id_chi_tiet_san_pham = spct.id
                LEFT JOIN spct_khuyen_mai spctkm ON spctkm.id_chi_tiet_san_pham = spct.id
                LEFT JOIN dot_giam_gia dgg ON dgg.id = spctkm.id_dot_giam_gia
            WHERE
                   (:#{#req.sanphams} IS NULL OR spct.id_san_pham = (:#{#req.sanphams}))
                   AND (:#{#req.mausac} IS NULL OR :#{#req.mausac} = '' OR spct.id_mau_sac IN (:#{#req.mausacs}))
                    AND (:#{#req.kichco} IS NULL OR :#{#req.kichco} = '' OR spct.id_kich_co IN (:#{#req.kichcos}))
                    AND (:#{#req.tayao} IS NULL OR :#{#req.tayao} = '' OR spct.id_tay_ao IN (:#{#req.tayaos}))  
                     AND (:#{#req.chatlieu} IS NULL OR :#{#req.chatlieu} = '' OR spct.id_chat_lieu IN (:#{#req.chatlieus}))
                    AND (:#{#req.thuonghieu} IS NULL OR :#{#req.thuonghieu} = '' OR spct.id_thuong_hieu IN (:#{#req.thuonghieus}))
                      AND (:#{#req.coao} IS NULL OR :#{#req.coao} = '' OR spct.id_co_ao IN (:#{#req.coaos}))
                    AND (:#{#req.ten} IS NULL OR :#{#req.ten} = '' OR CONCAT(sp.ten, ' ', ms.ten, ' ', kt.ten, ' ', cl.ten, ' ', ta.ten, ' ', ca.ten, ' ', th.ten) LIKE %:#{#req.ten}%)
            GROUP BY
                spct.id, sp.ngay_sua, spct.maCTSP, sp.ten, ms.ten, kt.ten, cl.ten, spct.so_luong, spct.gia_ban, dgg.ngay_bat_dau, dgg.ngay_ket_thuc, spctkm.gia_moi;
                                                                                                                                                                                                                                                                                                                                
                                                                                                                                                                           
                    """, nativeQuery = true)
    Page<ShirtDetailResponse> getAll(@Param("req") FindShirtDetailRequest request, Pageable pageable);

    @Query(value = """
            SELECT
                 spct.id AS id,
                ROW_NUMBER() OVER(ORDER BY sp.ngay_tao DESC) AS indexs,
                CONCAT(sp.ten, ' [', ms.ten, ' - ', kt.ten, ']') AS ten,
                spct.maCTSP as ma,
                 cl.ten AS chatLieu,
                ms.ten AS mauSac,
                kt.ten AS kichCo,
                th.ten AS thuongHieu,
                spct.so_luong AS soLuong,
                spct.gia_ban AS giaBan,
                ta.ten as tayAo,
                ca.ten as coAo,
                spct.trang_thai as trangThai,
                            CASE
                                WHEN CURRENT_TIMESTAMP BETWEEN dgg.ngay_bat_dau AND dgg.ngay_ket_thuc
                                    THEN spctkm.gia_moi
                                ELSE NULL
                            END AS giaTriDaGiam,
                       GROUP_CONCAT(DISTINCT img.anh) AS images,
                            spct.deleted AS deleted
                        FROM
                            chi_tiet_san_pham spct
                            LEFT JOIN san_pham sp ON spct.id_san_pham = sp.id
                            LEFT JOIN mau_sac ms ON spct.id_mau_sac = ms.id
                            LEFT JOIN kich_co kt ON spct.id_kich_co = kt.id
                            LEFT JOIN chat_lieu cl ON spct.id_chat_lieu = cl.id
                            LEFT JOIN tay_ao ta ON spct.id_tay_ao = ta.id
                            LEFT JOIN co_ao ca ON spct.id_co_ao = ca.id
                            LEFT JOIN thuong_hieu th ON spct.id_thuong_hieu = th.id
                          LEFT JOIN anh img ON img.id_chi_tiet_san_pham = spct.id
                            LEFT JOIN spct_khuyen_mai spctkm ON spctkm.id_chi_tiet_san_pham = spct.id
                            LEFT JOIN dot_giam_gia dgg ON dgg.id = spctkm.id_dot_giam_gia
            WHERE spct.id=:id
            GROUP BY
                spct.id, sp.ngay_sua, spct.maCTSP, sp.ten, ms.ten, kt.ten, cl.ten, spct.so_luong, spct.gia_ban,dgg.ngay_bat_dau, dgg.ngay_ket_thuc, spctkm.gia_moi;
                
            """, nativeQuery = true)
    ShirtDetailResponse getOneShoeDetail(@Param("id") Integer id);


    ChiTietSanPham findBySanPhamIdAndMauSacIdAndKichCoIdAndChatLieuIdAndCoAoIdAndTayAoId(Integer idShoe, Integer idColor, Integer idSize, Integer idMaterial, Integer sleeve, Integer collar);

    ChiTietSanPham findBySanPhamIdAndMauSacTenAndKichCoTen(Integer idShoe, String colorName, String sizeName);

    @Query("SELECT MIN(sd.giaBan) AS minPrice, MAX(sd.giaBan) AS maxPrice FROM ChiTietSanPham sd")
    Map<String, BigDecimal> findMinAndMaxPrice();

}
