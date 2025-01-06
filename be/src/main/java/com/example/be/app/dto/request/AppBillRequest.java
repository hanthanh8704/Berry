package com.example.be.app.dto.request;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
@Getter
@Setter
@ToString
public class AppBillRequest {
    private Integer productDetailId;

    private Integer billId;

    private Integer quantity;

    private BigDecimal price;
}
