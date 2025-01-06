package com.example.be.app.client_app.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ClientFindProductRequest {
    private String id;
    private List<String> brand;
    private List<String> material;
    private List<String> color;
    private List<String> category;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String nameProductDetail;
}
