package com.example.be.repository;

import com.example.be.entity.DotGiamGiaDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DotGiamGiaDetailRepository extends JpaRepository<DotGiamGiaDetail, Integer> {

    @Query(value = """
            SELECT GROUP_CONCAT(DISTINCT s.id) 
            FROM DotGiamGiaDetail pmd
            JOIN SPCT sd ON sd.id = pmd.idSPCT
            JOIN SanPham s ON s.id = sd.idSanPham
            JOIN DotGiamGia pm ON pm.id = pmd.idDotGiamGia
            WHERE (:idDGG IS NULL OR pm.id = :idDGG)
            """, nativeQuery = true)
    List<Integer> getListIdSanPhamDotGiamGia(@Param("idDGG") Integer idDGG);

    @Query("SELECT pmd FROM DotGiamGiaDetail pmd WHERE :idSPCT IS NULL OR pmd.idSPCT.id = :idSPCT")
    DotGiamGiaDetail findBySanPhamDetailId(@Param("idSPCT") Integer idSPCT);


//    PromotionDetail findByShoeDetailId(Long id);

    @Query(value = """
            SELECT pmd.idSPCT FROM DotGiamGiaDetail pmd
            WHERE :idDGG IS NULL OR pmd.idDotGiamGia = :idDGG
            """)
    List<Integer> getListIdSanPhamDetailInDotGiamGia(@Param("idDGG") Integer idDGG);

    //    DotGiamGiaDetail findByMaSPCT(String code);
    @Query("SELECT pd.id FROM DotGiamGiaDetail pd WHERE pd.idDotGiamGia.id = :idDGG")
    List<Integer> findIdsByDotGiamGiaId(@Param("idDGG") Integer idDGG);

    @Query("SELECT pd FROM DotGiamGiaDetail pd join pd.idDotGiamGia d WHERE d.id = :idDGG")
    List<DotGiamGiaDetail> getDGGDetailByidDotGG(@Param("idDGG") Integer idDGG);

    @Query("SELECT dt FROM DotGiamGiaDetail dt JOIN dt.idSPCT spct WHERE spct.id = :idSPCT and dt.trangThai = 'Đang diễn ra'")
    Optional<DotGiamGiaDetail> getFirstDGGDetailByIdSPCT(@Param("idSPCT") Integer idSPCT);

    @Query("SELECT pd FROM DotGiamGiaDetail pd WHERE pd.idSPCT.id = :idSPCT")
    List<DotGiamGiaDetail> findByIdSPCT(@Param("idSPCT") Integer idSPCT);

    // Code bán hàng

    @Query(value = """
            SELECT a.* FROM spct_khuyen_mai a 
            LEFT JOIN chi_tiet_san_pham b ON b.id = a.id_chi_tiet_san_pham
            WHERE b.maCTSP = :ma
            """, nativeQuery = true)
    DotGiamGiaDetail findByIdSPCT_Ma( String ma);


}
