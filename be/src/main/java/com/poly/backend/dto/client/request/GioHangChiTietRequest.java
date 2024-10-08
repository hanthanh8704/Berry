package com.poly.backend.dto.client.request;

import com.poly.backend.entity.English.Cart;
import com.poly.backend.entity.English.ProductDetail;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class GioHangChiTietRequest {

    private Integer id;

    private Cart cart;

    private ProductDetail productDetail;
    private BigDecimal price;
    private Integer quantity;

    private LocalDateTime lastModified;

    private LocalDateTime createdAt;
    private LocalDateTime updateAt;

    private String createdBy;

    private String updatedBy;


}


