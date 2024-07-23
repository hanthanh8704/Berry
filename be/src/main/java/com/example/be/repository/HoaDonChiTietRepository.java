package com.example.be.repository;

import com.example.be.dto.request.billDetail.BillDetailRequest;
import com.example.be.dto.response.HoaDonChiTietResponse;
import com.example.be.entity.HoaDon;
import com.example.be.entity.HoaDonChiTiet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, Integer> {

    // Hàm getAll
    @Query(value = """
            SELECT
                  ROW_NUMBER() OVER (ORDER BY hdc.ngay_tao DESC) AS indexs,
                  hdc.id AS id,
                  CONCAT(sp.ten, ' [', ms.ten, ' - ', kc.ten, ']') AS name,
                  ctsp.maCTSP AS maSPCT,
                  ctsp.gia_ban AS giaAo,
                  ms.ten AS mauSac,
                  kc.ten AS kichCo,
                  cl.ten AS chatLieu,
                  th.ten AS thuongHieu,
                  hdc.don_gia AS gia,
                  CASE
                      WHEN dgg.trang_thai = 'Đang diễn ra'
                          THEN spctkm.gia_moi
                      ELSE NULL
                  END AS giaTriDaGiam,
                  CASE
                      WHEN dgg.trang_thai = 'Đang diễn ra'
                          THEN MAX(dgg.gia_tri_giam)
                      ELSE NULL
                  END AS phanTramGiam,
                  GROUP_CONCAT(img.images) AS images,
                  hdc.so_luong AS soLuong,
                  hdc.trang_thai AS trangThai,
                  hdc.ngay_tao AS ngayTao,
                  hdc.ngay_sua AS ngaySua,
                  hdc.nguoi_tao AS nguoiTao,
                  hdc.nguoi_sua AS nguoiSua
              FROM
                  hoa_don_chi_tiet hdc
                  JOIN chi_tiet_san_pham ctsp ON hdc.id_chi_tiet_san_pham = ctsp.id
                  JOIN san_pham sp ON sp.id = ctsp.id_san_pham
                  JOIN mau_sac ms ON ms.id = ctsp.id_mau_sac
                  JOIN kich_co kc ON kc.id = ctsp.id_kich_co
                  JOIN chat_lieu cl ON cl.id = ctsp.id_chat_lieu
                  JOIN thuong_hieu th ON th.id = ctsp.id_thuong_hieu
                  LEFT JOIN (
                      SELECT
                          id_chi_tiet_san_pham,
                          GROUP_CONCAT(DISTINCT anh.anh) AS images
                      FROM anh
                      GROUP BY id_chi_tiet_san_pham
                  ) img ON img.id_chi_tiet_san_pham = ctsp.id
                  LEFT JOIN spct_khuyen_mai spctkm ON spctkm.id_chi_tiet_san_pham = ctsp.id
                  LEFT JOIN dot_giam_gia dgg ON dgg.id = spctkm.id_dot_giam_gia
                  WHERE hdc.id_hoa_don =:#{#req.hoaDon}
              AND :#{#req.trangThai} IS NULL OR hdc.trang_thai = :#{#req.trangThai}
              GROUP BY
                  hdc.id, sp.ten, ms.ten, kc.ten, cl.ten, th.ten, ctsp.maCTSP, hdc.don_gia,
                  hdc.so_luong, hdc.trang_thai, hdc.ngay_tao, hdc.ngay_sua, hdc.nguoi_tao,
                  hdc.nguoi_sua, img.images, dgg.trang_thai, spctkm.gia_moi
                      """, nativeQuery = true)
    Page<HoaDonChiTietResponse> getAllHoaDonChiTiet(@Param("req") BillDetailRequest req, Pageable pageable);

    // Hàm này dùng để lấy ra hóa đơn chi tiết qua id hóa đơn
    @Query("SELECT hdct FROM HoaDonChiTiet hdct WHERE hdct.hoaDon.id =: id")
    HoaDonChiTiet findHoaDonChiTiet(@Param("id") Integer id);


    // Hàm này dùng để lấy ra danh sách hóa đơn chi tiết thông qua hóa đơn và trạng thái
    List<HoaDonChiTiet> findByHoaDonAndTrangThai(HoaDon hoaDon, String trangThai);


    @Query(value = "SELECT * FROM hoa_don_chi_tiet WHERE id_hoa_don = :idHoaDon", nativeQuery = true)
    List<HoaDonChiTiet> findByHoaDonId(Integer idHoaDon);

    @Query(value = """
        SELECT h.* 
        FROM hoa_don_chi_tiet h 
        LEFT JOIN chi_tiet_san_pham s ON s.id = h.id_chi_tiet_san_pham
        LEFT JOIN hoa_don hd ON hd.id = h.id_hoa_don
        WHERE s.maCTSP =:maSPCT AND h.id_hoa_don =:hoaDon
    """, nativeQuery = true)
    HoaDonChiTiet findChiTietSanPhamMaAndHoaDonID(@Param("maSPCT") String maSPCT,@Param("hoaDon") Integer hoaDon);

}
