package com.example.be.repository;

import com.example.be.entity.DotGiamGiaDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}
