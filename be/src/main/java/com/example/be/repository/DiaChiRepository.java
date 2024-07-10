package com.example.be.repository;

import com.example.be.dto.response.DiaChiResponse;
import com.example.be.entity.DiaChi;
import com.example.be.entity.KhachHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaChiRepository extends JpaRepository<DiaChi,Integer> {
    @Query("SELECT d FROM DiaChi d WHERE d.idKhachHang.id = :idKhachHang AND d.deleted = false")
    List<DiaChi> findAllByIdKhachHangAndDeletedFalse(Integer idKhachHang);

    @Query(value = "SELECT d.id, d.ho_ten, d.so_dien_thoai, d.thanh_pho, d.huyen, d.phuong, d.dia_chi_cu_the, d.trang_thai " +
            "FROM dia_chi d WHERE d.id_khach_hang = :idKhachHang", nativeQuery = true)
    List<DiaChiResponse> findAllByIdKhachHang(@Param("idKhachHang") Integer idKhachHang);
//
//    Page<DiaChi> findByAccountIdAndDeleted(Integer id, Boolean deleted, Pageable pageable);
//
//    DiaChi findByAccountIdAndDefaultAddress(Integer id, Boolean defaultAddress);

    @Query(value = """
             SELECT
                                     a.id AS id,
                                     a.ho_ten AS hoTen,
                                     a.huyen AS huyen,
                                     a.phuong AS phuong,
                                     a.thanh_pho AS thanhPho,
                                     a.so_dien_thoai AS soDienThoai,
                                     a.dia_chi_mac_dinh AS diaChiMacDinh,
                                     a.dia_chi_cu_the AS diaChiCuThe,
                                     a.trang_thai AS trangThai,
                                     a.id_khach_hang as idKhachHang,
                                     ROW_NUMBER() OVER(ORDER BY a.ngay_tao DESC) AS indexs
                                     FROM dia_chi a
                         LEFT JOIN khach_hang ac on ac.id = a.id_khach_hang
             WHERE a.id_khach_hang = :id
            GROUP BY a.id,a.ho_ten,a.huyen,a.phuong,a.thanh_pho,a.trang_thai,a.id_khach_hang, a.dia_chi_mac_dinh,a.dia_chi_cu_the
             """, nativeQuery = true)
    Page<DiaChiResponse> getAddress(@Param("id") Integer id, Pageable pageable);

    @Query(value = "SELECT * FROM dia_chi WHERE id_khach_hang = :idKhachHang", nativeQuery = true)
    List<DiaChi> findByIdKhachHang(@Param("idKhachHang") Integer idKhachHang);


//    DiaChi findByIdKhachHangAndDiaChiMacDinh(Integer idKhachHang, Boolean diaChiMacDinh);
}
