package com.example.TuHocFullStack.repository;

import com.example.TuHocFullStack.entity.SPCT;
import com.example.TuHocFullStack.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SPCT_Repository  extends JpaRepository<SPCT, Integer> {
//    @Query(value = "select spct from SPCT spct where spct.idSanPham = :idSP", nativeQuery = true)
//    List<SPCT> findAllByIdSanPham(@Param("idSP") Integer idSP);

}
