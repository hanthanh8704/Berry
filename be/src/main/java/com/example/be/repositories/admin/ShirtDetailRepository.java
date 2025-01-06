package com.example.be.repositories.admin;

import com.example.be.app.dto.response.GetProductDetailBillResponse;
import com.example.be.dto.admin.request.productDetail.FindShirtDetailRequest;
import com.example.be.dto.admin.response.ShirtDetailResponse;
import com.example.be.entities.Product;
import com.example.be.entities.ProductDetail;
import com.example.be.utils.constant.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface ShirtDetailRepository extends JpaRepository<ProductDetail, Integer> {
    // Phương thức để tìm giá tối thiểu và tối đa
    @Query("SELECT "
            + "MIN(p.price) AS minPrice, "
            + "MAX(p.price) AS maxPrice "
            + "FROM ProductDetail p "
            + "WHERE p.deleted = false") // Chỉ tính các sản phẩm không bị xóa
    Map<String, BigDecimal> findMinAndMaxPrice();

    // Phương thức để lấy chi tiết áo theo id
    @Query("SELECT s FROM ProductDetail s WHERE s.id = ?1 AND s.deleted = false") // Chỉ lấy sản phẩm không bị xóa
    ShirtDetailResponse getOneShoeDetail(Integer id);

    Boolean existsByDetailCodeAndDetailCodeNot(String detailCode, String currentDetailCode);

    @Query(value = "SELECT * FROM product_detail pd WHERE pd.detail_code = :detailCode",nativeQuery = true)
    ProductDetail findByDetailCode(@Param("detailCode") String detailCode);

    boolean existsByDetailCode(String detailCode);

    List<ProductDetail> findByProduct(Product product);

    @Query(value = """
            SELECT
                spct.id AS id,
                ROW_NUMBER() OVER (ORDER BY sp.updated_at DESC) AS indexs,
                CONCAT(sp.name, ' [', ms.name, ' - ', kt.name, ']') AS name,
                spct.detail_code AS detailCode,
                cl.name AS material,
                ms.name AS color,
                kt.name AS size,
                th.name AS brand,
                spct.quantity AS quantity,
                spct.price AS price,
                spct.discount_price AS discountPrice,
                spct.discount_percentage AS discountPercentage,
                spct.weight AS weight,
                spct.quantity_error AS quantityError,
                ta.name AS sleeve,
                ca.name AS collar,
                spct.status AS status,
                GROUP_CONCAT(DISTINCT img.url) AS images,
                spct.deleted AS deleted
            FROM
                product_detail spct
                LEFT JOIN product sp ON spct.product_id = sp.id
                LEFT JOIN color ms ON spct.color_id = ms.id
                LEFT JOIN size kt ON spct.size_id = kt.id
                LEFT JOIN material cl ON spct.material_id = cl.id
                LEFT JOIN sleeve ta ON spct.sleeve_id = ta.id
                LEFT JOIN collar ca ON spct.collar_id = ca.id
                LEFT JOIN brand th ON spct.brand_id = th.id
                LEFT JOIN image img ON img.product_detail_id = spct.id
            WHERE
                spct.quantity > 0 
                AND (:#{#req.products} IS NULL OR spct.product_id IN (:#{#req.products}))
                AND (:#{#req.colors} IS NULL OR :#{#req.colors} = '' OR spct.color_id IN (:#{#req.colors}))
                AND (:#{#req.sizes} IS NULL OR :#{#req.sizes} = '' OR spct.size_id IN (:#{#req.sizes}))
                AND (:#{#req.sleeves} IS NULL OR :#{#req.sleeves} = '' OR spct.sleeve_id IN (:#{#req.sleeves}))
                AND (:#{#req.materials} IS NULL OR :#{#req.materials} = '' OR spct.material_id IN (:#{#req.materials}))
                AND (:#{#req.brands} IS NULL OR :#{#req.brands} = '' OR spct.brand_id IN (:#{#req.brands}))
                AND (:#{#req.name} IS NULL OR :#{#req.name} = ''
                    OR CONCAT(sp.name, ' ', ms.name, ' ', kt.name, ' ', cl.name, ' ', ta.name, ' ', ca.name, ' ', th.name) LIKE %:#{#req.name}%)
            GROUP BY
                spct.id, sp.updated_at, spct.detail_code, sp.name, ms.name, kt.name, cl.name,
                spct.quantity, spct.price, spct.weight, ta.name, ca.name, th.name,spct.quantity_error,
                spct.discount_price, spct.deleted
            ORDER BY
                spct.created_at DESC;
                        """,
            nativeQuery = true)
    Page<ShirtDetailResponse> getAll(@Param("req") FindShirtDetailRequest request, Pageable pageable);

    @Query(value = """
            SELECT
                spct.id AS id,
                ROW_NUMBER() OVER(ORDER BY sp.created_at ASC) AS indexs,
                CONCAT(sp.name, ' [', ms.name, ' - ', kt.name, ']') AS name,
                spct.detail_code AS detailCode,
                cl.name AS material,
                ms.name AS color,
                kt.name AS size,
                th.name AS brand,
                spct.quantity AS quantity,
                spct.price AS price,
                spct.weight as weight,
                ta.name AS sleeve,
                ca.name AS collar,
                spct.status AS status,
                CASE
                    WHEN CURRENT_TIMESTAMP BETWEEN dgg.start_date AND dgg.end_date THEN spct_discount.new_price
                    ELSE NULL
                END AS discountedValue,
                GROUP_CONCAT(DISTINCT img.image) AS images,
                spct.deleted AS deleted
            FROM
                product_detail spct
                LEFT JOIN product sp ON spct.product_id = sp.id
                LEFT JOIN color ms ON spct.color_id = ms.id
                LEFT JOIN size kt ON spct.size_id = kt.id
                LEFT JOIN material cl ON spct.material_id = cl.id
                LEFT JOIN sleeve ta ON spct.sleeve_id = ta.id
                LEFT JOIN collar ca ON spct.collar_id = ca.id
                LEFT JOIN brand th ON spct.brand_id = th.id
                LEFT JOIN image img ON img.product_detail_id = spct.id
                LEFT JOIN product_discount spct_discount ON spct_discount.product_detail_id = spct.id
                LEFT JOIN discount dgg ON dgg.id = spct_discount.discount_id
            WHERE spct.id = :id
            GROUP BY
                spct.id, sp.updated_at, spct.detail_code, sp.name, ms.name, kt.name, cl.name, spct.quantity, spct.price, dgg.start_date, dgg.end_date, spct_discount.new_price;
            """, nativeQuery = true)
    ShirtDetailResponse getOneShirtDetail(@Param("id") Integer id);

    ProductDetail findByProduct_IdAndColor_IdAndSize_IdAndMaterial_IdAndCollar_IdAndSleeve_Id(
            Integer productId,
            Integer colorId,
            Integer sizeId,
            Integer materialId,
            Integer collarId,
            Integer sleeveId
    );

    ProductDetail findByProduct_IdAndColor_NameAndSize_Name(
            Integer productId,
            String colorName,
            String sizeName
    );

    /**
     * Thầy Ninh nói chỗ này liên quan đến bán hàng
     */
    @Query(value = """
        SELECT * FROM product_detail WHERE detail_code LIKE :ma
    """, nativeQuery = true)
    ProductDetail findByMaSPCT(String ma);


    /**
     * Hàm này liên quan đến làm app
     */
    @Query(value = """
                      SELECT
                MAX(pr.discount_percentage) as value,
                      CONCAT(p.name, ' ', m.name) as nameProduct,
                      bd.id as idBillDetail,
                         pd.id as id,
                         MAX(i.url) as image ,
                       MAX(pd.price) as price,
                       MAX(pd.weight) as weight,
                       MAX(bd.quantity) as quantity,
                       pd.product_id,
                       pd.size_id
                   FROM product_detail pd
                   left join bill_detail bd on bd.product_detail_id = pd.id
                   left join bill b on b.id = bd.bill_id
                   left join product p on p.id = pd.product_id
                   left join material m on m.id = pd.material_id
                   left join size s on s.id = pd.size_id
                   left join image i on i.product_detail_id = pd.id
                   left join product_detail_promotion pp on pp.product_detail_id = pd.id
                  left join promotion pr on pr.id = pp.promotion_id and pr.status = 1
                  where b.id = :id
                   GROUP BY pd.id,  pd.product_id, pd.size_id,bd.id
            """, nativeQuery = true)
    List<GetProductDetailBillResponse> getlistProductBilllSell(Integer id);




    // Hàm này của thanh

    @Query(value = """
        select pd from ProductDetail pd
        join Product p on p.id = pd.product.id
        where pd.id = :id and pd.discountPrice >= :quantity
        and pd.deleted = :status and p.deleted = :status
        """)
    Optional<ProductDetail> checkQuantity(@Param("id") String id, Integer quantity, Status status);

}
