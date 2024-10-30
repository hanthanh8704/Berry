package com.example.be.dto.client.request;

import com.example.be.entities.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@ToString
public class ProductDetailReuqestClient {
    private Integer id;


    private String detailCode;

    private Color color;


    private Material material;


    private Size size;

    private Product product;

    private Brand brand;


    private Sleeve sleeve;

    private Collar collar;

    private Integer quantity;

    private BigDecimal price;

    private BigDecimal discountPrice;

    private Integer discountPercentage;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String status;

    private String createdBy;

    private String updatedBy;

    private Float weight;

    private Boolean deleted;

    private List<Image> images;
    private List<Integer> idSPCTList;
}
