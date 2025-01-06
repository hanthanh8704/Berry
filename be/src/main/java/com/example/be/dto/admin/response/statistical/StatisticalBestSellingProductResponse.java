package com.example.be.dto.admin.response.statistical;


import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

/**
 * @author hanthanh
 */
public interface StatisticalBestSellingProductResponse {
    @Value("#{target.indexs}")
    Integer getStt();
    @Value("#{target.image}")
    String getImage();
    @Value("#{target.name}")
    String getName();
    @Value("#{target.price}")
    BigDecimal getPrice();
    @Value("#{target.sold}")
    BigDecimal getSold();
    @Value("#{target.sales}")
    BigDecimal getSales();
    @Value("#{target.idProduct}")
    Integer getIdProduct();
    Integer getIdProductDetail();
}
