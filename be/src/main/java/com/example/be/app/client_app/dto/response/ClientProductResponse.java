package com.example.be.app.client_app.dto.response;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface ClientProductResponse {

    @Value("#{target.id}")
    Integer getId();
    Long getTimeRemainingInSeconds();
    Integer getCountSize();
    Integer getValue();

    String getName();
    @Value("#{target.nameBrand}")
    String getNameBrand();
    String getNameColor();

    String getAmount();
    @Value("#{target.price}")
    BigDecimal getPrice();
    @Value("#{target.image}")
    String getImage();
    @Value("#{target.weight}")
    String getWeight();

    String getSize();

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
