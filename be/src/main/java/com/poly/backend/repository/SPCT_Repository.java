package com.poly.backend.repository;


import com.poly.backend.entity.English.Product;
import com.poly.backend.entity.English.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SPCT_Repository extends JpaRepository<ProductDetail, Integer> {
    //Hiển thị tất cả sản phẩm mới về theo biến thể sản phẩm
    @Query("select pc from  ProductDetail pc  where pc.createdAt >= :oneWeekAgo and pc.product.id =:id")
    List<ProductDetail> findAllByNewProductDetail(@Param("oneWeekAgo") LocalDateTime oneWeekAgo , @Param("id") Integer idSP);
    @Query("select pc from  Product pc join ProductDetail p on p.product.id = pc.id where p.createdAt >= :oneWeekAgo ")
    List<Product> findAllByNewProduct(@Param("oneWeekAgo") LocalDateTime oneWeekAgo);

    //Hien thị san pham chi tiet theo id san pham
    @Query("SELECT spct FROM ProductDetail spct " +
            "LEFT JOIN spct.product d " +
            "WHERE d.id = :idSP")
    List<ProductDetail> getAllByIdSP(@Param("idSP") Integer idSP);
    //Hiên thị sản phâpmr chi tiết liên quan

    @Query("SELECT spct FROM ProductDetail spct WHERE spct.product.id = :idSP")
    List<ProductDetail> findByIdSP(@Param("idSP") Integer idSP);


    //Tim theo idMauSac va idKichCo
    @Query("select sp from ProductDetail sp where sp.color.id = :idMau and sp.size.id = :idSize and sp.product.id = :idSP")
    ProductDetail findByIdMauSacAndIdKichCo(@Param("idMau") Integer idMau, @Param("idSize") Integer idSize, @Param("idSP") Integer idSP);

}