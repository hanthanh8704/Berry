//package com.example.connectdb.repositories;
//
//import com.example.connectdb.dto.response.ImageResponse;
//import com.example.connectdb.entity.Anh;
//import com.poly.backend.entity.Anh;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.util.List;
//
//public interface IImagesRepository extends JpaRepository<Anh, Integer> {
//    @Query(value = """
//            SELECT i.id AS id, i.anh AS ten FROM Anh i
//            WHERE i.id_chi_tiet_san_pham = :id_chi_tiet_san_pham
//            """, nativeQuery = true)
//    List<ImageResponse> getImagesByShoeDetail(@Param("id_chi_tiet_san_pham") Integer id_chi_tiet_san_pham);
//}