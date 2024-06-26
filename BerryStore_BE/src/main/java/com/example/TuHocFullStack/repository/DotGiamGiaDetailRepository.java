package com.example.TuHocFullStack.repository;

import com.example.TuHocFullStack.entity.DotGiamGiaDetail;
import com.example.TuHocFullStack.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DotGiamGiaDetailRepository  extends JpaRepository<DotGiamGiaDetail, Integer> {
    @Query(value = "select d from DotGiamGiaDetail d join d.idDotGiamGia DGG where DGG.id = :idDGG")
    List<DotGiamGiaDetail> findByIdDotGiamGia(@Param("idDGG") Integer idDGG);

}
