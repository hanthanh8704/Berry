package com.example.be.app.client_app.repository;


import com.example.be.app.client_app.dto.request.*;
import com.example.be.app.client_app.dto.response.*;
import com.example.be.entities.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientProductDetailRepository extends JpaRepository<ProductDetail,Integer> {
    @Query(value = """
                SELECT MAX(pd.id) as id,
                MAX( pr.id) as promotion ,
                MAX( pr.status) as statusPromotion ,
                MAX(pr.discount_percentage) as value,
                       CONCAT(p.name, ' ', m.name, ' ', c.name,'"') AS name,
                       ca.name as nameCate,
                       b.name as nameBrand,
                       MAX(pd.price) as price,
                       MAX(pd.weight) as weight,
                       MAX(pd.discount_price) as amount,
                       GROUP_CONCAT(DISTINCT i.url) as image,
                       pd.product_id,
                       pd.color_id,
                       pd.material_id,
                       p.category_id,
                       pd.brand_id
                FROM product_detail pd
                         JOIN
                     product p ON p.id = pd.product_id
                         JOIN
                     color c ON c.id = pd.color_id
                         JOIN
                     category ca ON ca.id = p.category_id
                         JOIN
                     brand b ON b.id = pd.brand_id
                         JOIN
                     material m ON m.id = pd.material_id
                         LEFT JOIN
                     image i ON pd.id = i.product_detail_id
                     LEFT JOIN product_detail_promotion pp ON pd.id = pp.product_detail_id
                         LEFT JOIN promotion pr ON pr.id = pp.promotion_id
                WHERE p.deleted = 0 AND pd.deleted = 0 AND pd.discount_price > 0 AND (:#{#request.id} is null or pd.id = :#{#request.id})
                AND (:#{#request.category} IS NULL OR ca.id IN (:#{#request.category}))
                AND (:#{#request.color} IS NULL  OR c.id IN (:#{#request.color}))
                AND (:#{#request.material} IS NULL  OR m.id IN (:#{#request.material}))
                AND (:#{#request.brand} IS NULL OR b.id IN (:#{#request.brand}))
                AND( (:#{#request.nameProductDetail} IS NULL OR p.name like %:#{#request.nameProductDetail}%)
                OR (:#{#request.nameProductDetail} IS NULL OR ca.name like %:#{#request.nameProductDetail}%)
                OR (:#{#request.nameProductDetail} IS NULL OR c.name like %:#{#request.nameProductDetail}%)
                OR (:#{#request.nameProductDetail} IS NULL OR m.name like %:#{#request.nameProductDetail}%))
                GROUP BY pd.product_id, pd.color_id, pd.material_id, p.category_id, pd.brand_id
            """, nativeQuery = true)
    List<ClientProductResponse> getProducts(@Param("request") ClientProductRequest request);

    @Query(value = """
  SELECT
                    pd.id as id,
                    MAX(pr.discount_percentage) as value,
                    CONCAT(p.name, ' ', m.name, ' ', c.name) AS name,
                    ca.name as nameCate,
                    b.name as nameBrand,
                    c.hex_code as codeColor,
                    c.name as nameColor,
                    si.name as size,
                    pd.price as price,
                    pd.weight as weight,
                    pd.discount_price as amount,
                    GROUP_CONCAT(DISTINCT i.url) as image,
                       pd.product_id,
                       pd.color_id,
                       pd.material_id,
                       p.category_id,
                       pd.brand_id
                FROM product_detail pd
                        LEFT JOIN product_detail_promotion pp on pp.product_detail_id = pd.id
                        LEFT JOIN promotion pr on pr.id = pp.promotion_id 
                         JOIN
                     product p ON p.id = pd.product_id
                         JOIN
                     color c ON c.id = pd.color_id
                         JOIN
                     category ca ON ca.id = p.category_id
                         JOIN
					 size si ON si.id = pd.size_id
                         JOIN
                     brand b ON b.id = pd.brand_id
                         JOIN
                     material m ON m.id = pd.material_id
                         LEFT JOIN
                     image i ON pd.id = i.product_detail_id
                WHERE p.deleted = 0 AND pd.deleted = 0 AND pd.discount_price > 0
                AND (:#{#request.id} is null or pd.id = :#{#request.id})
                AND (:#{#request.minPrice} IS NULl OR pd.price >= :#{#request.minPrice})
                AND (:#{#request.maxPrice} IS NULl OR pd.price <= :#{#request.maxPrice})
                AND (:#{#request.category.size()} < 1 OR ca.id IN (:#{#request.category})) 
                AND (:#{#request.color.size()} < 1  OR c.id IN (:#{#request.color})) 
                AND (:#{#request.material.size()} < 1  OR m.id IN (:#{#request.material})) 
                AND (:#{#request.brand.size()} < 1 OR b.id IN (:#{#request.brand})) 
                AND( (:#{#request.nameProductDetail} IS NULL OR p.name like %:#{#request.nameProductDetail}%) 
                OR (:#{#request.nameProductDetail} IS NULL OR c.name like %:#{#request.nameProductDetail}%) 
                OR (:#{#request.nameProductDetail} IS NULL OR b.name like %:#{#request.nameProductDetail}%) 
                OR (:#{#request.nameProductDetail} IS NULL OR si.size like %:#{#request.nameProductDetail}%) 
                OR (:#{#request.nameProductDetail} IS NULL OR m.name like %:#{#request.nameProductDetail}%)) 
                GROUP BY pd.id
            """, nativeQuery = true)
    List<ClientProductResponse> getAllProductClient(@Param("request") ClientFindProductRequest request);
    @Query(value = """ 
                 select  pd.id as id,
                                        MAX(pr.discount_percentage) as value,
                                                        CONCAT(p.name, ' ', m.name, ' ', c.name) AS name,
                                                        ca.name as nameCate,
                                                        b.name as nameBrand,
                                                        c.hex_code as codeColor,
                                                        c.name as nameColor,
                                                        si.name as size,
                                                        pd.price as price,
                                                        pd.weight as weight,
                                                        sum(bd.quantity) as amount,
                                                        GROUP_CONCAT(DISTINCT i.url) as image,
                                    					pd.product_id,
                                    					pd.color_id,
                                    					pd.material_id,
                                    					p.category_id,
                                    					pd.brand_id
                                                    FROM product_detail pd
                                                            LEFT JOIN product_detail_promotion pp on pp.product_detail_id = pd.id
                                                            LEFT JOIN promotion pr on pr.id = pp.promotion_id
                                                             JOIN
                                                         product p ON p.id = pd.product_id
                                                             JOIN
                                                         color c ON c.id = pd.color_id
                                                             JOIN
                                                         category ca ON ca.id = p.category_id
                                                             JOIN
                                    					 size si ON si.id = pd.size_id
                                                             JOIN
                                                         brand b ON b.id = pd.brand_id
                                                             JOIN
                                                         material m ON m.id = pd.material_id
                                                             LEFT JOIN
                                                         image i ON pd.id = i.product_detail_id
                                                            join bill_detail bd on bd.product_detail_id = pd.id
                                                            join bill bi on bd.bill_id = bi.id and bi.invoice_status = 6
                                                    WHERE p.deleted = 0 AND pd.deleted = 0 AND pd.discount_price > 0
                                                    GROUP BY pd.id
                                                    ORDER BY discount_price DESC
            """, nativeQuery = true)
    List<ClientProductResponse> getSellingProduct(@Param("request") ClientProductRequest request);

    @Query(value = """ 
            SELECT
                pd.id AS id,
                MAX(pr.discount_percentage) AS value,
                CONCAT(p.name, ' ', m.name, ' ', c.name) AS name,
                pr.created_at AS timeRemainingInSeconds,
                ca.name AS nameCate,
                b.name AS nameBrand,
                c.hex_code AS codeColor,
                c.name AS nameColor,
                si.name AS size,
                pd.price AS price,
                pd.weight AS weight,
                pd.discount_price AS amount,
                GROUP_CONCAT(DISTINCT i.url) AS image,
                pd.product_id,
                pd.color_id,
                pd.material_id,
                p.category_id,
                pd.brand_id
            FROM
                product_detail pd
                LEFT JOIN product_detail_promotion pp ON pp.product_detail_id = pd.id
                LEFT JOIN promotion pr ON pr.id = pp.promotion_id
                JOIN product p ON p.id = pd.product_id
                JOIN color c ON c.id = pd.color_id
                JOIN category ca ON ca.id = p.category_id
                JOIN size si ON si.id = pd.size_id
                JOIN brand b ON b.id = pd.brand_id
                JOIN material m ON m.id = pd.material_id
                LEFT JOIN image i ON pd.id = i.product_detail_id
            WHERE
                p.deleted = 0
                AND pd.deleted = 0
                AND pd.discount_price > 0
            GROUP BY
                pd.id, pr.created_at
            HAVING
                value > 20
            ORDER BY
                value DESC
            LIMIT 0, 50;
                        """, nativeQuery = true)
    List<ClientProductResponse> getSaleProduct(@Param("request") ClientProductRequest request);

    @Query(value = """
              SELECT
                pd.id AS id,
                MAX(pr.discount_percentage) AS value,
                CONCAT(p.name, ' ', m.name, ' ', c.name) AS name,
                ca.name AS nameCate,
                b.name AS nameBrand,
                c.hex_code AS codeColor,
                c.name AS nameColor,
                si.name AS size,
                pd.price AS price,
                pd.weight AS weight,
                pd.discount_price AS amount,
                GROUP_CONCAT(DISTINCT i.url) AS image,
                pd.product_id,
                pd.color_id,
                pd.material_id,
                p.category_id,
                pd.brand_id
            FROM
                product_detail pd
                    LEFT JOIN
                product_detail_promotion pp ON pp.product_detail_id = pd.id
                    LEFT JOIN
                promotion pr ON pr.id = pp.promotion_id
                    JOIN
                product p ON p.id = pd.product_id
                    JOIN
                color c ON c.id = pd.color_id
                    JOIN
                category ca ON ca.id = p.category_id
                    JOIN
                size si ON si.id = pd.size_id
                    JOIN
                brand b ON b.id = pd.brand_id
                    JOIN
                material m ON m.id = pd.material_id
                    LEFT JOIN
                image i ON pd.id = i.product_detail_id
            WHERE
                p.deleted = 0 AND pd.deleted = 0
                    AND pd.discount_price > 0
            GROUP BY pd.id
            ORDER BY pd.created_at DESC
                        """, nativeQuery = true)
    List<ClientProductResponse> getProductsHome(@Param("request") ClientProductRequest request);

    @Query(value = """
                SELECT 
                       pd.id as id,
                       MAX(pr.value) as value,
                       CONCAT(p.name, ' ', m.name, ' ', s.name) AS name,
                       ca.name as nameCate,
                       b.name as nameBrand,
                       c.code as codeColor,
                       c.name as nameColor,
                       si.size as size,
                       pd.price as price,
                       pd.weight as weight,
                       pd.amount as amount,
                       pd.description as description,
                       GROUP_CONCAT(DISTINCT i.url) as image,
                       pd.id_product,
                       pd.id_color,
                       pd.id_material,
                       pd.id_sole,
                       pd.id_category,
                       pd.id_brand
                FROM product_detail pd
                         JOIN
                     product p ON p.id = pd.id_product
                         JOIN
                     size si ON si.id = pd.id_size
                         JOIN
                     color c ON c.id = pd.id_color
                         JOIN
                     category ca ON ca.id = pd.id_category
                         JOIN
                     brand b ON b.id = pd.id_brand
                         JOIN
                     sole s ON s.id = pd.id_sole
                         JOIN
                     material m ON m.id = pd.id_material
                         LEFT JOIN
                     image i ON pd.id = i.id_product_detail
                     LEFT JOIN product_promotion pp ON pd.id = pp.id_product_detail
                         LEFT JOIN promotion pr ON pr.id = pp.id_promotion
                WHERE pd.id = :id 
                GROUP BY pd.id
            """, nativeQuery = true)
    ClientProductResponse updateRealTime(String id);

    @Query(value = """
             SELECT MAX(pd.id) as id,
                MAX( pr.id) as promotion ,
                MAX( pr.status) as statusPromotion ,
                MAX(pr.discount_percentage) as value,
                MAX(si.name) as size,
                       CONCAT(p.name, ' ', m.name, ' ', c.name) AS name,
                       ca.name as nameCate,
                       b.name as nameBrand,
                       MAX(pd.price) as price,
                       MAX(pd.weight) as weight,
                       MAX(pd.discount_price) as amount,
                       GROUP_CONCAT(DISTINCT i.url) as image,
                pd.product_id,
                pd.color_id,
                pd.material_id,
                p.category_id,
                pd.brand_id,
                pd.size_id
                FROM
                product_detail pd
                    LEFT JOIN
                product_detail_promotion pp ON pp.product_detail_id = pd.id
                    LEFT JOIN
                promotion pr ON pr.id = pp.promotion_id
                    JOIN
                product p ON p.id = pd.product_id
                    JOIN
                color c ON c.id = pd.color_id
                    JOIN
                category ca ON ca.id = p.category_id
                    JOIN
                size si ON si.id = pd.size_id
                    JOIN
                brand b ON b.id = pd.brand_id
                    JOIN
                material m ON m.id = pd.material_id
                    LEFT JOIN
                image i ON pd.id = i.product_detail_id
                WHERE (:#{#id} is null or pd.id = :#{#id})
                AND p.deleted = 0 AND pd.deleted = 0 AND pd.discount_price > 0
                GROUP BY pd.product_id,
                pd.product_id,
                pd.color_id,
                pd.material_id,
                p.category_id,
                pd.brand_id,
                pd.size_id
            """, nativeQuery = true)
    ClientProductResponse getProductById(String id);

    @Query(value = """
             SELECT
                pd.id AS id,
                MAX(pr.discount_percentage) AS value,
                CONCAT(p.name, ' ', m.name, ' ', c.name) AS name,
                ca.name AS nameCate,
                b.name AS nameBrand,
                c.hex_code AS codeColor,
                c.name AS nameColor,
                si.name AS size,
                pd.price AS price,
                pd.weight AS weight,
                pd.discount_price AS amount,
                GROUP_CONCAT(DISTINCT i.url) AS image,
                pd.product_id,
                pd.color_id,
                pd.material_id,
                p.category_id,
                pd.brand_id,
                pd.size_id
            FROM
                product_detail pd
                LEFT JOIN product_detail_promotion pp ON pp.product_detail_id = pd.id
                LEFT JOIN promotion pr ON pr.id = pp.promotion_id
                JOIN product p ON p.id = pd.product_id
                JOIN color c ON c.id = pd.color_id
                JOIN category ca ON ca.id = p.category_id
                JOIN size si ON si.id = pd.size_id
                JOIN brand b ON b.id = pd.brand_id
                JOIN material m ON m.id = pd.material_id
                LEFT JOIN image i ON pd.id = i.product_detail_id
            WHERE
                p.id <> :#{#request.product}
                AND ca.id = :#{#request.category}
                AND b.id = :#{#request.brand}
            GROUP BY
                pd.id
            LIMIT 0, 50;
                        """, nativeQuery = true)
    List<ClientProductResponse> getProductCungLoai(@Param("request") ClientProductCungLoaiRequest request);

    @Query(value = """
                    SELECT pd.id as id,
                                                        si.name as size,
                                                        pd.price as gia,
                                                        pd.weight as weight
                                                 FROM product_detail pd
                                                 JOIN product p ON p.id = pd.product_id
                                                 JOIN color c ON c.id = pd.color_id
                                                 JOIN category ca ON ca.id = p.category_id
                                                 JOIN size si ON si.id = pd.size_id
                                                 JOIN brand b ON b.id = pd.brand_id
                                                 JOIN material m ON m.id = pd.material_id
                                                 LEFT JOIN image i ON pd.id = i.product_detail_id
                                                  WHERE pd.product_id = :#{#request.idProduct}
                                                  AND pd.color_id = :#{#request.idColor}
                                                  AND pd.category_id = :#{#request.idCategory}
                                                  AND pd.brand_id = :#{#request.idBrand}
                                                  AND pd.material_id = :#{#request.idMaterial}
                                                  AND p.deleted = 0 AND pd.deleted = 0 AND pd.discount_price > 0
                                                  ORDER BY si.name
            """, nativeQuery = true)
    List<ClientProductDetailResponse> getAllSize(ClientProductDetailRequest request);

    @Query(value = """
            SELECT
                MAX(CASE
                    WHEN pd.size_id = :#{#request.idSize} THEN pd.id
                    ELSE pd_inner_query.id
                END) AS id,
                c.id AS idColor,
                c.name AS nameColor,
                c.hex_code AS codeColor,
                GROUP_CONCAT(DISTINCT pd.size_id) AS id_sizes,
                MIN(si.name) AS size
            FROM
                product_detail pd
            LEFT JOIN (
                SELECT
                    pd_inner.id AS id,
                    pd_inner.color_id
                FROM
                    product_detail pd_inner
                WHERE
                    pd_inner.product_id = :#{#request.idProduct}
                    AND pd_inner.category_id = :#{#request.idCategory}
                    AND pd_inner.brand_id = :#{#request.idBrand}
                    AND pd_inner.material_id = :#{#request.idMaterial}
                    AND pd_inner.deleted = 0
                LIMIT 1
            ) AS pd_inner_query ON pd_inner_query.color_id = c.id
            JOIN
                product p ON p.id = pd.product_id
            JOIN
                color c ON c.id = pd.color_id
            JOIN
                category ca ON ca.id = p.category_id
            JOIN
                brand b ON b.id = pd.brand_id
            JOIN
                material m ON m.id = pd.material_id
            LEFT JOIN
                size si ON si.id = :#{#request.idSize} AND pd.size_id = si.id
            WHERE
                pd.product_id = :#{#request.idProduct}
                AND pd.category_id = :#{#request.idCategory}
                AND pd.brand_id = :#{#request.idBrand}
                AND pd.material_id = :#{#request.idMaterial}
                AND p.deleted = 0
                AND pd.deleted = 0
                AND pd.discount_price > 0
            GROUP BY
                c.id;
                        """, nativeQuery = true)
    List<ClientProductDetailResponse> getAllColor(ClientProductDetailRequest request);


    @Query(value = """
                            SELECT min(pd.price) as minPrice, max(pd.price) as maxPrice
            FROM product_detail pd
                 WHERE pd.deleted = 0 
            """, nativeQuery = true)
    ClientMinMaxPrice getMinMaxPriceProductClient();
}
