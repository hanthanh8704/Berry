package com.example.be.repositories.admin;

import com.example.be.dto.admin.response.ImageResponse;
import com.example.be.entities.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IImagesRepository extends JpaRepository<Image, Integer> {
    @Query(value = """
            SELECT i.id AS id, i.url AS url FROM image i
            WHERE i.product_detail_id = :product_detail_id
            """, nativeQuery = true) // Sửa tên bảng và thuộc tính
    List<ImageResponse> getImagesByProductDetail(@Param("product_detail_id") Integer product_detail_id); // Sửa tên tham số
}
