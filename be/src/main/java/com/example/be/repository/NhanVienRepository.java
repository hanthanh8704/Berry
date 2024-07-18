package com.example.be.repository;

import com.example.be.dto.request.nhanVien.NhanVienRequest;
import com.example.be.dto.response.NhanVienResponse;
import com.example.be.entity.NhanVien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Integer> {
    boolean existsByEmail(String email);

    @Query(value = """
            select  
            a.id as id,
            r.vai_tro as chucVu,
            ac.id as account,
            a.ten as ten,
            a.ma as ma,
            a.email as email,
            a.anh as anh,
            a.gioi_tinh as gioiTinh,
            a.ngay_sinh as ngaySinh,
            a.so_dien_thoai as soDienThoai,
            a.cccd as cccd,
            a.dia_chi_cu_the as diaChi,
            a.trang_thai as trangThai,
            a.deleted as deleted,
            a.ngay_tao as ngayTao,
            a.ngay_sua as ngaySua,
            ROW_NUMBER() OVER(ORDER BY a.ngay_tao ASC) AS indexs
            from nhan_vien a
            left join chuc_vu r on r.id = a.id_chuc_vu
            left join account ac on ac.id=a.account_id
            where (:#{#req.ten} is null
            or a.ten like %:#{#req.ten}% 
            or a.ma like %:#{#req.ten}% 
            or a.cccd like %:#{#req.ten}% 
            or a.email like %:#{#req.ten}%
            or a.so_dien_thoai like %:#{#req.ten}%)
            and (:#{#req.idChucVu} is null or r.id = :#{#req.idChucVu})
            and (:#{#req.trangThai} is null or a.trang_thai = :#{#req.trangThai})
            group by a.id
            """, nativeQuery = true)
    Page<NhanVienResponse> getAll(@Param("req") NhanVienRequest req, Pageable pageable);

    Boolean existsBySoDienThoai(String soDienThoai);

    boolean existsByMa(String ma);

    @Query(value = """
            SELECT a.id AS id,
                   ROW_NUMBER() OVER(ORDER BY a.ngay_tao DESC) AS indexs,
                   a.ten AS ten,
                   a.ma AS ma,
                   a.email AS email,
                   a.anh AS anh,
                   a.gioi_tinh AS gioiTinh,
                   a.ngay_sinh AS ngaySinh,
                   a.so_dien_thoai AS soDienThoai,
                   a.cccd AS cccd,
                   a.dia_chi_cu_the AS diaChi,
                   a.trang_thai AS trangThai
            FROM nhan_vien a
            WHERE a.id = :id
            """, nativeQuery = true)
    NhanVienResponse getOneNhanVien(@Param("id") Integer id);


}
