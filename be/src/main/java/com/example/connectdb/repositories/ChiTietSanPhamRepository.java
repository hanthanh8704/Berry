package com.example.connectdb.repositories;

import com.example.connectdb.dto.response.CTSPResponse;
import com.example.connectdb.entity.ChiTietSanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChiTietSanPhamRepository extends JpaRepository<ChiTietSanPham,Integer> {

//    @Query(value = """
//
//            """, nativeQuery = true)
//    Page<CTSPResponse> getAll(@Param("req") FindShoeDetailRequest request, Pageable pageable);

}
