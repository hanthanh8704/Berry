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
                    ROW_NUMBER() OVER(ORDER BY sp.ngay_tao DESC) AS indexs,
                    hdc.id AS id,
                    CONCAT(sp.ten, ' [', ms.ten, ' - ', kc.ten, ']') AS name,
                    ctsp.maCTSP AS maSPCT,
                    ms.ten AS mauSac,
                    kc.ten AS kichCo,
                    cl.ten AS chatLieu,
                    th.ten AS thuongHieu,
                    hdc.don_gia AS gia,
                    img.anh AS anh,
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
                    LEFT JOIN (SELECT id, GROUP_CONCAT(anh) AS anh FROM anh GROUP BY id) img ON ctsp.id_anh = img.id
                WHERE 
                    (:#{#req.idHoaDon} IS NULL OR hdc.id_hoa_don = :#{#req.idHoaDon})
                    AND (:#{#req.trangThai} IS NULL OR hdc.trang_thai LIKE CONCAT('%', :#{#req.trangThai}, '%'))
                GROUP BY 
                    hdc.id, sp.ten, ms.ten, kc.ten, ctsp.maCTSP, cl.ten, th.ten, hdc.don_gia, img.anh, hdc.so_luong, hdc.trang_thai
            """, nativeQuery = true)
    Page<HoaDonChiTietResponse> getAllHoaDonChiTiet(@Param("req") BillDetailRequest req, Pageable pageable);

    // Hàm này dùng để lấy ra hóa đơn chi tiết qua id hóa đơn
    @Query("SELECT hdct FROM HoaDonChiTiet hdct WHERE hdct.hoaDon.id =: id")
    HoaDonChiTiet findHoaDonChiTiet(@Param("id") Integer id);


    // Hàm này dùng để lấy ra danh sách hóa đơn chi tiết thông qua hóa đơn và trạng thái
    List<HoaDonChiTiet> findByHoaDonAndTrangThai(HoaDon hoaDon, String trangThai);


    @Query(value = "SELECT * FROM hoa_don_chi_tiet WHERE id_hoa_don = :idHoaDon", nativeQuery = true)
    List<HoaDonChiTiet> findByHoaDonId(Integer idHoaDon);
}
