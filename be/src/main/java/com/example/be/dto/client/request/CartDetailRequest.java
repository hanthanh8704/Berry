package com.example.be.dto.client.request;

import com.example.be.entities.Cart;
import com.example.be.entities.ProductDetail;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CartDetailRequest {
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
