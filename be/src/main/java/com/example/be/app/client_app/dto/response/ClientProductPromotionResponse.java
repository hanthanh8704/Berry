package com.example.be.app.client_app.dto.response;


import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface ClientProductPromotionResponse {
    @Value("#{target.id}")
    Integer getId();
    String getName();

    Float getSize();

    String getAmount();

    String getDescription();

    BigDecimal getPrice();

    String getImage();

    String getWeight();

    @Value("#{target.product_id}")
    String getIdProduct();

    @Value("#{target.color_id}")
    String getIdColor();

    @Value("#{target.material_id}")
    String getIdMaterial();

    @Value("#{target.category_id}")
    String getIdCategory();

    @Value("#{target.brand_id}")
    String getIdBrand();


}
