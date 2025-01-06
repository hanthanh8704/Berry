package com.example.be.dto.admin.response.bill;

import lombok.*;

/**
 * @author hanthanh
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceItemResponse {
    private String name;
    private int quantity;
    private String price;
    private String sum;
    private Integer promotion;
    private String discountPrice;
    private String status;

}
