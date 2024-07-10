package com.example.be.repository;

import com.example.be.entity.ChiTietSanPham;
import com.example.be.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepositoty extends JpaRepository<SanPham,Integer> {
    //Của Đức
    @Query("SELECT spct FROM ChiTietSanPham spct " +
            "JOIN spct.sanPham sp " +
            "LEFT JOIN DotGiamGiaDetail dt ON dt.idSPCT.id = spct.id " +
            "WHERE sp.id = :idSP AND (dt.idSPCT.id IS NULL OR dt.trangThai like 'Đã kết thúc') ")
    List<ChiTietSanPham> findAllBySanPhamId(@Param("idSP") Integer idSP);
}
