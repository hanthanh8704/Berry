package com.example.be.repository;

import com.example.be.dto.response.DotGiamGiaResponse;
import com.example.be.entity.ChiTietSanPham;
import com.example.be.entity.DotGiamGia;
import com.example.be.entity.DotGiamGiaDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface  DotGiamGiaRepository extends JpaRepository<DotGiamGia, Integer> {

//    @Query(value = """
//            SELECT p.id AS id,
//            ROW_NUMBER() OVER(ORDER BY p.create_at DESC) AS indexs,
//            p.code AS code, p.name AS name,
//            p.value AS value,
//            p.start_date AS startDate,
//            p.end_date AS endDate, p.status AS status
//            FROM promotion p
//            WHERE (:#{#req.name} IS NULL OR p.name LIKE %:#{#req.name}%)
//            AND (:#{#req.status} IS NULL OR p.status = :#{#req.status})
//            """, nativeQuery = true)
//    Page<PromotionResponse> getAllPromotion(@Param("req") D request, Pageable pageable);

    @Query("select de from DotGiamGiaDetail de join de.idDotGiamGia d where d.id = :idDGG")
    DotGiamGiaResponse findByIdDotGiamGia (@Param("idDGG") Integer id);
    @Query("select de from DotGiamGiaDetail de join de.idDotGiamGia d where d.id = :idDGG")
    List<DotGiamGiaDetail> findByAllIdDotGiamGia (@Param("idDGG") Integer id);
    @Query("select sp from ChiTietSanPham sp join DotGiamGiaDetail de on sp.id = de.idSPCT.id " +
            "join DotGiamGia d on de.idDotGiamGia.id = d.id where d.id = :idDGG")
    List<ChiTietSanPham> findByAllSPCTByIdDotGiamGia (@Param("idDGG") Integer id);

    @Query("SELECT d FROM DotGiamGia d  ORDER BY d.ngayTao DESC ")
    List<DotGiamGia> findAllDotGiamGiaByNgayTaoDesc();
    @Query("SELECT d FROM DotGiamGia d where d.ma = :ma")
    Optional<DotGiamGia> findByMa(@Param("ma") String ma);

//    @Query("SELECT d.ma, d.ten, d.giaTriGiam, d.ngayBatDau, d.ngayKetThuc, " +
//            "spct.idSanPham.ten AS tenSanPham, spct.soLuong, spct.giaBan, " +
//            "spct.idChatLieu.ten AS tenChatLieu, spct.idMauSac.ten AS tenMauSac, " +
//            "spct.idKichCo.ten AS tenKichCo, spct.idThuongHieu.ten AS tenThuongHieu, " +
//            "spct.idTayAo.ten AS tenTayAo, spct.idCoAo.ten AS tenCoAo " +
//            "FROM DotGiamGia d " +
//            "LEFT JOIN d.dotGiamGiaDetail dt " +  // Adjust the join to match your entity mapping
//            "LEFT JOIN dt.spct spct " +            // Adjust the join to match your entity mapping
//            "WHERE d.id = :idDGG")
//    DotGiamGiaProjection getAllDGGAndSPCTById(@Param("idDGG") Integer idDGG);

    Boolean existsByMa(String ma);
}
