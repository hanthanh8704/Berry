//package com.example.be.repository;
//
//import com.example.be.dto.request.khachhang.KhachhangRequest;
//import com.example.be.dto.request.nhanVien.NhanVienRequest;
//import com.example.be.dto.response.NhanVienResponse;
//import com.example.be.entity.KhachHang;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import java.util.Optional;
//
//@Repository
//public interface KhachHangRepository extends JpaRepository<KhachHang,Integer> {
////    @Query(value = """
////            select
////            a.id as id,
////            a.ho_ten as ten,
////            a.ma as ma,
////            a.email as email,
////            a.anh as anh,
////            a.gioi_tinh as gioiTinh,
////            a.so_dien_thoai as soDienThoai,
////            a.tai_khoan as taiKhoan,
////            a.trang_thai as trangThai,
////            a.deleted as deleted,
////            a.ngay_tao as ngayTao,
////            a.ngay_sua as ngaySua,
////            ROW_NUMBER() OVER(ORDER BY a.ngay_tao DESC) AS indexs
////            from khach_hang a
////            where (:#{#req.ten} is null
////            or a.ho_ten like %:#{#req.ten}%
////            or a.email like %:#{#req.ten}%
////            or a.tai_khoan like %:#{#req.ten}%
////            or a.so_dien_thoai like %:#{#req.ten}%)
////            and (:#{#req.trangThai} is null or a.deleted = :#{#req.trangThai})
////            group by a.id
////            """, nativeQuery = true)
////    Page<KhachhHangResponse> getAll(@Param("req") KhachhangRequest req, Pageable pageable);
//@Query("""
//            SELECT a FROM KhachHang a
//            WHERE a.id = :id
//            """)
//KhachHang getOne(@Param("id") Long id);
//
//    @Query(value = """
//            select
//            a.id as id,
//            a.ho_ten as ten,
//            a.ma as ma,
//            a.email as email,
//            a.anh as anh,
//            a.gioi_tinh as gioiTinh,
//            a.so_dien_thoai as soDienThoai,
//            a.tai_khoan as taiKhoan,
//            a.trang_thai as trangThai,
//            a.deleted as deleted,
//            ROW_NUMBER() OVER(ORDER BY a.ngay_tao DESC) AS indexs
//            from khach_hang a
//            where (:#{#req.ten} is null
//            or a.ho_ten like %:#{#req.ten}%
//            or a.email like %:#{#req.ten}%
//            or a.tai_khoan like %:#{#req.ten}%
//            or a.so_dien_thoai like %:#{#req.ten}%)
//            and (:#{#req.trangThai} is null or a.deleted = :#{#req.trangThai})
//            group by a.id
//            """, nativeQuery = true)
//    Page<KhachhHangResponse> getAll(@Param("req") KhachhangRequest request, Pageable pageable);
//
//    Boolean existsByTaiKhoanAndTaiKhoanNot(String username, String exceptUsername);
//
//    Boolean existsByEmailAndEmailNot(String email, String exceptEmail);
//
//    Boolean existsBySoDienThoaiAndSoDienThoai(String phoneNumber, String exceptPhoneNumber);
//
////    Boolean existsByCccdAndCccdNot(String cccd, String exceptCccd);
//
//    @Query("SELECT ac FROM KhachHang ac WHERE ac.email =:email")
//    Optional<KhachHang> findByEmail(String email);
//
//
//}
