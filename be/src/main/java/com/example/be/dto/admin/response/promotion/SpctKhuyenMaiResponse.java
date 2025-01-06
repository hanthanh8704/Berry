package com.example.be.dto.admin.response.promotion;

import com.example.be.entities.Product;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Product.class})
public interface SpctKhuyenMaiResponse {
    @Value("#{target.indexs}")
    Integer getIndex();

    Long getId();

    String getName();

    String getSize();

    String getColor();

    String getBrand();

    String getCategory();

    Integer getQuantity();

    Boolean getStatus();

    Integer getDiscount();
}
