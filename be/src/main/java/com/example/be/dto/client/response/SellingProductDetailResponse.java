package com.example.be.dto.client.response;


import com.example.be.entities.ProductDetail;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
@Data
public class SellingProductDetailResponse {
    private Integer stt;
    private String image;
    private String name;
    private BigDecimal price;
    private BigDecimal sold;
    private BigDecimal sales;
    private Integer idProduct;
    private List<ProductDetail> listProductDetails;

}

