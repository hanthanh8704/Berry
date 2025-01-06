package com.example.be.repositories.client;

import com.example.be.entities.Image;
import com.example.be.entities.Product;
import com.example.be.entities.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductRepositoryClient extends JpaRepository<Product, Integer> {

    @Query("SELECT sp FROM Product sp " +
            "JOIN ProductDetail pd ON sp.id= pd.product.id " +  // LEFT JOIN FETCH để tải dữ liệu SPCT cùng với ảnh
            "WHERE pd.id = :idSPCT")
    Product findAllByIdSPCT(@Param("idSPCT") Integer idSPCT);
    @Query("select pc from  ProductDetail pc  where pc.createdAt >= :oneWeekAgo and pc.product.id =:id")
    List<ProductDetail> findAllByNewProductDetail(@Param("oneWeekAgo") LocalDateTime oneWeekAgo , @Param("id") Integer idSP);
    @Query("SELECT spct FROM ProductDetail spct " +
            "JOIN spct.product sp " +
            "WHERE sp.id = :idSP")
    List<ProductDetail> findAllSPCTBySanPhamId(@Param("idSP") Integer idSP);

    @Query("SELECT anh FROM Image anh " +
            "JOIN FETCH anh.productDetail spct " +  // LEFT JOIN FETCH để tải dữ liệu SPCT cùng với ảnh
            "WHERE spct.id = :idSPCT")
    List<Image> findAllAnhBySanPhamCTId(@Param("idSPCT") Integer idSPCT);


    //Hien thi san pham theo idDM
    @Query("SELECT sp FROM Product sp " +
            "JOIN FETCH sp.category dm " +  // LEFT JOIN FETCH để tải dữ liệu SPCT cùng với ảnh
            "WHERE dm.id = :idDM ORDER BY sp.createdAt DESC ")
    List<Product> findAllByIdDanhMuc(@Param("idDM") Integer idDM);
    @Query("SELECT spct FROM ProductDetail spct WHERE spct.product.id = :idSP")
    List<ProductDetail> findByIdSP(@Param("idSP") Integer idSP);

    //Clinet

    @Query("SELECT sp FROM Product sp " +
            "WHERE sp.id IN :idSP")
    List<Product> findByIds(@Param("idSP") List<Integer> idSP);
    @Query("select sp from ProductDetail sp where sp.color.id = :idMau and sp.size.id = :idSize and sp.product.id = :idSP")
    ProductDetail findByIdMauSacAndIdKichCo(@Param("idMau") Integer idMau, @Param("idSize") Integer idSize, @Param("idSP") Integer idSP);
    @Query("select pc from  Product pc join ProductDetail p on p.product.id = pc.id where p.createdAt >= :oneWeekAgo ")
    List<Product> findAllByNewProduct(@Param("oneWeekAgo") LocalDateTime oneWeekAgo);

    @Query("SELECT DISTINCT spct.product FROM ProductDetail spct " +
            "JOIN ProductDetailPromotion pd ON spct.id = pd.productDetail.id " +
            "JOIN Promotion pr ON pr.id = pd.promotion.id " +
            "WHERE spct.discountPercentage = :discount")
    List<Product> findProductsWithDiscount(@Param("discount") Integer discount);


}
