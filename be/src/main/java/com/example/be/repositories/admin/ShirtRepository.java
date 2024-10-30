package com.example.be.repositories.admin;

import com.example.be.dto.admin.request.product.ShirtSearchRequest;
import com.example.be.dto.admin.response.ShirtReponse;
import com.example.be.dto.admin.response.promotion.SpctKhuyenMaiResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.example.be.entities.*;
@Repository
public interface ShirtRepository extends JpaRepository<Product,Integer> {
    boolean existsByCode(String code); // Đổi từ 'existsByMa' thành 'existsByCode'

    @Query("""
            select sp from Product sp where sp.id = :id
            """)
    public Product findByIdProduct(Integer id); // Đổi từ 'findByIdSp' thành 'findByIdProduct'

    @Query(value = """
            SELECT
                sp.id AS id,
                sp.name AS name,
                sp.code AS code,
                SUM(ctsp.quantity) AS quantity,
                ROW_NUMBER() OVER (ORDER BY sp.created_at DESC) AS indexs,
                GROUP_CONCAT(DISTINCT ms.name) AS color,
                GROUP_CONCAT(DISTINCT kc.name) AS size,
                SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT img.url ORDER BY img.url), ',', 1) AS image,
                dm.name AS category,
                MIN(ctsp.price) AS minPrice,
                MAX(ctsp.price) AS maxPrice,
                sp.status AS status
            FROM product sp
            LEFT JOIN product_detail ctsp ON sp.id = ctsp.product_id
            LEFT JOIN color ms ON ctsp.color_id = ms.id
            LEFT JOIN size kc ON ctsp.size_id = kc.id
            LEFT JOIN category dm ON sp.category_id = dm.id
            LEFT JOIN (
                SELECT product_detail_id, 
                       GROUP_CONCAT(DISTINCT url) AS url
                FROM image 
                GROUP BY product_detail_id
            ) img ON ctsp.id = img.product_detail_id
            WHERE (:#{#req.name} IS NULL OR sp.name LIKE CONCAT('%', :#{#req.name}, '%')
                  OR sp.code LIKE CONCAT('%', :#{#req.name}, '%'))  
                  AND (:#{#req.category} IS NULL OR sp.category_id = :#{#req.category})
            GROUP BY
                sp.id,
                sp.code,
                sp.name,
                dm.name,
                sp.status
            """, nativeQuery = true)
    Page<ShirtReponse> getAllProducts(@Param("req") ShirtSearchRequest request, Pageable pageable);


    @Query(value = """
            SELECT
                sp.id AS id,
                sp.name AS name,
                sp.code AS code,
                ROW_NUMBER() OVER(ORDER BY sp.created_at DESC) AS indexs,
                dm.name AS category,
                dgg.new_price AS newPrice
            FROM product sp
            LEFT JOIN product_detail spct ON sp.id = spct.product_id
            LEFT JOIN category dm ON dm.id = sp.category_id
            LEFT JOIN promotion_detail spctkm ON spctkm.product_detail_id = spct.id
            LEFT JOIN discount dgg ON dgg.id = spctkm.discount_id
            WHERE (:promotion IS NULL OR dgg.id = :promotion)
    """, nativeQuery = true)
    List<SpctKhuyenMaiResponse> getAllProductsInPromotion(@Param("promotion") Integer promotion);

    @Query(value = """
            SELECT
                s.id AS id, 
                s.name AS name, 
                ROW_NUMBER() OVER(ORDER BY SUM(bd.quantity) DESC) AS indexs,
                SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT img.name ORDER BY img.name), ',', 1) AS image,
                ct.name AS category, 
                MAX(sd.price) AS maxPrice, 
                MIN(sd.price) AS minPrice, 
                SUM(bd.quantity) AS quantity, 
                s.deleted AS status 
            FROM shoe s 
            LEFT JOIN shoe_detail sd ON s.id = sd.shoe_id 
            LEFT JOIN category ct ON ct.id = s.category_id 
            LEFT JOIN (SELECT shoe_detail_id, 
                       GROUP_CONCAT(DISTINCT name) AS name FROM images GROUP BY shoe_detail_id) img ON sd.id = img.shoe_detail_id
            LEFT JOIN bill_detail bd ON bd.shoe_detail_id = sd.id
            LEFT JOIN bill b ON b.id = bd.bill_id
            WHERE s.deleted = FALSE AND b.status = 6
            GROUP BY s.id
            ORDER BY SUM(bd.quantity) DESC
            LIMIT :top
    """, nativeQuery = true)
    List<ShirtReponse> topSellingProducts(@Param("top") Integer top); // Đổi từ 'topSell' thành 'topSellingProducts'

    Boolean existsByNameIgnoreCase(String name); // Đổi từ 'existsByTenIgnoreCase' thành 'existsByNameIgnoreCase'

    Product findByName(String name); // Đổi từ 'findByTen' thành 'findByName'


}
