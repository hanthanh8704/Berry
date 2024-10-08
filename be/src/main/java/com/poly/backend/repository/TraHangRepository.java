//package com.poly.backend.repository;
//
//import com.poly.backend.entity.HoaDon;
//import com.poly.backend.entity.HoaDonChiTiet;
//import com.poly.backend.entity.SPCT;
//import com.poly.backend.entity.TraHang;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import java.util.List;
//
//@Repository
//public interface TraHangRepository extends JpaRepository<TraHang,Integer> {
//    //Hien thi san pham lien quan qua ma hoa don
//    @Query("select hdct from HoaDonChiTiet hdct join SPCT spct on hdct.chiTietSanPham.id = spct.id " +
//            "join HoaDon hd on hd.id = hdct.hoaDon.id where hd.id = :idHD")
//    List<HoaDonChiTiet> findAllSPCTByIdHoaDon(@Param("idHD") Integer idHD);
//    @Query("select hd from HoaDon hd where hd.ma =:maHD")
//    HoaDon findHDByMa(@Param("maHD") String maHD);
//
//    //Hien thi ra 1 san pham CT theo id
//
//    // Hiển thị thông tin hoàn trả theo maHD
//    @Query("select hd from HoaDon hd where hd.ma = :maHD")
//    List<HoaDon> findAllHDByMaHoaDon(@Param("maHD") String maHD);
//
//    //Chức năng trả hàng
//
//}
